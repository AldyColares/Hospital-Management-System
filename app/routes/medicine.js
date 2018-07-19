import controllerMedicine from '../controllers/medicine';

export default function (app) {
  app.get('/register-medicine', controllerMedicine.loadPageRegisterMedicine);
  app.post('/register-medicine', controllerMedicine.registerMedicine);
  
  app.get('/read-medicine', controllerMedicine.read);
  
  app.post('/delete-medicine', controllerMedicine.delete);
  
  app.post('/update-quantity-medicine', controllerMedicine.incremOrDecremQauntityMedicine);
}