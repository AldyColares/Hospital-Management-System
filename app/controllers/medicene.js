const validateNewMedicene = require("../models/checkNewDocument/validateNewMedicene")
   ,  addNewMedicene = require("../models/addNewDocument/addNewMedicene")
   ,  flashUser = require('../models/flashUser')
var  controllerRegister = {};

controllerRegister.register = function (req, res, next) {
    flashUser(req, res);
    var existDocument = validateNewMedicene(req.body);
    if (existDocument === true) {
           
        req.flash("error", "Code already exists");
        return res.redirect("/registerMedicene");
    }
    addNewMedicene(req.body, next);

    req.flash("info", `The of code medicene: ${req.body.code} registered successful`);
    return res.redirect("/registerMedicene");
}

controllerRegister.registerMedicene = function (req, res) {
    flashUser(req, res);
    res.render('registerMedicene');
}
module.exports = controllerRegister;