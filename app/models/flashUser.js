module.exports = function (req, res) {
  res.locals.currentUser = req.user;
  res.locals.infos = req.flash('info');
  res.locals.errors = req.flash('error');
}