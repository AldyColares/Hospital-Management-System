let controllerPageUser = require('../controllers/mainPageUser');

module.exports = function(app){
    app.get('/mainPageUser', controllerPageUser.pageUser);
}