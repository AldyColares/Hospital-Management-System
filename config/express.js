var express = require('express')
  , logger = require('morgan')
  , bodyParser = require("body-parser")
  , flash = require("connect-flash") 
  , session = require("express-session")
  , expressValidator = require('express-validator')
  //, cookieParser = require("cookie-parser")
  
  , mongoose = require('./database')
  , home = require('../app/routes/home')
  , medicene = require('../app/routes/medicene')
  , login = require('../app/routes/user');

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
    
    //app.use(expressValidator);

    // middleware
    app.use(express.static('./public'));  
    app.set('view engine', 'ejs');
    app.set('views', './app/views');
    //app.set('views', path.resolve(__dirname, "views"));
    login(app);
    medicene(app);
    home(app);
    return app;
}