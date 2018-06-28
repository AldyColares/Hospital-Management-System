import { login, loginPost, logOut, registerUser,
         registerUserPost, confirmationRegisterUser, 
         resendTokenPost } from '../controllers/user';

export default function (app) {
  app.get('/login', login);
  app.post('/login', loginPost);

  app.get('/logout', logOut);

  app.get('/register-user', registerUser)
  app.post('/register-user', registerUserPost);

  app.get('/confirmation-register-user', confirmationRegisterUser);
  app.post('/resend', resendTokenPost);
}