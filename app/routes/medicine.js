import { registerMedicene, register } from '../controllers/medicine';

export default function (app) {
  app.get('/register-medicene',  registerMedicene);
  app.post('/register-medicene', register);
}