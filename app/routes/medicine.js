import controllerMedicine from '../controllers/medicine';

export default function (app) {
  app.get('/register-medicine', controllerMedicine.loadPageRegisterMedicine);
  app.post('/register-medicine', controllerMedicine.registerMedicine);
  
  app.get('/read-medicine', controllerMedicine.read);
  
  app.delete('/delete-medicine/:id', controllerMedicine.delete);
  
  app.patch('/update-medicine/:id', controllerMedicine.update);
  app.patch('/update-quantity-medicine/:id', controllerMedicine.incremOrDecremQauntityMedicine);
}