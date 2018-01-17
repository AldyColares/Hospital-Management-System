var handlingErrorController = require('../controllers/handlingError');

module.exports = function (app) {
  
    app.use(handlingErrorController.handlingError);
}
