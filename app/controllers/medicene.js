const validateNewMedicene = require("../models/checkNewDocument/validateNewMedicene")
    , addNewMedicene = require("../models/addNewDocument/addNewMedicene")
    , authorizationRouter = "registerMedicene"
    , flashUser = require('../models/flashUser');

var { mapAuthorization, Authorization } = require('../models/safety/authorization')
    , controllerRegister = {};

authorization = new Authorization(mapAuthorization);
authorization.setJobAuthorization(authorizationRouter);

controllerRegister.register = function (req, res, next) {
    flashUser(req, res);
    var result = authorization.authoUser(req, res);
    if(!result) return res;

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
    var result = authorization.authoUser(req, res);
    if(!result) return res;
    res.render('registerMedicene');
}
module.exports = controllerRegister;