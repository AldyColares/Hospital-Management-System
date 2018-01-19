/*jshint esversion: 6 */

const validateNewMedicene = require("../models/checkNewDocument/validateNewMedicene"),
     addNewMedicene = require("../models/addNewDocument/addNewMedicene"),
     flashUser = require('../models/flashUser'),
     authorizationRouter = "registerMedicene";

var { mapAuthorization, authorization } = require('../models/safety/authorization'),
     controllerRegister = {};

authorization.setJobAuthorization(authorizationRouter);

controllerRegister.register = function (req, res, next) {
    flashUser(req, res);

    var isAuthorization = authorization.authoUser(req, res);
    // if result for false return feedback for user and he will redirect from page of login.
    if(!isAuthorization) return res;

    var existDocument = validateNewMedicene(req.body);
    if (existDocument === true) {

        req.flash("error", "Code already exists");
        return res.redirect("/registerMedicene");
    }
    addNewMedicene(req.body, next);

    req.flash("info", `The of code medicene: ${req.body.code} registered successful`);
    return res.redirect("/registerMedicene");
};

controllerRegister.registerMedicene = function (req, res) {
    flashUser(req, res);
    var result = authorization.authoUser(req, res);
    if(!result) return res;
    res.render('registerMedicene');
};
module.exports = controllerRegister;