var userController = require('../controllers/user');

module.exports = function (app) {
    app.get('/login', userController.login);
    app.post('/login', userController.loginPost);
    
    app.get('/registerUser', userController.registerUser)
    app.post('/registerUser', userController.registerUserPost);

    app.post('/confirmation', userController.confirmationPost);
    app.post('/resend', userController.resendTokenPost);
}