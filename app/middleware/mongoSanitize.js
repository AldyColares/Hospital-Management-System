import mongoSanitize from 'mongo-sanitize';

export default function (req, res, next) {
    req.params.id = mongoSanitize(req.params.id);
    next();
}