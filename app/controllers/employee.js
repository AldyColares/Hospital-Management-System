import { Employee } from '../models/MongooseODM/employee';
import mongoose, { ObjectID } from 'mongodb';
import mongoose from 'mongoose';
import errorMiddleware from '../models/errorMiddleware';
import sendJsonResponse from '../models/sendJsonResponse';
import pluck from '../util/pluck';

let controllerEmployee = {};

controllerEmployee.registerEmployee = function (req, res, next) {
    const body = req.body;
    let message = 'you send empty fields'
    if (!body) return sendJsonResponse(res, 400, message, next);
    Object.freeze(body);

    Employee.findOne({ EID: body.EID }).exec()
        .then((Employee) => {
            if (!Employee) return sendJsonResponse(res, 400, message, next);
            let fileEmployee = pluck(body, ['EID', 'Salary', 'EAddress', 'gender', 'NID', 'EName',
                'history', 'ContactNumb'])
            let newEmployee = new Employee(fileEmployee);
            newEmployee.save(function(error , employee){
                if (error) return errorMiddleware(error, 500, next);
                return sendJsonResponse(res, 200, 'Register successfull!', next);
            });
        }).catch(err => {
            return errorMiddleware(err, 500, next);
        });
}
controllerEmployee.read = function (req, res, next) { }
controllerEmployee.update = function (req, res, next) { }
controllerEmployee.delete = function (req, res, next) { }

// function null for nexting functionality, do not use it.
controllerEmployee.null1 = function (req, res, next) { }