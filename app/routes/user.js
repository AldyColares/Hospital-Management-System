import  user  from '../controllers/user';

export default function (app) {
  app.get('/login', user.login);
  app.post('/login', user.loginPost);

  app.get('/logout', user.logOut);

  app.get('/register-user', user.registerUser)
  app.post('/register-user', user.registerUserPost);

  app.post('/update-profile', user.updateProfile);

  app.post('/delete', user.deleteProfile);

  app.get('/confirmation-register-user', user.confirmationRegisterUser);
  app.post('/resend', user.resendTokenPost);
}