var controller = require("../controllers/home");
var controllerAbout = require("../controllers/about");

module.exports = function(app) {
  app.get('/index', controller.index);
  app.get('/', controller.index);
  app.get('/about', controllerAbout.about);
  app.use('*', controller.error404);
}