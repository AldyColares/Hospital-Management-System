import mongoSanitize from 'mongo-sanitize';
import sendJsonResponse from '../models/sendJsonResponse'

export default function (req, res, next) {
    if (req.params && req.params.id) {
        req.params.id = mongoSanitize(req.params.id);
        next();
    } else {
        sendJsonResponse(res, 404, { message: 'No id in request' });
    }
}