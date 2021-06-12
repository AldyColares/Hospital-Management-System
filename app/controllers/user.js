import User from '../models/MongooseODM/user';
import flashUser from '../models/flashUser';
import Token from '../models/MongooseODM/token';
import hashedPassword from '../models/safety/secretCrypt';
import generateIdLogin from '../models/safety/generateIdLogin';
import sendEmailVericationUser from '../models/sendEmailCertificationUser';
import errorMiddleware from '../middleware/errorMiddleware';
import sendNewPage from '../middleware/sendNewPage';
import sendJsonResponse from '../models/sendJsonResponse';
import pluck from '../util/pluck';
import { sign } from 'jsonwebtoken';
import d from 'debug';



let userController = {}
const NODE_ENV = process.env.NODE_ENV || 'development';

/*
 * GET /login
 * Just for render of page login and in the future identification Token.
 */
// **PENDENT** Create the Token for each request for client login.
userController.login = function (req, res) {
  flashUser(req, res);
  res.render('login').end();
};

/*
 * POST /login
 * Sign in with email and password
 */
userController.loginPost = function (req, res, next) {
  debug('POST /loginPost');
  let body = req.body, message = '';
  flashUser(req, res);
  User.findOne({ name: body.name }, function (err, user) {
    if (err) return errorMiddleware(err, 500, next);
    if (!user) {
      message = 'The login or password do not found.';
      return sendJsonResponse(res, 400, message, next);
    }

    user.checkPassword(body.password, function (err, resultCheckPassword) {
      if (err) return errorMiddleware(err, 500, next);
      if (resultCheckPassword) {
        res.locals.currentUser = user.name;

        // save session the id and access
        pluck(user, ['name', 'idLogin', 'role', 'token'], function (err, credentialUser) {
          if (err) return errorMiddleware(err, 400, next);
          req.session.user = credentialUser;
          return sendNewPage(res, 200, 'main-page-user');
        });
      } else {
        // the response for user will be with React.
        return sendJsonResponse(res, 400, 'The error login or password', next);
      }

    });

  });
};

userController.logOut = function (req, res) {
  req.session = null;
  sendNewPage(res, 303, '/')

};

userController.registerUser = function (req, res, next) {
  flashUser(req, res);
  res.render('register-user');
};

/*
 * POST /registerUserPost
 * Register new user.
 */
userController.registerUserPost = function (req, res, next) {
  flashUser(req, res);
  // make sure user doesn't confirm terms
  if (req.body.checkboxApplyTermsOfService !== 'true') {
    let err = new Error('The terms of services do not was applay.');
    return errorMiddleware(err, 428, next);
    console.log('hello');
  }
  // Make sure this account doesn't already exist
  // ** The beauty callback hell ** I am will resolve .
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) return errorMiddleware(err, 500, next);

    // Make sure user doesn't already exist
    if (user) {
      const err = new Error('The email address you have entered is already associated ' +
        'with another account.');
      return errorMiddleware(err, 400, next);
    };

    const body = req.body;
    Object.freeze(body);
    // Create model object and save the user.
    pluck(body, ['name', 'password', 'email', 'job', 'phone'], function (err, fileUser) {
      if (err) return errorMiddleware(err, 400, next);

      user = new User(fileUser);
      user.validate(function (err) {
        if (err) return errorMiddleware(err, 428, next);
      });
      user.save(function (err) {
        if (err) return errorMiddleware(err, 400, next);
        let tokenUserId = sign({ _id: user._id.toHexString() }, hashedPassword);
        // Create a verification token for this user.
        let token = new Token({ _userId: user._id, token: tokenUserId });

        // Save date base of the verification token.
        token.save(function (err) {
          if (err) return errorMiddleware(err, 500, next);

          // note: I still can not test with verication send email for new user. 
          if (NODE_ENV !== 'test') {
            const setupSendEmail = {},
              emailText = 'Hello,\n\n' + 'Please verify your account by clicking' +
                +'the link: \nhttp:\/\/' + req.headers.host + '\/confirmation-register-user\/'
                + token.token + '.\n';

            setupSendEmail.messageFromUser = 'A verification email has been sent to ' +
              user.email + '.';

            setupSendEmail.mailOptions = {
              from: 'no-reply@yourwebapplication.com',
              to: user.email,
              subject: 'Account Verification Token',
              text: emailText
            };

            setupSendEmail.res = res;
            setupSendEmail.next = next;
            sendEmailVericationUser(setupSendEmail);
          } else {
            res.status(200).render('confirm-token', { token: '/confirmation-register-user?token=' + token.token }).end();
          }
        });
      });
    });
  });
};

/*
 * Confirmation if the user exists through in the email.
 *  
 */
userController.confirmationRegisterUser = function (req, res, next) {

  // Find a matching token.
  Token.findOne({ token: req.query.token }, function (err, token) {
    if (err) return errorMiddleware(err, 500, next);

    if (!token) {
      return res.status(400).send({
        type: 'not-verified',
        msg: 'We were unable to find a valid token. Your token my have expired.'
      }).end();
    }

    // If found a token, find a matching user
    User.findOne({ _id: token._userId }, function (err, user) {
      if (err) return errorMiddleware(err, 500, next);
      if (!user) return res.status(400).send(
        { msg: 'We were unable to find a user for this token.' }
      ).end();

      if (user.isVerified) return res.status(400).send(
        {
          type: 'already-verified',
          msg: 'This user has already been verified.'
        }).end();

      // Verify and save the user
      user.isVerified = true;
      user.idLogin = generateIdLogin(user.name);
      res.user = user.idLogin;
      user.save(function (err) {
        if (err) { return res.status(500).send({ msg: err.message }).end(); }
      });
      // The user going redirect for main page.

      res.status(200).redirect('login').end();
    });
  }
  );
};

userController.resendTokenPost = function (req, res, next) {

  User.findOne({ email: req.body.email }, function (err, user) {
    if (!user) return res.status(400).send({ msg: 'We were unable to find a user with that email.' }).end();

    if (user.isVerified) return res.status(400).send({
      msg: 'This account has already been' +
        'verified. Please log in.'
    }).end();

    let tokenUserId = sign({ _id: user._id.toHexString() }, hashedPassword);
    // Create a verification token, save it, and send email
    let token = new Token({ _userId: user._id, token: tokenUserId });

    // Save the token
    token.save(function (err) {
      if (err) { return res.status(500).send({ msg: err.message }).end(); }

      let emailText = 'Hello,\n\n' + 'Please verify your account by clicking' +
        +'the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/'
        + token.token + '.\n';
      setupSendEmail.mailOptions = {
        from: 'no-reply@yourwebapplication.com',
        to: user.email,
        subject: 'Account Verification Token',
        text: emailText
      };
      setupSendEmail.messageFromUser = 'A verification email has been sent to ' +
        user.email + '.';
      setupSendEmail.res = res;
      setupSendEmail.next = next;
      sendEmailVericationUser(setupSendEmail);
    });

  });
};
/**
 * the delete the user
 * DELETE /delete-user/:id
 */
userController.deleteProfile = function (req, res, next) {
  const id = req.params.id;
  User.deleteOne({ idLogin: id }, function (err) {
    if (err) return errorMiddleware(err, 500, next);
    message = { message: 'The token deleted successfully.', success: true };
    return sendJsonResponse(res, 204, message, next);
  });

}

/**
 * the update the user
 * PUT /update-user/:id
 */
userController.updateProfile = async function (req, res, next) {
  const body = req.body, idLoginUser = req.params.id
  pluck(body, ['birth', 'age', 'gender'], function (err, update) {
    if (err) return errorMiddleware(err, 400, next);

    options = { new: true, runValidators: true };
    delete req.body.idLogin;
    try {
      let updatedUser = await User.findOneAndUpdate({ IdLogin: idLoginUser },
        { set: { update } }, options);
      //console.log(updated);
      if (!updatedUser) {
        res.status(404).send().end()
      } else {
        res.status(200).redirect('update-profile').end();

      }
    } catch (err) {
      err.status = 500;
      next(err);
    }
  }),
};

export default userController;