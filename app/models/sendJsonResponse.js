/**
 * The module in format JSON for response client of his request.
 * 
 * @param {Object} res - The object res of framework Express.
 * @param {Number} status - The status code HTTP. 
 * @param {object} message - The message for client and code message for front-end. 
 * @param {Object} next - The function from call next Middleware. 
 */

let respondInFormatJSON = (res, status, message, next) => {
    return res.status(status).type('json').json(message).end();
} 

export default respondInFormatJSON;