// I will insert the most common HTTP codes.
const statusCode = {
    informational = {
        continue: 100,
        switchingProtocols: 101,
        processing: 102
    },
    success = {
        ok: 200
    },
    redirection = {
       movedPermanently: 301,    
       TemporaryRedirect: 307,
       PermanentREdirec: 308,
    },
    clientError = {
        badrequest: 400,
        unauthorized: 401,
        paymentRequired: 402,
        Forbidden: 403,
        notFound: 404
    },
    serverError = {
        internalServerError: 500,
        notImplemented: 501,
        badGateway: 502
    }
}
Object.freeze(statusCode);

export default statusCode;