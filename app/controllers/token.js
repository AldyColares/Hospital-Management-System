import Token from '../models/MongooseODM/token';
import { ObjectID } from 'mongodb';
import errorMiddleware from '../middleware/errorMiddleware';
import sendJsonResponse from '../models/sendJsonResponse';
import pluck from '../util/pluck';

const controllerToken = {};

// Function null for nexting functionality, do not use it.
controllerToken.registerToken = function (req, res, next) {
    const body = req.body,
        tokenId = body.tokenId;
    let message = '';
    Token.findOne({ tokenId: tokenId })
        .exec(function (err, token) {
            if (err) return errorMiddleware(err, 500, next);
            if (token) {
                message = { message: 'The token you have entered is already associated.', 
                    token: token }
                return sendJsonResponse(res, 400, message);
            }
            pluck(body, ['tokenType', 'tokenId', 'period'], function(err, fileToken){
                if (err) return errorMiddleware(err, 400, next);
                
                const newToken = new Token(fileToken);
                newToken.save(function (err, token) {
                    if (err) return errorMiddleware(err, 500, next);
                    message = { message: 'Register successfully!', token: token };
                    return sendJsonResponse(res, 201, message, next);
                });
            });
        })
};

/**
 * The result of seach of token.
 * GET  /search-token/:name
 */
controllerToken.readtoken = function (req, res, next) {
    if (req.params.name) {

        message = { 'message': 'The identification of token field of token do not found', success: false };
        return sendJsonResponse(res, 400, message, next);
    };
    const name = req.params.name;

    Token.find({ name: name }, null, function (err, listtoken) {
        if (err) errorMiddleware(err, 500, next);
        if (!listtoken) {
            message = { message: 'The seach of token do not found.', success: false }
            sendJsonResponse(res, 403, message, next);
        }
        message = { message: 'The list of result of token.', success: true, token: listtoken };
        return sendJsonResponse(res, 200, message, next);
    });

};
/**
 * The update the token. 
 * PUT /update-token/:id
 */
controllerToken.update = function (req, res, next) {
    if (!req.params.id || !req.body) {
        message = { message: 'The identification or date will update do not send.' }
        return sendJsonResponse(res, 400, message, next);
    }
    const id = req.params.id, update = req.body;
    if (!ObjectID.isValid(id)) return sendJsonResponse(res, 404, 'Not found id token', next);

    // The example use Promise end Mongoose.
    const options = { new: true, runValidators: true };
    Token.findByIdAndUpdate({ idToken: id }, { $set: update }, options).then((docUpdated) => {
        if (!docUpdated) return res.status(404).type('json').json({ message: 'Not found token.' });
        return res.status(200).type('json').json(docUpdated);

    }).catch((err) => {
        console.error(err);
        errorMiddleware(err, 400, next);
    });
};

/**
 * the delete the token
 * DELETE /delete-token/:id
 */
controllerToken.delete = function (req, res, next) {
    const token = req.params.id;

    Token.deleteOne({ token: token }, function (err) {
        if (err) errorMiddleware(err, 500, next);

        message = { message: 'The token deleted successfully.', success: true };
        return sendJsonResponse(res, 204, message, next);
    });
};

export default controllerToken;