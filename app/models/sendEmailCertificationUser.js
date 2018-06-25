import { createTransport } from 'nodemailer';
// Setup of send the email
let sendemail =  (res, next) => {
let transporter = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "al@gmail", // generated ethereal user
        pass: "account.pass"  // generated ethereal password
    }
});

let mailOptions = {
    from: 'no-reply@yourwebapplication.com',
    to: user.email, subject: 'Account Verification Token',
    text: 'Hello,\n\n' + 'Please verify your account by clicking' +
        +'the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/'
        + token.token + '.\n'
};

transporter.sendMail(mailOptions, function (err) {
    if (err) { // return res.status(500).send({ msg: err.message }); }
        let error = new Error(err.message);
        error.status = 500;
        return next(error);
    }
    res.status(200).send('A verification email has been sent to ' + user.email + '.');
});
}
export default sendemail;