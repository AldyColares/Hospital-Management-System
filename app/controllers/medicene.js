
const validateNewMedicene = require('../models/checkNewDocument/validateNewMedicene'),
  addNewMedicene = require('../models/addNewDocument/addNewMedicene'),
  flashUser = require('../models/flashUser'),
  authorizationRouter = 'registerMedicene';

const { authorization } = require('../models/safety/authorization');

let controllerRegister = {};

authorization.setJobAuthorization(authorizationRouter);

controllerRegister.register = function (req, res, next) {
  flashUser(req, res);

  let isAuthorization = authorization.authoUser(req, res);
  // if result for false return feedback for user and he will redirect from page of login.
  if (!isAuthorization) {return res;}

  let existDocument = validateNewMedicene(req.body);
  if (existDocument === true) {

    req.flash('error', 'Code already exists');
    return res.redirect('/registerMedicene');
  }
  addNewMedicene(req.body, next);

  req.flash('info', `The of code medicene: ${req.body.code} registered successful`);
  return res.redirect('/registerMedicene');
};

controllerRegister.registerMedicene = function (req, res) {
  flashUser(req, res);
  let result = authorization.authoUser(req, res);
  if (!result) {
    return res;
  }
  return res.render('registerMedicene');
};
module.exports = controllerRegister;