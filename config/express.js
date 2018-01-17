require('./configDatabase');
var express = require('express')
  , logger = require('morgan')
  , bodyParser = require("body-parser")
  , flash = require("connect-flash") 
  , session = require("cookie-session")
  
  , seed = require('../app/util/seed')
  , mongoose = require('./database')
  , home = require('../app/routes/home')
  , medicene = require('../app/routes/medicene')
  , mainPageUser = require('../app/routes/mainPageUser')
  , login = require('../app/routes/user')
  , error = require('../app/routes/handlingError');


module.exports = function(){
var app = express();
    mongoose();
    // insert documents in the data base.
    //seed();
    app.use(logger('dev'));
    // configuração de ambiente
    app.set('port', process.env.PORT || 3000);

    const expiryDateInADay = new Date( Date.now() + 60 * 60 * 1000 * 24 ); // 24 hour
    app.use(session({
        secret: "TKRv0IJs=HYqrvagQ#&!F!%V]Ww/4KiVs$s,<<MX",
	name: "sessionId",
	httpOnly: "true",
	segure: "true",
	maxAge: expiryDateInADay
	
    }));

    app.use(flash());
    app.use(bodyParser.urlencoded({ extended: false }));
    
    // middleware
    app.use(express.static('./public'));  
    app.set('view engine', 'ejs');
    app.set('views', './app/views');
    //app.set('views', path.resolve(__dirname, "views"));
    mainPageUser(app);
    login(app);
    medicene(app);
    home(app);
    error(app);
    return app;
}
