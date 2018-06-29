import  handlingError  from '../controllers/handlingError';

export default function (app) {
  app.use(handlingError);
}