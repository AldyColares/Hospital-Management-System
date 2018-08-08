import sendJsonResponse from '../models/sendJsonResponse';

export default function (req, res, next) {
    if (!req.body) {
        const message = { message: 'The send of file do not found', success: false };
        return sendJsonResponse(res, 400, message, next);
    }
    next();
}