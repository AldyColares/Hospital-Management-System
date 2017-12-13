var controller = require('../controllers/medicene');

module.exports = function(app){
    app.get('/registerMedicene', controller.registerMedicene);
    app.post('/registerMedicene', controller.register);
}