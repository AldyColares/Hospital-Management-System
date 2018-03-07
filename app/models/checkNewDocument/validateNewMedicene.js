let medicine = require('../MongooseODM/midicine');

module.exports = function (body) {
  let code = body.code;
  // check this is document in date base.
  return medicine.findOne({ code: code }, function (err, foundMedicine) {
    if (err) { return next(err); }
    if (foundMedicine) {
      return true;
    }
    // there is no document in date base.
    return false;
  });
}