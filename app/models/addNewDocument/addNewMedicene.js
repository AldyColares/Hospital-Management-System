    var ORMmedicene = require("../ODMmidicene");

module.exports = function (body, next) {
    var code = body.code,
        quantity = body.quantity,
        prize = body.prize;

    var newORMmedicene = new ORMmedicene({
        code: code,
        quantity: quantity,
        prize: prize
    })
    newORMmedicene.save(next);
}