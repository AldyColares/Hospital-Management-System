import flashUser from '../models/flashUser';
import Medicine from '../models/MongooseODM/medicine';
import mongoose, { ObjectID } from 'mongodb';
import mongoose from 'mongoose';
import errorMiddleware from '../models/errorMiddleware';
import sendJsonResponse from '../models/sendJsonResponse';
import pluck from '../util/pluck';

let controllerRegister = {};

controllerRegister.loadPageRegisterMedicine = function (req, res) {
  flashUser(req, res);
  return res.render('registerMedicine');
};

controllerRegister.registerMedicine = function (req, res, next) {
  flashUser(req, res);
  const body = req.body;
  let message = '';
  if (!body) {
    message = 'you send empty fields';
    return sendJsonResponse(res, 400, message, next);
  }
  Object.freeze(body);

  Medicine.findOne({ batch: body.batch }, function (err, foundMedicine) {
    if (err) {
      err.status = 503;
      return next(err);
    }
    if (foundMedicine) {
      let error = new Error('The medicine batch you have entered is already associated' +
        'with another batch.');
      error.status = 400;
      return next(error);
    }
    let fileMedicine = pluck(body, 'name', 'batch', 'quantity', 'expiration', 'prize');
    let newMedicine = new Medicine(fileMedicine);
    newMedicine.save(function (error, employee) {
      if (error) return errorMiddleware(error, 500, next);
      message = { message: 'Register successfull!', employee: employee }
      return sendJsonResponse(res, 201, message, next);
    });
    req.flash('info', `The of code medicine: ${req.body.code} registered successful`);
    return res.redirect('/registerMedicene');
  });
}

/**
 * GET  /search-medicine/:name
 * the result of seach of client.
 *  
 */
controllerRegister.read = function (req, res, next) {
  if (req.params.name) {
    message = { 'message': 'The name field of medicine do not found', success: false };
    return sendJsonResponse(res, 400, message, next);
  };
  const name = req.params.name;
  // Ruturn all medicine with same name. the medicines have expiration.
  Medicine.find({ 'name': name }, null, { sort: { 'expiration': 1 } }, function (err, listMedicine) {
    if (err) errorMiddleware(err, 500, next);
    if (!listMedicine) {
      message = { 'message': 'The name of medicine do not exist.', success: false }
      sendJsonResponse(res, 403, message, next);
    }
    message = { message: 'the list of result.', success: true };
    sendJsonResponse(res, 200, message, next);
  });
}

/**
 * PUT /update-medicine/:id
 * the update of any medicine.
 */
controllerRegister.update = function (req, res, next) {
  if(!req.params.id || !req.body){
    message = {message : 'The identification or date will update do not send.'}
    return sendJsonResponse(res, 400, message, next);
  }
  const id = req.params.id,
    update = req.body,
    options = { new: true, runValidators: true };
  if (!ObjectID.isValid(id)) return sendJsonResponse(res, 404, 'Not found id medicine', next);

  // The example use Promise end Mongoose.
  Medicine.findByIdAndUpdate(id, { $set: update }, options).then((docUpdated) => {
    if (!docUpdated) return res.status(404).type('json').json({ message: 'Not found medicine.' });
    return res.status(200).type('json').json(docUpdated);

  }).catch((err) => {
    console.log(err);
    errorMiddleware(err, 400, next);
  });
}
/**
 * PACHT /update/:id
 * the increment or descrement the field quantity of medicine. 
 */
controllerRegister.incremOrDecremQauntityMedicine = function (req, res, next) {
  const id = req.params.id,
    incremOrdecrem = req.body.incrementOrdecrement,
    options = { new: true, runValidators: true };

  let message = {},
    newQuantityMed = '';
  if (!ObjectID.isValid(id)){ 
    message = { message: 'Not found id medicine', success: false}
    return sendJsonResponse(res, 404, message, next);
  }
  // if the user insert the valor zero for decrement or encrease.
  if (!incrementOrdecrement) {
    message = { message: 'The valor is zero.', success: false };
    return sendJsonResponse(res, 412, message, next);
  };

  Medicine.findOne({ _id: id }, function (err, medicine) {
    if (err) errorMiddleware(err, 503, next);
    if (medicine) {
      const quantityMed = medicine.quantity;
      if (!quantityMed) {
        message = { message: 'the medicine is over.', success: false };
        return sendJsonResponse(res, 200, message, next);
      }

      if (quantityMed > incrementOrdecrement) {
        const newQuantityMed = quantityMed - incrementOrdecrement;
        Medicine.updateOne({ 'code': code }, { set: { quantity: newQuantityMed } }, options, function (err, medicine) {
          message = { message : 'successful removed of stock.', success: true };
          return sendJsonResponse(res, 200, message, next);

        });
      } else {
        let messageUser = `The stock of the medicine is insufficient. The quantity in the stock: ${quantityMed}`;
        const message = { message: messageUser, success: false }
        return sendJsonResponse(res, 200, message, next);
      }
    }

    const messageUser = `Medicine ${req.body.code} do not found.`;
    message = { message: messageUser, success: false }
    return sendJsonResponse(res, 200, message, next);

  });
}

controllerRegister.delete = function (req, res, next) {
  const id = req.params.id;
  if(!id && ObjectID.isValid(id)){
    message = { message:'the indentification of medicine do not found.', success: false }
    return sendJsonResponse(res, 401, message, next);
  }
  Medicine.deleteOne({ _id: id }, function (err) {
    if (err) errorMiddleware(err, 500, next);

    message = { message: 'The medicine successful deleted', success: true};
    return sendJsonResponse(res, 200, message, next);
  });
}

export default controllerRegister;