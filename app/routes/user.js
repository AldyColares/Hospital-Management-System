import { login, loginPost, logOut, registerUser,
         registerUserPost, confirmationRegisterUser, 
         resendTokenPost } from '../controllers/user';

export default function (app) {
  app.get('/login', login);
  app.post('/login', loginPost);

  app.get('/logout', logOut);

  app.get('/registerUser', registerUser)
  app.post('/registerUser', registerUserPost);

  app.get('/confirmation', confirmationRegisterUser);
  app.post('/resend', resendTokenPost);
}