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
const uriBD = process.env.MONGODB_URI; 
module.exports = function () {

    //mongoose.connect('mongodb://localhost:27017/HospitalManagementSystem');
    mongoose.set('debug', true);
    mongoose.Promise = global.Promise;
    mongoose.connection.openUri(uriBD);
    mongoose.connection.on('connected', function () {
        console.log('Mongoose! Conectado em ' + uriBD);
    });

    mongoose.connection.on('disconnected', function () {
        console.log('Mongoose! Desconectado de ' + uriBD);
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

