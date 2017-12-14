var medicine = require("../MongooseODM/midicine");

module.exports = function (body) {
    var code = body.code;

    // check this is document in date base.
   return medicine.findOne({ code: code }, function (err, medicine) {
        if (err) { return next(err); }
        if (medicine) {
            return true;
        }
        // there is no document in date base.
        return false;
    });
}