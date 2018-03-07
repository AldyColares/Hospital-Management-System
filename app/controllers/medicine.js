
const flashUser = require('../models/flashUser'),
  Medicine = require('../MongooseODM/midicine'),
  { pluck } = require('../util/pluck'),
  authorizationRouter = 'registerMedicene';

const { authorization } = require('../models/safety/authorization');

let controllerRegister = {};

authorization.setJobAuthorization(authorizationRouter);

controllerRegister.register = function (req, res, next) {
  flashUser(req, res);
  const body = req.body;
  let isAuthorization = authorization.authoUser(req, res);
  // if result for false return feedback for user and he will redirect from page of login.
  if (!isAuthorization) { return res; }

  Medicine.findOne({ code: code }, function (err, foundMedicine) {
    if (err) {
      err.status = 503;
      return next(err);
    }
    if (foundMedicine) {
      let error = new Error('The medcine code you have entered is already associated' +
        'with another code.');
      error.status = 400;
      return next(error);
    }
    let fileMedicine = pluck(body, 'code', 'batch', 'quantity', 'expiration', 'prize');
    let newMedicine = new Medicine(fileMedicine);
    newMedicine.save(next);
    req.flash('info', `The of code medicene: ${req.body.code} registered successful`);
    return res.redirect('/registerMedicene');
  });

  controllerRegister.registerMedicene = function (req, res) {
    flashUser(req, res);
    let result = authorization.authoUser(req, res);
    if (!result) {
      return res;
    }
    return res.render('registerMedicene');
  };
}

module.exports = { controllerRegister };