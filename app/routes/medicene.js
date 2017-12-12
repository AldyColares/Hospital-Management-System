var controller = require('../controllers/medicene');

module.exports = function(app){
    app.post('signupMedicene', controller.register);
}