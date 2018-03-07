const controller = require("../controllers/home");
const controllerAbout = require("../controllers/about");

module.exports = function(app) {
  app.get('/about', controllerAbout.about);
  app.use('*', controller.error404);
}