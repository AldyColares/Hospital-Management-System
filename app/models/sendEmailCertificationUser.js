import { createTransport } from 'nodemailer';
import sendEmailUserAndPassword from './centralInformationModel';
import errorMiddleware from '../middleware/errorMiddleware';

// Setup of send the email
let sendemail = (setup) => {
    let transporter = createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: sendEmailUserAndPassword.user, // generated ethereal user
            pass: sendEmailUserAndPassword.password  // generated ethereal password
        }
    });
    transporter.sendMail(setup.mailOptions, function (err) {
        if (err) errorMiddleware(err, 500, next);
        setup.res.status(200).send(setup.messageFromUser);
    });
}
export default sendemail;