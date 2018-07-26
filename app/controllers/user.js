import User from '../models/MongooseODM/user';
import flashUser from '../models/flashUser';
import Token from '../models/MongooseODM/token';
import hashedPassword from '../models/safety/secretCrypt';
import generateIdLogin from '../models/safety/generateIdLogin';
import sendEmailVericationUser from '../models/centralInformationModel';
import errorMiddleware from '../models/errorMiddleware';
import sendJsonResponse from '../models/respondInFormatJSON';
import pluck from '../util/pluck';
import { sign } from 'jsonwebtoken';

let userController = {}
const NODE_ENV = process.env.NODE_ENV || 'development';

/*
 * GET /login
 * Just for render of page login and in the future identification Token.
 */
// **PENDENT** Creat the Token for each request for client login.
userController.login = function (req, res) {
  flashUser(req, res);
  res.render('login');
};

/*
 * POST /login
 * Sign in with email and password
 */
userController.loginPost = function (req, res, next) {
  let body = req.body, message = '';
  flashUser(req, res);

  User.findOne({ name: body.name }, function (err, user) {
    if (err) return errorMiddleware(err, 500, next);
    if (!user) {
      message = 'The email address ' + req.body.email +
        ' is not associated with any account.' +
        'Double-check your email address and try again.';
      return sendJsonResponse(res, 400, message, next);
    }

    let resultCheckPassword = user.checkPassword(body.password, next);
    if (resultCheckPassword) {
      res.locals.currentUser = user.name;

      // save session the id and access
      let credentialUser = _.pick(user, ['name', 'idLogin', 'role', 'token']);

      req.session.user = credentialUser;
      console.log('object session: ' + req.session);

      res.status(200).render('main-page-user');
    }
    // the response for user will be with React.
    res.status(400).message('the login or password are wrongs').render('login');
  });
};

userController.logOut = function (req, res) {
  req.session = null;
  res.redirect('/');
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
    if (err) errorMiddleware('the terms of services do not was applay', 428, next);
  }
  // Make sure this account doesn't already exist
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) errorMiddleware(err, 500, next);

    // Make sure user doesn't already exist
    if (user) errorMiddleware('The email address you have entered is already associated' +
      'with another account.', 400, next);

    const body = req.body;
    Object.freeze(body);
    // Create model object and save the user.
    let fileUser = pluck(body, 'name', 'password', 'email', 'job', 'phone');
    user = new User(fileUser);

    user.validate(function (err) {
      if (err) errorMiddleware(err, 428, next);
    });

    user.save(function (err) {
      if (err) { return res.status(500).send({ msg: err.message }); }

      let tokenUserId = sign({ _id: user._id.toHexString() }, hashedPassword);

      // Create a verification token for this user.
      let token = new Token({ _userId: user._id, token: tokenUserId });

      // Save date base of the verification token.
      token.save(function (err) {
        if (err) errorMiddleware(err, 500, next);

        // note: I still can not test with verication send email. 
        if (NODE_ENV !== 'test') {
          const setupSendEmail = {},
            emailText = 'Hello,\n\n' + 'Please verify your account by clicking' +
              +'the link: \nhttp:\/\/' + req.headers.host + '\/confirmation-register-user\/'
              + token.token + '.\n';

          setupSendEmail.messageFromUser = 'A verification email has been sent to ' +
            setup.mailOptions.to + '.';

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
          res.status(200).render('confirm-token', { token: '/confirmation-register-user?token=' + token.token });
        }
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
    if (err) errorMiddleware(err, 500, next);

    if (!token) {
      return res.status(400).send({
        type: 'not-verified',
        msg: 'We were unable to find a valid token. Your token my have expired.'
      });
    }

    // If found a token, find a matching user
    User.findOne({ _id: token._userId }, function (err, user) {
      if (err) return errorMiddleware(err, 500, next);
      if (!user) return res.status(400).send(
        { msg: 'We were unable to find a user for this token.' }
      );

      if (user.isVerified) return res.status(400).send(
        {
          type: 'already-verified',
          msg: 'This user has already been verified.'
        });

      // Verify and save the user
      user.isVerified = true;
      user.idLogin = generateIdLogin(user.name);
      res.user = user.idLogin;
      user.save(function (err) {
        if (err) { return res.status(500).send({ msg: err.message }); }
      });
      // The user going redirect for main page.

      res.status(200).redirect('login');
    });
  }
  );
};

userController.resendTokenPost = function (req, res, next) {

  User.findOne({ email: req.body.email }, function (err, user) {
    if (!user) return res.status(400).send({ msg: 'We were unable to find a user with that email.' });

    if (user.isVerified) return res.status(400).send({
      msg: 'This account has already been' +
        'verified. Please log in.'
    });

    let tokenUserId = sign({ _id: user._id.toHexString() }, hashedPassword);
    // Create a verification token, save it, and send email
    let token = new Token({ _userId: user._id, token: tokenUserId });

    // Save the token
    token.save(function (err) {
      if (err) { return res.status(500).send({ msg: err.message }); }

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

userController.deleteProfile = async function (req, res, next) {
  const body = req.body,
    idLoginUser = req.body.idLogin;
  User.deleteOne({ idLogin: idLoginUser }, function (err) {
    errorMiddleware(err, 500, next);
  });

}


userController.updateProfile = async function (req, res, next) {
  const body = req.body,
    idLoginUser = req.body.idLogin,
    update = pluck(body, 'birth', 'age', 'gender'),
    options = { new: true, runValidators: true };
  delete req.body.idLogin;
  try {
    let updatedUser = await User.findOneAndUpdate({ IdLogin: idLoginUser }, { set: { update } }, options);
    console.log(updated);
    if (!updatedUser) {
      res.status(404).send()
    } else {
      res.status(200).redirect('update-profile');

    }
  } catch (err) {
    err.status = 500;
    next(err);
  }
};

export default userController;