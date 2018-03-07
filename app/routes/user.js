let userController = require('../controllers/user');

module.exports = function (app) {
  app.get('/login', userController.login);
  app.post('/login', userController.loginPost);

  app.get('/logout', userController.logOut);

  app.get('/registerUser', userController.registerUser)
  app.post('/registerUser', userController.registerUserPost);

  app.get('/confirmation', userController.confirmationRegisterUser);
  app.post('/resend', userController.resendTokenPost);
}