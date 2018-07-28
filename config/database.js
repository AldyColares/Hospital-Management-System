import './configDatabase';
import mongoose from 'mongoose';

let options = {
    useMongoClient: true,
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
  };

const uriBD = process.env.MONGODB_URI; 
export default function () {
    
    //console.log("dfgdgd  "+process.env.MONGODB_URI);
    //mongoose.connect('mongodb://localhost:27017/HospitalManagementSystem');
    mongoose.set('debug', false);
    mongoose.Promise = global.Promise;
    
    mongoose.connect(uriBD, function(err){
        console.log(err);
    });
    // mongoose.connection.dropDatabase();
    mongoose.connection.on('connected', function () {
        console.log('Mongoose! Connect in ' + uriBD);
    });

    mongoose.connection.on('disconnected', function () {
        console.log('Mongoose! Disconnect of ' + uriBD);
    });

    mongoose.connection.on('error', function (erro) {
        console.log('Mongoose! Erro na conexão: ' + erro);
    });

    process.on('SIGINT', function () {
        mongoose.connection.close(function () {
            console.log('Mongoose! Disconnect from finish the application.');
        // zero show that a finalization occurred error, 0 indicates that finalization occurred without errors 0 indica que a finalização ocorreu sem erros
        process.exit(0);
        });
    });
}
