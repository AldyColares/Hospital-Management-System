var ORMmedicene = require("../models/ODMmidicene");

module.exports = function(body){
    var code = body.username,
        quantity = body.quantity,
        prize = body.prize; 

        // check this is document in date base.
        ORMmedicene.findOne({ code: code }, function (err, user) {
        if (err) { return next(err); }
        if (Medicene) {
            return undefined;
            
            req.flash("error", "User already exists");
            return res.redirect("/signup");
        }
        // there is no document in date base.
        return false;
}