var express = require('express');
var logger = require('morgan');
var bodyParser = require("body-parser");
var flash = require("connect-flash");   
var session = require("express-session");
var mongoose = require('./database');

var home = require('../app/routes/home');
var medicene = require('../app/routes/medicene');

module.exports = function(){
var app = express();
    mongoose();
    app.use(logger('dev'));
    // configuração de ambiente
    app.set('port', process.env.PORT || 3000);

    app.use(session({
        secret: "TKRv0IJs=HYqrvagQ#&!F!%V]Ww/4KiVs$s,<<MX",
        resave: true,
        saveUninitialized: true
    }));

    app.use(flash());
    app.use(bodyParser.urlencoded({ extended: false }));
    // middleware
    app.use(express.static('./public'));  
    app.set('view engine', 'ejs');
    app.set('views', './app/views');
    //app.set('views', path.resolve(__dirname, "views"));
    medicene(app);
    home(app);
    return app;
}