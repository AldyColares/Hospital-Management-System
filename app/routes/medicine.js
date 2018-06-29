import controllerRegister from '../controllers/medicine';

export default function (app) {
  app.get('/register-medicene',  controllerRegister.registerMedicene);
  app.post('/register-medicene', controllerRegister.register);
}