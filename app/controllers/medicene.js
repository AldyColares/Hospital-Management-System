var validateNewMedicene = require("../models/checkNewDocument/validateNewMedicene");
var addNewMedicene = require("../models/addNewDocument/addNewMedicene");
var controllerRegister = {};

controllerRegister.register = function (req, res, next) {
    res.locals.currentUser = req.user;
    var existDocument = validateNewMedicene(req.body);
    if (existDocument) {
        res.locals.errors = req.flash("error");    
        req.flash("error", "Code already exists");
        return res.redirect("/registerMedicene");
    }
    addNewMedicene(req.body, next);
}

controllerRegister.registerMedicene = function (req, res) {
    res.locals.currentUser = req.user;    
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    res.render('registerMedicene');
}
module.exports = controllerRegister;