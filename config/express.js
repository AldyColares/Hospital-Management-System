import express from 'express';
import compression from 'compression';
import logger from 'morgan';
import helmet from 'helmet';
import bodyparse from 'body-parser';
import flash from 'connect-flash';
import session from 'cookie-session';
import cookieParser from 'cookie-parser';
import configDatabase from './configDatabase';
import seed from '../app/util/seed';
import connectBD from './database';
import allRouter from '../app/routes/allRoutes';

const EXPIRE_DATE_IN_DAY = new Date(Date.now() + 60 * 60 * 1000 * 24); // 24 hours

export default (function () {
  let app = express();
  // the set up Data base.
  configDatabase;
  //app.use(compression);
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
  // imediatamente após a inicialização da sessão do Passport
  //app.use(helmet.xframe());
  app.use(express.static('./public'));
  app.set('view engine', 'ejs');
  app.set('views', './app/views');

  allRouter(app);
  return app;
})();