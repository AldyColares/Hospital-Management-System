import  Record  from '../models/MongooseODM/record';
import { ObjectID } from 'mongodb';
import errorMiddleware from '../middleware/errorMiddleware';
import sendJsonResponse from '../models/sendJsonResponse';
import pluck from '../util/pluck';

const controllerRecord = {};

// Function null for nexting functionality, do not use it.
controllerRecord.registerRecord = function (req, res, next) {
    const body = req.body,
        patientId = body.patientId,
        address = body.address;
    let message = '';
    record.find({ patientId: patientId}).exec()
        .then(record => {
            if (record) {
                message = 'The patientId and address you have entered are already associated.'
                return sendJsonResponse(res, 400, )
            }
            let filerecord = pluck(body, 'patientId', 'recordNo', 'discription', 'appoinmest');
            const record = new record(filerecord);
            record.save(function (error, record) {
                if (error) return errorMiddleware(error, 500, next);
                message = { message: 'Register successfull!', record: record };
                return sendJsonResponse(res, 201, message, next);
            });
        }

        ).catch(err => {
            return errorMiddleware(err, 500, next);
        });
};
/**
 * The result of seach of record.
 * GET  /search-record/:name
 */
controllerrecord.readrecord = function (req, res, next) {
    if (req.params.name) {
        message = { 'message': 'The name field of record do not found', success: false };
        return sendJsonResponse(res, 400, message, next);
    };
    const name = req.params.name;

    Record.find({ name: name }, null, function (err, listrecord) {
        if (err) errorMiddleware(err, 500, next);
        if (!listrecord) {
            message = { message: 'The seach of record do not found.', success: false }
            sendJsonResponse(res, 403, message, next);
        }
        message = { message: 'The list of result of record.', success: true, record: listrecord };
        return sendJsonResponse(res, 200, message, next);
    });

};
/**
 * The update the record. 
 * PUT /update-record/:id
 */
controllerrecord.update = function (req, res, next) {
    if (!req.params.id || !req.body) {
        message = { message: 'The identification or date will update do not send.' }
        return sendJsonResponse(res, 400, message, next);
    }
    const id = req.params.id, update = req.body;
    if (!ObjectID.isValid(id)) return sendJsonResponse(res, 404, 'Not found id record', next);

    // The example use Promise end Mongoose.
    const options = { new: true, runValidators: true };
    Record.findByIdAndUpdate(id, { $set: update }, options).then((docUpdated) => {
        if (!docUpdated) return res.status(404).type('json').json({ message: 'Not found record.' });
        return res.status(200).type('json').json(docUpdated);

    }).catch((err) => {
        console.error(err);
        errorMiddleware(err, 400, next);
    });
};

controllerrecord.delete = function (req, res, next) {
    const id = req.params.id;
    if (!id && ObjectID.isValid(id)) {
        message = { message: 'the indentification of record do not found.', success: false }
        return sendJsonResponse(res, 401, message, next);
    }
    Record.deleteOne({ _id: id }, function (err) {
        if (err) errorMiddleware(err, 500, next);

        message = { message: 'The record deleted successful.', success: true };
        return sendJsonResponse(res, 200, message, next);
    });
};

