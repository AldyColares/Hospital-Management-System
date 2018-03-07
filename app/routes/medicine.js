const controller = require('../controllers/medicine');
const { authenticate } = require('../models/safety/authenticate');

module.exports = function (app) {
  app.get('/registerMedicene', authenticate, controller.registerMedicene);
  app.post('/registerMedicene', authenticate, controller.register);
}