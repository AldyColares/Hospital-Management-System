var mongoose = require('mongoose');

var options = {
    useMongoClient: true,
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
  };
const uri = 'mongodb://localhost:27017/HospitalManagementSystem'; 

module.exports = function () {

    //mongoose.connect('mongodb://localhost:27017/HospitalManagementSystem');
    mongoose.Promise = global.Promise;
    mongoose.connection.openUri(uri);
    
    mongoose.connection.on('connected', function () {
        console.log('Mongoose! Conectado em ' + uri);
    });

    mongoose.connection.on('disconnected', function () {
        console.log('Mongoose! Desconectado de ' + uri);
    });

    mongoose.connection.on('error', function (erro) {
        console.log('Mongoose! Erro na conexão: ' + erro);
    });

    process.on('SIGINT', function () {
        mongoose.connection.close(function () {
            console.log('Mongoose! Desconectado pelo término da aplicação');
        // 0 indica que a finalização ocorreu sem erros
        process.exit(0);
        });
    });
}

