import flashUser from '../models/flashUser';
import Medicine from '../models/MongooseODM/midicine';
import mongoose from 'mongoose';
import pluck from '../util/pluck';

let controllerRegister = {};


controllerRegister.register = function (req, res, next) {
  flashUser(req, res);
  const body = req.body;
  Object.freeze(body);

  mongoose.findOne({ code: code }, function (err, foundMedicine) {
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
}

controllerRegister.registerMedicene = function (req, res) {
  flashUser(req, res);

  return res.render('registerMedicene');
};


export default controllerRegister;