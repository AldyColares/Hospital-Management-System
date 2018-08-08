import controllerroom from '../controllers/room';

export default function (app){
        //app.get('/register-room', controllerroom.loadPageRegisterRoom);
        app.post('/register-room', controllerroom.registerRoom);
        
        app.get('/read-room', controllerroom.readroom);
        
        app.delete('/delete-room/:id', controllerroom.delete);
        
        app.patch('/update-room/:id', controllerroom.update);
}