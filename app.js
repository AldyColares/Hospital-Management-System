let http = require('http'),
  app = require('./config/express')();

http.createServer(app).listen(app.get('port'), function () {
  console.log(new Date().toLocaleString());
  console.log('Expess Server escutando na porta ' +
    app.get('port'));
});
