/**
 *  Setup of error layer of the Middleware of express.
 * 
 * @param {String | Array} message - The list of message of erros.
 * @param {Number} status - The status code http. 
 * @param {Object} next - Callback from error Middleware. 
 */

let errorMiddleware = (message, status, next) => {
    let error = new Error();
    error.message = message;
    error.status = status;
    return next(error);
}

export default errorMiddleware;