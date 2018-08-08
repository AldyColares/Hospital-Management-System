import Room from '../models/MongooseODM/room';
import { ObjectID } from 'mongodb';
import errorMiddleware from '../middleware/errorMiddleware';
import sendJsonResponse from '../models/sendJsonResponse';
import pluck from '../util/pluck';

const controllerRoom = {};

// Function null for nexting functionality, do not use it.
controllerRoom.registerRoom = function (req, res, next) {
    const body = req.body,
        roomId = body.roomId;
    let message = '';
    Room.find({ roomId: roomId }).exec(function (err, room) {
        if (err) return errorMiddleware(err, 500, next);
        if (room) {
            message = 'The identification room you have entered is already associated.'
            return sendJsonResponse(res, 400, )
        }
        let fileroom = pluck(body, 'roomType', 'roomId', 'period');
        const newRoom = new Room(fileroom);
        newRoom.save(function (error, room) {
            if (error) return errorMiddleware(error, 500, next);
            message = { message: 'Register successfuly!', room: room };
            return sendJsonResponse(res, 201, message, next);
        });

    });
}

    /**
     * The result of seach of room.
     * GET  /search-room/:name
     */
    controllerRoom.readroom = function (req, res, next) {
        if (req.params.name) {
            message = { 'message': 'The identification of room field of room do not found', success: false };
            return sendJsonResponse(res, 400, message, next);
        };
        const name = req.params.name;

        Room.find({ name: name }, null, function (err, listroom) {
            if (err) errorMiddleware(err, 500, next);
            if (!listroom) {
                message = { message: 'The seach of room do not found.', success: false }
                sendJsonResponse(res, 403, message, next);
            }
            message = { message: 'The list of result of room.', success: true, room: listroom };
            return sendJsonResponse(res, 200, message, next);
        });

    };
    /**
     * The update the room. 
     * PUT /update-room/:id
     */
    controllerRoom.update = function (req, res, next) {
        if (!req.params.id || !req.body) {
            message = { message: 'The identification or date will update do not send.' }
            return sendJsonResponse(res, 400, message, next);
        }
        const id = req.params.id, update = req.body;
        if (!ObjectID.isValid(id)) return sendJsonResponse(res, 404, 'Not found id room', next);

        // The example use Promise end Mongoose.
        const options = { new: true, runValidators: true };
        Room.findByIdAndUpdate({ roomId: id }, { $set: update }, options).then((docUpdated) => {
            if (!docUpdated) return res.status(404).type('json').json({ message: 'Not found room.' });
            return res.status(200).type('json').json(docUpdated);

        }).catch((err) => {
            console.error(err);
            errorMiddleware(err, 400, next);
        });
    };

    controllerRoom.delete = function (req, res, next) {
        const roomId = req.params.id;

        Room.deleteOne({ roomId: roomId }, function (err) {
            if (err) errorMiddleware(err, 500, next);

            message = { message: 'The room deleted successfuly.', success: true };
            return sendJsonResponse(res, 200, message, next);
        });
    };

    export default controllerRoom;
