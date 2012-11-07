
/**
 * Module dependencies.
 */

var express = require('express')
  // , routes = require('./app/server/routes')
  , sio = require('socket.io')
  , http = require('http')
  , path = require('path');

var app = express();

app.root = __dirname;
require('./app/config')(app, express);
require('./app/server/router')(app);

// app.get('/test', routes.test);
// app.get('/', routes.index);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
