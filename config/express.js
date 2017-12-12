
var express = require('express');
var path = require("path");
var logger = require('morgan');
var home = require('../app/routes/home');
var mongoose = require('./database');

module.exports = function(){
    var app = express();
    mongoose();
    app.use(logger("dev"));
    // configuração de ambiente
    app.set('port', 3000);
    
    // middleware
    app.use(express.static('./public'));  
    app.set('view engine', 'ejs');
    app.set('views', './app/views');
    //app.set('views', path.resolve(__dirname, "views"));
    home(app);
    return app;
}