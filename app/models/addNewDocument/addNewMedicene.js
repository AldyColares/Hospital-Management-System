var medicine = require("../MongooseODM/midicine");

module.exports = function (body, next) {
    var code = body.code,
        quantity = body.quantity,
        prize = body.prize;

    var newMedicine = new medicine({
        code: code,
        quantity: quantity,
        prize: prize
    })
    newMedicine.save(next);

}