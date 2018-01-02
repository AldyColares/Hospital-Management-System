const User = require('../models/MongooseODM/user')
    , flashUser = require('../models/flashUser')
    , Token = require('../models/MongooseODM/token')
    , nodemailer = require('nodemailer')
    , secretCrypt = require('../models/safety/secretCrypt')
    , jwt = require('jsonwebtoken');

userController = {};

userController.login = function (req, res) {
    flashUser(req, res)
    res.render('login');
}
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
            return user.generateAuthToken().then((token) => {
                res.header('x-auth', token).send(user);
            });
        }).catch((e) => {
            res.status(400).send();
        });
        res.locals.currentUser = body.name;
	req.session.user = user;
        res.status(200).render('mainPageUser');
        /*  
        user.comparePassword(req.body.password, function (err, isMatch) {
            if (!isMatch) return res.status(401).send({ msg: 'Invalid email or password' });

            // Make sure the user has been verified
            if (!user.isVerified) return res.status(401).send({
                type: 'not-verified',
                msg: 'Your account has not been verified.'
            });
            var token = user.tokens.token;
            res.header('x-auth', token).send(user);
        });
        */
    });
};

userController.logOut =  function (req, res) {
    req.session = null;	
    res.redirect("/");
};


userController.registerUser = function (req, res) {
    flashUser(req, res);
    res.render('registerUser');
}

/**
 * POST /registerUserPost
 */
userController.registerUserPost = function (req, res, next) {
    flashUser(req, res);
    // make sure user doesn't comfirm terms
    console.log("checkboxApplyTermsOfService: " + req.body.checkboxApplyTermsOfService);

    if (req.body.checkboxApplyTermsOfService !== "true") {
        return res.status(428).send({ msg: 'the terms of services do not was applay' });
    }

    // Make sure this account doesn't already exist
    User.findOne({ email: req.body.email }, function (err, user) {

        // Make sure user doesn't already exist
        if (user) return res.status(400).send({ msg: 'The email address you have entered is already associated with another account.' });

        // Create and save the user
        user = new User({ name: req.body.name, phone: req.body.phone, email: req.body.email, password: req.body.password });
        console.log("job: " + req.body.job);
        user.generateAuthToken(req.body.job);
        user.save(function (err, next) {

            if (err) { return res.status(500).send({ msg: err.message }); }
            /* 
             req.flash('info', `the new user ${user.name} registered successful/n 
                                    the number of Id for login is: ${user.name}.`);
             res.redirect('/registerUser');
             */

            var tokenUserId = jwt.sign({ _id: user._id.toHexString() }, secretCrypt.hashedPassword);

            // Create a verification token for this user
            var token = new Token({ _userId: user._id, token: tokenUserId });

            // Save the verification token
            token.save(function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }

                res.locals.token = req.flash('token');
                req.flash('token', token.token);
                res.render('confirmToken', { token: "/confirmation?token=" + token.token });

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

        if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });

        // If we found a token, find a matching user
        User.findOne({ _id: token._userId }, function (err, user) {
            if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
            if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });

            // Verify and save the user
            user.isVerified = true;
            user.save(function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).send("The account has been verified. Please log in.");
            });
        });
    });
};

userController.resendTokenPost = function (req, res, next) {


    User.findOne({ email: req.body.email }, function (err, user) {
        if (!user) return res.status(400).send({ msg: 'We were unable to find a user with that email.' });
        if (user.isVerified) return res.status(400).send({ msg: 'This account has already been verified. Please log in.' });

        // Create a verification token, save it, and send email
        var token = new Token({ _userId: user._id, token: "skjfçalkfjçsdjkfasçfdkjasçefwejwk" });

        // Save the token
        token.save(function (err) {
            if (err) { return res.status(500).send({ msg: err.message }); }

            // Send the email
            var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
            var mailOptions = { from: 'no-reply@codemoto.io', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
            transporter.sendMail(mailOptions, function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).send('A verification email has been sent to ' + user.email + '.');
            });
        });

    });
};

module.exports = userController;