var http = require('http');
var app = require('./config/express')();

http.createServer(app).listen(app.get('port'), function(){
    console.log(new Date().toLocaleString("en-US", {timeZone: "America/New_York"}));
    console.log('Expess Server escutando na porta ' +
       app.get('port'));
});