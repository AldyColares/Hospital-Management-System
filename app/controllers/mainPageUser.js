const  flashUser = require('../models/flashUser');


let mainPageUser = {};

mainPageUser.pageUser = function(req, res, next){
    flashUser(req, res);

}