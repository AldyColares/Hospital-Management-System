import User, { findOne, findOneAndUpdate } from '../models/MongooseODM/user';
import flashUser from '../models/flashUser';
import Token, { findOne as _findOne } from '../models/MongooseODM/token';
import { hashedPassword } from '../models/safety/secretCrypt';
import generateIdLogin from '../models/safety/generateIdLogin';
import sendEmailVericationUser from '../models/centralInformationModel'
import { createTransport } from 'nodemailer';
import pluck from '../util/pluck';
import { sign } from 'jsonwebtoken';

let userController = {};

userController.login = function (req, res) {
  flashUser(req, res);
  res.render('login');
};

/*
 * POST /login
 * Sign in with email and password
 */
userController.loginPost = function (req, res, next) {
  let body = req.body;
  flashUser(req, res);
  findOne({ name: body.name }, function (err, user) {
    if (!user) return res.status(401).send({
      msg: 'The email address ' + req.body.email +
        ' is not associated with any account.' +
        'Double-check your email address and try again.'
    });
    let resultCheckPassword = user.checkPassword(body.password, next);
    if (resultCheckPassword) {
      res.locals.currentUser = user.name;

      // save session the id and access
      let credentialUser = _.pick(user, ['name', 'idLogin', 'role', 'token']);

      req.session.user = credentialUser;
      console.log('object session: ' + req.session);

      res.status(200).render('mainPageUser');
    }
    // the response for user will be with React.
    res.status(400).message('the login or password are wrongs').renser('login');
  });
};

userController.logOut = function (req, res) {
  req.session = null;
  res.redirect('/');
};

userController.registerUser = function (req, res, next) {
  flashUser(req, res);
  res.render('registerUser');
};

/*
 * POST /registerUserPost
 */
userController.registerUserPost = function (req, res, next) {
  flashUser(req, res);
  // make sure user doesn't confirm terms
  if (req.body.checkboxApplyTermsOfService !== 'true') {
    let error = new Error('the terms of services do not was applay');
    error.status = 428;
    return next(error);
  }
  // Make sure this account doesn't already exist
  findOne({ email: req.body.email }, function (err, user) {
    // Make sure user doesn't already exist
    if (user) {
      let error = new Error('The email address you have entered is already associated' +
        'with another account.');
      error.status = 400;
      return next(error);
    }

    const body = req.body;
    Object.freeze(body);
    // Create model objec and save the user.
    let fileUser = pluck(body, 'name', 'password', 'email', 'job', 'phone');
    user = new User(fileUser);

    user.validate(function (err) {
      if (err) { // old version: { return res.status(428).render('428', { msg: err.message }); }
        let error = new Error('err.message');
        error.status = 428;
        return next(error);
      }
    });

    user.save(function (err) {
      if (err) { return res.status(500).send({ msg: err.message }); }

      let tokenUserId = sign({ _id: user._id.toHexString() }, hashedPassword);

      // Create a verification token for this user.
      let token = new Token({ _userId: user._id, token: tokenUserId });

      // Save date base the verification token
      token.save(function (err) {
        if (err) { // old version: { return res.status(500).send({ msg: err.message }); }
          let error = new Error(err.message);
          error.status = 500;
          return next(error);
        }

        res.status(200).render('confirmToken', { token: '/confirmation?token=' + token.token });
        sendEmailVericationUser(res, next);
      });
    });
  });
};

userController.confirmationRegisterUser = function (req, res, next) {

  // Find a matching token
  _findOne({ token: req.query.token }, function (err, token) {

    if (!token) {
      return res.status(400).send({
        type: 'not-verified',
        msg: 'We were unable to find a valid token. Your token my have expired.'
      });
    }

    // If we found a token, find a matching user
    findOne({ _id: token._userId }, function (err, user) {
      if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
      if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });

      // Verify and save the user
      user.isVerified = true;
      user.idLogin = generateIdLogin(user._id, user.name);
      res.user = user.idLogin;
      user.save(function (err) {
        if (err) { return res.status(500).send({ msg: err.message }); }
        //res.status(200).send("The account has been verified. Please log in.");
      });
      // The user going redirect for main page.

      res.status(200).redirect('login');
    });
  }
  );
};

userController.resendTokenPost = function (req, res, next) {

  findOne({ email: req.body.email }, function (err, user) {
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

      // Send the email
      let transporter = createTransport({
        service: 'Sendgrid',
        //auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD }
      });
      let mailOptions = {
        from: 'no-reply@codemoto.io', to: user.email, subject: 'Account Verification Token',
        text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' +
          req.headers.host + '\/confirmation\/' + token.token + '.\n'
      };
      transp orter.sendMail(mailOptions, function (err) {
        if (err) { return res.status(500).send({ msg: err.message }); }
        res.status(200).send('A verification email has been sent to ' + user.email + '.');
      });
    });

  });
};

userController.updateProfile = function (req, res, next) {
  const body = req.body,
    idLoginUser = req.body.idLogin,
    update = pluck(body, 'birth', 'age', 'gender'),
    options = { new: true, runValidators: true };
  delete req.body.idLogin;
  findOneAndUpdate({ IdLogin: idLoginUser }, { set: { update } }, options, (err, updated) => {
    if (err) {
      err.status = 500;
      next(err);
    }
    console.log(updated);
    next();
  });
};

export default userController;