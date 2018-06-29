/**
 * 
 *  Setup of error layer of the Middleware of express.
 * 
 * @param {String | Array} message 
 * @param {Number} status 
 * @param {Object} next 
 */

let errorMiddleware = (message, status, next) => {
    let error = new Error();
    error.message = message;
    error.status = status;
    return next(error);
}

export default errorMiddleware;