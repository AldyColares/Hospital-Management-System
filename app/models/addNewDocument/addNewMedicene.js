var ORMmedicene = require("../models/ODMmidicene");

module.exports = function (body) {
    var code = body.username,
        quantity = body.quantity,
        prize = body.prize;

    var newORMmedicene = new ORMmedicene({
        code: code,
        quantity: quantity,
        prize: prize
    })
    newORMmedicene.save(next);
}