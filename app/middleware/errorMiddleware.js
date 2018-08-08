/**
 * Setup of error layer of the Middleware of express.
 * 
 * @param {Object} error - The object error.
 * @param {Number} status - The status code http. 
 * @param {Object} next - Callback from error Middleware. 
 */

let errorMiddleware = (error, status, next) => {
    if (!error.status) {
        error.status = status;
    }
    return next(error);
}

export default errorMiddleware;