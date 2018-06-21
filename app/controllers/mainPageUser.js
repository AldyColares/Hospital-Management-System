import flashUser from '../models/flashUser';

let mainPageUser = {};
mainPageUser.pageUser = function (req, res, next) {
  flashUser(req, res);
  res.render('mainPageUser');
}

export default mainPageUser;