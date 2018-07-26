import { Employee } from '../models/MongooseODM/employee';
import { ObjectID } from 'mongodb';
import mongoose from 'mongoose';
import errorMiddleware from '../models/errorMiddleware';
import sendJsonResponse from '../models/sendJsonResponse';
import pluck from '../util/pluck';

let controllerEmployee = {};

controllerEmployee.registerEmployee = function (req, res, next) {
    const body = req.params;
    let message = '';
    if (!body) {
        message = 'you send empty fields';
        return sendJsonResponse(res, 400, message, next);
    }
    Object.freeze(body);

    Employee.findOne({ EID: body.EID }).exec()
        .then((Employee) => {
            if (!Employee) return sendJsonResponse(res, 400, message, next);
            let fileEmployee = pluck(body, ['EID', 'Salary', 'EAddress', 'gender', 'NID', 'EName',
                'history', 'ContactNumb'])
            let newEmployee = new Employee(fileEmployee);
            newEmployee.save(function (error, employee) {
                if (error) return errorMiddleware(error, 500, next);
                message = { message: 'Register successfull!', employee: employee }
                return sendJsonResponse(res, 201, message, next);
            });
        }).catch(err => {
            return errorMiddleware(err, 500, next);
        });
}

/**
 * GET  /search-employee/:Ename
 * the result of seach of client.
 *  
 */
controllerEmployee.read = function (req, res, next) {
    if (req.params.Ename) {
        message = { 'message': 'The name field of employee do not found', success: false };
        return sendJsonResponse(res, 400, message, next);
    };
    const Ename = req.params.Ename;
    // ueturn all medicine with same name. the medicines have expiration.
    Employee.find({ ename: ename }, null, function (err, listEmployee) {
        if (err) errorMiddleware(err, 500, next);
        if (!listEmployee) {
            message = { message: 'The name of employee do not exist.', success: false }
            sendJsonResponse(res, 403, message, next);
        }
        message = { message: 'The list of result of employee.', success: true };
        sendJsonResponse(res, 200, message, next);
    });
}
/**
 * The update the date an Employee.
 * PUT /update-Employee/:id 
 */
controllerEmployee.update = function (req, res, next) {
    if (!req.params.id || !req.body) {
        message = { message: 'The identification or date will update do not send.' }
        return sendJsonResponse(res, 400, message, next);
    }
    const id = req.params.id, update = req.body,
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
controllerEmployee.delete = function (req, res, next) {
    const id = req.params.id;
    if(!id && ObjectID.isValid(id)){
      message = { message:'the indentification of employee do not found.', success: false }
      return sendJsonResponse(res, 401, message, next);
    }
    Medicine.deleteOne({ _id: id }, function (err) {
      if (err) errorMiddleware(err, 500, next);
      
      message = { message: 'The employee successful deleted', success: true};
      return sendJsonResponse(res, 200, message, next);
    });
  }

// function null for nexting functionality, do not use it.
controllerEmployee.null1 = function (req, res, next) { }