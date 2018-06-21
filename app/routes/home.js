import { error404 } from '../controllers/home';
import { about } from '../controllers/about';

export default function (app) {
  app.get('/about', about);
  app.use('*', error404);
}