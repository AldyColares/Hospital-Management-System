/*jshint esversion: 6 */
const User = require('../models/MongooseODM/user'),
    flashUser = require('../models/flashUser'),
    Token = require('../models/MongooseODM/token'),
    secretCrypt = require('../models/safety/secretCrypt'),
    generateIdLogin = require('../models/safety/generateIdLogin'),
    nodemailer = require('nodemailer'),
    {pluck} = require('../util/pluck'),
    jwt = require('jsonwebtoken');

userController = {};

userController.login = function (req, res) {
    flashUser(req, res);
    res.render('login');
};

/**
 * POST /login
 * Sign in with email and password
 */
userController.loginPost = function (req, res, next) {
    let body = req.body;
    flashUser(req, res);
    User.findOne({ name: body.name }, function (err, user) {
        if (!user) return res.status(401).send({
            msg: 'The email address ' + req.body.email +
                ' is not associated with any account.' +
                'Double-check your email address and try again.'
        });
        User.findByCredentials(user, body.password).then((user) => {
            res.locals.currentUser = user.name;

            // save session the id and access
            let credentialUser = _.pick(user, ['name', 'idLogin', 'role', 'token']);

            req.session.user = credentialUser;
            console.log('object session: ' + req.session);
        }).catch((e) => {
            console.error(e.message + '\n' + e.stack);
            res.status(400).send();
        });
        res.status(200).render('mainPageUser');
    });
};

userController.logOut = function (req, res) {
    req.session = null;
    res.redirect("/");
};

userController.registerUser = function (req, res, next) {
    flashUser(req, res);
    res.render('registerUser');

};

/**
 * POST /registerUserPost
 */
userController.registerUserPost = function (req, res, next) {
    flashUser(req, res);
    // make sure user doesn't comfirm terms
    if (req.body.checkboxApplyTermsOfService !== "true") {
        var error = new Error('the terms of services do not was applay');
        error.status = 428;
        return next(error);
    }
    // Make sure this account doesn't already exist
    User.findOne({ email: req.body.email }, function (err, user) {
        // Make sure user doesn't already exist
        if (user){
            //return res.status(400).send({ msg: 'The email address you have entered is already associated with another account.' });
            var error = new Error('The email address you have entered is already associated with another account.');
            error.status = 400;
            return next(error);

        }
        const body = req.body;
        // Create and save the user
        var fileUser = pluck(body, 'name', 'password', 'email', 'job', 'phone');
        user = new User(fileUser);

        user.validate(function (err) {
            if (err) { return res.status(428).render('428', { msg: err.message }); }
        });

        user.save(function (next) {
            console.log("next: " +next);
            if (err) { return res.status(500).send({ msg: err.message }); }

            var tokenUserId = jwt.sign({ _id: user._id.toHexString() }, secretCrypt.hashedPassword);

            // Create a verification token for this user.
            var token = new Token({ _userId: user._id, token: tokenUserId });

            // Save date base the verification token
            token.save(function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).render('confirmToken', { token: "/confirmation?token=" + token.token });

                /*
                // Send the email
                let transporter = nodemailer.createTransport({
                    host: 'smtp.ethereal.email',
                    port: 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: "al@gmail", // generated ethereal user
                        pass: "account.pass"  // generated ethereal password
                    }
                });
                var mailOptions = { from: 'no-reply@yourwebapplication.com', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
                transporter.sendMail(mailOptions, function (err) {
                    if (err) { return res.status(500).send({ msg: err.message }); }
                    res.status(200).send('A verification email has been sent to ' + user.email + '.');
                });
                */
            });
        });
    });
};

userController.confirmationRegisterUser = function (req, res, next) {

    // Find a matching token
    Token.findOne({ token: req.query.token }, function (err, token) {

        if (!token) return res.status(400).send({
            type: 'not-verified',
            msg: 'We were unable to find a valid token. Your token my have expired.'
        });
        // If we found a token, find a matching user
        User.findOne({ _id: token._userId }, function (err, user) {
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

    User.findOne({ email: req.body.email }, function (err, user) {
        if (!user) return res.status(400).send({ msg: 'We were unable to find a user with that email.' });
        if (user.isVerified) return res.status(400).send({ msg: 'This account has already been verified. Please log in.' });

        var tokenUserId = jwt.sign({ _id: user._id.toHexString() }, secretCrypt.hashedPassword);
        // Create a verification token, save it, and send email
        var token = new Token({ _userId: user._id, token: tokenUserId });

        // Save the token
        token.save(function (err) {
            if (err) { return res.status(500).send({ msg: err.message }); }

            // Send the email
            var transporter = nodemailer.createTransport({
                service: 'Sendgrid',
                auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD }
            });
            var mailOptions = {
                from: 'no-reply@codemoto.io', to: user.email, subject: 'Account Verification Token',
                text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' +
                    req.headers.host + '\/confirmation\/' + token.token + '.\n'
            };
            transporter.sendMail(mailOptions, function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).send('A verification email has been sent to ' + user.email + '.');
            });
        });

    });
};
module.exports = userController;