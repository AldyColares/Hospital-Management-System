import Patient from '../models/MongooseODM/patient';
import { ObjectID } from 'mongodb';
import errorMiddleware from '../middleware/errorMiddleware';
import sendJsonResponse from '../models/sendJsonResponse';
import pluck from '../util/pluck';

const controllerPatient = {};

// Function null for nexting functionality, do not use it.
controllerPatient.registerPatient = function (req, res, next) {
    const body = req.body,
        name = body.name,
        address = body.address;
    let message = '';
    Patient.find({ name: name, address: address }).exec()
        .then(patient => {
            if (patient) {
                message = 'The name and address you have entered are already associated.'
                return sendJsonResponse(res, 400, )
            }
            let filePatient = pluck(body, 'pid', 'name', 'gender',
                'address', 'dateAdmited', 'dateDischarged', 'contactNo');
            const newPatient = new Patient(filePatient);
            newPatient.save(function (error, patient) {
                if (error) return errorMiddleware(error, 500, next);
                message = { message: 'Register successfully!', patient: patient };
                return sendJsonResponse(res, 201, message, next);
            })
        }

        ).catch(err => {
            return errorMiddleware(err, 500, next);
        });
};
/**
 * The result of seach of patient.
 * GET  /search-patient/:name
 */
controllerPatient.readPatient = function (req, res, next) {
    if (req.params.name) {
        message = { 'message': 'The name field of patient do not found', success: false };
        return sendJsonResponse(res, 400, message, next);
    };
    const name = req.params.name;

    Patient.find({ name: name }, null, function (err, listPatient) {
        if (err) errorMiddleware(err, 500, next);
        if (!listpatient) {
            message = { message: 'The seach of patient do not found.', success: false }
            sendJsonResponse(res, 403, message, next);
        }
        message = { message: 'The list of result of patient.', success: true, patient: listPatient };
        return sendJsonResponse(res, 200, message, next);
    });

};
/**
 * The update the patient. 
 * PUT /update-patient/:id
 */
controllerPatient.update = function (req, res, next) {
    if (!req.params.id || !req.body) {
        message = { message: 'The identification or date will update do not send.' }
        return sendJsonResponse(res, 400, message, next);
    }
    const id = req.params.id, update = req.body;
    if (!ObjectID.isValid(id)) return sendJsonResponse(res, 404, 'Not found id patient', next);

    // The example use Promise end Mongoose.
    const options = { new: true, runValidators: true };
    Patient.findByIdAndUpdate(id, { $set: update }, options).then((docUpdated) => {
        if (!docUpdated) return res.status(404).type('json').json({ message: 'Not found patient.' });
        return res.status(200).type('json').json(docUpdated);

    }).catch((err) => {
        console.error(err);
        errorMiddleware(err, 400, next);
    });
};
/**
 * 
 * DELETE /delete-patient/:id
 */
controllerPatient.delete = function (req, res, next) {
    const id = req.params.id;
    if (!id && ObjectID.isValid(id)) {
        message = { message: 'the indentification of patient do not found.', success: false }
        return sendJsonResponse(res, 401, message, next);
    }
    Patient.deleteOne({ _id: id }, function (err) {
        if (err) errorMiddleware(err, 500, next);

        message = { message: 'The patient deleted successfuly.', success: true };
        return sendJsonResponse(res, 200, message, next);
    });
};

export default controllerPatient;
