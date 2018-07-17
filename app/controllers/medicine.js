import flashUser from '../models/flashUser';
import Medicine from '../models/MongooseODM/medicine';
import mongoose from 'mongoose';
import errorMiddleware from '../models/errorMiddleware';
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
      let error = new Error('The medicine code you have entered is already associated' +
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

controllerRegister.delete = function (req, res, next) {
  const code = req.body.code;
  Medicine.deleteOne({ code: code }, function (err) {
    if (err) errorMiddleware(err.message, 500, next);

    return res.status(200).type('json').json({
      message: 'Medicine successful deleted'
    });
  });
}

controllerRegister.update = function (req, res, next) {
  const code = req.body.code,
    update = req.body,
    options = { new: true, runValidators: true };

  Medicine.updateOne({ 'code': code }, { set: { update } }, options, function (err, doc) {
    if (err) errorMiddleware(err.message, 500, next);

    if (doc) return res.status(200).type('json').json(doc);
  });
}

controllerRegister.increaseOrDecrementQauntityDrogs = function (req, res, next) {
  const code = req.body.code,
    increaseOrdecrement = req.body.increaseOrdecrement,
    options = { new: true, runValidators: true };

  // if the user insert the valor zero for decrement or encrease.
  if (!increaseOrdecrement) return res.status(412).type('json').json({ 'message': 'The valor is zero' });

  Medicine.findOne({ 'code': code }, function (err, medicine) {
    if (err) errorMiddleware(err.message, 500, next);
    if (medicine) {
      const quantityMed = medicine.quantity;
      if (!quantityMed) return res.status(200).type('json').json({ 'message': 'the medicine is over.' });
      if ( quantityMed > increaseOrdecrement )
        const newQuantityMed = quantityMed - increaseOrdecrement;
        Medicine.updateOne({ 'code': code }, {set: { quantity: newQuantityMed }}, options, function(err, medicene){
          return res.status(200).type('json').json({ 'message': medicine });
        });
    }
    const message = 'Medicine' + req.body.code + ' do not found.';
    return res.status(200).type('json').json({ 'message': medicine });

  })
}

controllerRegister.registerMedicene = function (req, res) {
  flashUser(req, res);

  return res.render('registerMedicene');
};


export default controllerRegister;