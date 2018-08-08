import controllerToken from '../controllers/token';
import bodyisUnderfined from '../middleware/bodyisUnderfined';

export default function (app){
        app.post('/register-token', bodyisUnderfined ,controllerToken.registerToken);
        
        app.get('/read-token', controllerToken.readtoken);
        
        app.delete('/delete-token/:id', controllerToken.delete);
        
        app.patch('/update-token/:id', controllerToken.update);
}