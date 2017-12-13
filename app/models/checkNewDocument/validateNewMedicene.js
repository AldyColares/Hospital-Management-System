var ORMmedicene = require("../ODMmidicene");

module.exports = function (body) {
    var code = body.code;

    // check this is document in date base.
   return ORMmedicene.findOne({ code: code }, function (err, medicene) {
        if (err) { return next(err); }
        if (medicene) {
            return true;
        }
        // there is no document in date base.
        return false;
    });
}