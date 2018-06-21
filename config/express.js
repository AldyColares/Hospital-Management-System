import './configDatabase';
import express, { static } from 'express';
import logger from 'morgan';
import { urlencoded } from "body-parser";
import flash from "connect-flash";
import session from "cookie-session";
import seed from '../app/util/seed';
import connectBD from './database';
import home from '../app/routes/home';
import medicene from '../app/routes/medicine';
import mainPageUser from '../app/routes/mainPageUser';
import login from '../app/routes/user';
import error from '../app/routes/handlingError';


export default function () {
    let app = express();
    connectBD();
    // insert documents in the data base.
    seed();
    app.use(logger('dev'));
    // configuração de ambiente
    app.set('port', process.env.PORT || 3000);

    const EXPIRE_DATE_IN_DAY = new Date(Date.now() + 60 * 60 * 1000 * 24); // 24 hour
    app.use(session({
        secret: "TKRv0IJs=HYqrvagQ#&!F!%V]Ww/4KiVs$s,<<MX",
        name: "sessionId",
        httpOnly: "true",
        segure: "true",
        maxAge: EXPIRE_DATE_IN_DAY

    }));

    app.use(flash());
    app.use(urlencoded({ extended: false }));

    // middleware
    app.use(static('./public'));
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