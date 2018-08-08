import error404 from '../controllers/error404';
import  about  from '../controllers/about';

export default function (app) {
  app.get('/about', about);
  app.use('*', error404);
}