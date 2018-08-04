import configDatabase from './configDatabase';
import express from 'express';
import logger from 'morgan';
import helmet from 'helmet';
import bodyparse from 'body-parser';
import flash from 'connect-flash';
import session from 'cookie-session';
import cookieParser from 'cookie-parser';
import seed from '../app/util/seed';
import connectBD from './database';
import home from '../app/routes/home';
import medicene from '../app/routes/medicine';
import mainPageUser from '../app/routes/mainPageUser';
import login from '../app/routes/user';
import error from '../app/routes/handlingError';

const EXPIRE_DATE_IN_DAY = new Date(Date.now() + 60 * 60 * 1000 * 24); // 24 hour

export default (function () {
    let app = express();
    configDatabase;
    app.use(helmet());
    app.disable('x-powered-by');
    
    connectBD();
    // insert documents in the data base.
    seed();
    app.use(logger('dev'));
    // configuração de ambiente
    app.set('port', process.env.PORT || 3000);
    app.use(cookieParser());
    app.use(session({
        name: "sessionIdx", 
        keys: ['3oilktje&$89849*5(*#@!#$%&', 'sf834sdf)@_+=))#*jz9424#@'],      
        cookie: {
            secure: true,
            httpOnly: true,
            expires: EXPIRE_DATE_IN_DAY,
          }
    }));
    
    app.use(flash());
    app.use(bodyparse.urlencoded({ extended: false }));
    
    app.use(express.static('./public'));
    app.set('view engine', 'ejs');
    app.set('views', './app/views');
    mainPageUser(app);
    login(app);
    medicene(app);
    home(app);
    error(app);
    return app;
})();