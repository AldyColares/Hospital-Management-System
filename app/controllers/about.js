let controllerAbout = {};

controllerAbout.about = function(req, res) {
  res.render('about');
};

module.exports = controllerAbout;