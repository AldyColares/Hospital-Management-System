import Employee from '../models/MongooseODM/employee';
import { ObjectID } from 'mongodb';
import errorMiddleware from '../middleware/errorMiddleware';
import sendJsonResponse from '../models/sendJsonResponse';
import pluck from '../util/pluck';

let controllerEmployee = {};

controllerEmployee.registerEmployee = function (req, res, next) {
    const body = req.body;
    let message = '';
    if (!body) {
        message = 'you send empty fields';
        return sendJsonResponse(res, 400, message, next);
    }
    Object.freeze(body);

    Employee.findOne({ EID: body.EID }).exec(function (err, employee) {
        if (err) return errorMiddleware(err, 500, next);

        if (!employee) {
            message = 'The Employer Identification you have entered is already associated.'
            return sendJsonResponse(res, 400, message, next);
        }
        pluck(body, ['EID', 'Salary', 'EAddress', 'gender', 'NID', 'EName',
            'history', 'ContactNumb'], function (err, fileEmployee) {
                if (err) return errorMiddleware(err, 400, next);
                let newEmployee = new Employee(fileEmployee);

                newEmployee.save(function (error, employee) {
                    if (error) return errorMiddleware(error, 500, next);
                    message = { message: 'Register successfull!', employee: employee }
                    return sendJsonResponse(res, 201, message, next);
                });
            });
    })

};
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
        message = { message: 'The list of result of employee.', success: true, employee: listEmployee };
        sendJsonResponse(res, 200, message, next);
    });
}
/**
 * The update the date an Employee.
 * PUT /update-employee/:id 
 */
controllerEmployee.update = function (req, res, next) {
    if (!req.params.id || !req.body) {
        message = { message: 'The identification or date will update do not send.' }
        return sendJsonResponse(res, 400, message, next);
    }
    const id = req.params.id, update = req.body,
        options = { new: true, runValidators: true };
    if (!ObjectID.isValid(id)) return sendJsonResponse(res, 404, 'Not found id employee', next);

    // The example use Promise end Mongoose.
    Employee.findByIdAndUpdate(id, { $set: update }, options).then((docUpdated) => {
        if (!docUpdated) return res.status(404).type('json').json({ message: 'Not found employee.' });
        return res.status(200).type('json').json(docUpdated);

    }).catch((err) => {
        console.log(err);
        errorMiddleware(err, 400, next);
    });
}
/** 
* The delete the employee.
* DELETE /delete-employee/:id
*/
controllerEmployee.delete = function (req, res, next) {
    const id = req.params.id;
    if (!id && ObjectID.isValid(id)) {
        message = { message: 'the indentification of employee do not found.', success: false }
        return sendJsonResponse(res, 401, message, next);
    }
    Employee.deleteOne({ _id: id }, function (err) {
        if (err) errorMiddleware(err, 500, next);

        message = { message: 'The employee successful deleted', success: true };
        return sendJsonResponse(res, 204, message, next);
    });
}

export default controllerEmployee;
