const flashUser = require('../models/flashUser');

let mainPageUser = {};

mainPageUser.pageUser = function (req, res, next) {
  flashUser(req, res);
  res.render('mainPageUser');
}
module.exports = mainPageUser;