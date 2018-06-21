import { registerMedicene, register } from '../controllers/medicine';
import { authenticate } from '../models/safety/authenticate';

export default function (app) {
  app.get('/registerMedicene', authenticate, registerMedicene);
  app.post('/registerMedicene', authenticate, register);
}