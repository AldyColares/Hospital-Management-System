import flashUser from '../models/flashUser';
import Medicine from '../models/MongooseODM/medicine';
import mongoose from 'mongoose';
import errorMiddleware from '../models/errorMiddleware';
import pluck from '../util/pluck';
import respondInFormatJSON from '../models/centralInformationModel';

let controllerRegister = {};

controllerRegister.loadPageRegisterMedicine = function (req, res) {
  flashUser(req, res);

  return res.render('registerMedicine');
};

controllerRegister.registerMedicine = function (req, res, next) {
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
    req.flash('info', `The of code medicine: ${req.body.code} registered successful`);
    return res.redirect('/registerMedicene');
  });
}

controllerRegister.read = function (req, res, next) {
  if (req.query.code) {
    message = { 'message': 'The name field of medicine do not found', 'statusStockMedicine': 'bad request' };
    return respondInFormatJSON(res, 400, message, next);
  };
  const name = req.query.name;
  // ueturn all medicine with same name. the medicines have expiration.
  Medicine.find({ 'name': name }, null, { sort: { 'expiration': 1 } }, function (err, listMedicine) {
    if (err) errorMiddleware(err.message, 500, next);
    if (!listMedicine) {
      message = { 'message': 'The name of medicine do not exist.', 'statusStockMedicine': 'not exist' }
      respondInFormatJSON(res, 403, message, next);
    }
    respondInFormatJSON(res, 200, message, next);
  });
}

controllerRegister.update = function (req, res, next) {
  //Pedent: Check if body === {} and feedback for client.
  const code = req.body.code,
    update = req.body,
    options = { new: true, runValidators: true };

  Medicine.updateOne({ 'code': code }, { $set: { update } }, options, function (err, doc) {
    if (err) errorMiddleware(err.message, 500, next);

    if (doc) return res.status(200).type('json').json(doc);
  });
}

controllerRegister.incremOrDecremQauntityMedicine = function (req, res, next) {
  const code = req.body.code,
    incremOrdecrem = req.body.incrementOrdecrement,
    options = { new: true, runValidators: true };

  let message = {},
    newQuantityMed = '';

  // if the user insert the valor zero for decrement or encrease.
  if (!incrementOrdecrement) {
    message = { 'message': 'The valor is zero', 'statusStockMedicine': 'Request valor of client is zero' };
    return respondInFormatJSON(res, 412, message, next);
  };

  Medicine.findOne({ 'code': code }, function (err, medicine) {
    if (err) errorMiddleware(err.message, 503, next);
    if (medicine) {
      const quantityMed = medicine.quantity;
      if (!quantityMed) {
        message = { 'message': 'the medicine is over.', 'statusStockMedicine': 'quantity is zero' };
        return respondInFormatJSON(res, 200, message, next);
      }

      if (quantityMed > incrementOrdecrement) {
        const newQuantityMed = quantityMed - incrementOrdecrement;
        Medicine.updateOne({ 'code': code }, { set: { quantity: newQuantityMed } }, options, function (err, medicine) {
          message = { 'message': 'successful removed of stock.', 'statusStockMedicine': 'successful' };
          return respondInFormatJSON(res, 200, message, next);

        });
      } else {
        let messageUser = `The stock of the medicine is insufficient. The quantity in the stock: ${quantityMed}`;
        const message = { 'message': messageUser, 'statusStockMedicine': 'stock insufficient' }
        return respondInFormatJSON(res, 200, message, next);
      }
    }

    const messageUser = `Medicine  ${req.body.code} do not found.`;
    message = { 'message': messageUser, 'statusStockMedicine': 'not found' }
    return respondInFormatJSON(res, 200, message, next);

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

export default controllerRegister;