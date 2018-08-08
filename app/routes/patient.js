import controllerPatient from '../controllers/patient';

export default function (app){
        //app.get('/register-patient', controllerPatient.);
        app.post('/register-patient', controllerPatient.registerPatient);
        
        app.get('/read-patient', controllerPatient.readPatient);
        
        app.delete('/delete-patient', controllerPatient.delete);
        
        app.patch('/update-patient/:id', controllerPatient.update);
}