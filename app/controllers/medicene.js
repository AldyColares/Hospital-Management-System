var validateNewMedicene = require("../models/checkNewDocument/validateNewMedicene");
var controller = {};

controller.register = function(req, res){
    var thisIsDocument = validateNewMedicene(req.body);
    if(!thisIsDocument){        
    }
}
module.exports = controller;
