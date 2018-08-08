import controllerRecord from '../controllers/record';

export default function (app){
        app.post('/register-record', controllerRecord.registerRecord);
        
        app.get('/read-record', controllerRecord.readRecord);
        
        app.delete('/delete-record', controllerRecord.delete);
        
        app.patch('/update-record/:id', controllerRecord.update);
}
