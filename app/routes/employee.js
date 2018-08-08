import controllerEmployee from '../controllers/employee';

export default function (app){
        //app.get('/register-employee', controllerEmployee.;
        app.post('/register-employee', controllerEmployee.registerEmployee);
        
        app.get('/read-employee', controllerEmployee.read);
        
        app.delete('/delete-employee', controllerEmployee.delete);
        
        app.patch('/update-employee/:id', controllerEmployee.update);
}