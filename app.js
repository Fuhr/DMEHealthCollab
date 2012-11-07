
/**
 * Module dependencies.
 */

var express = require('express')
  , io = require('socket.io')
  , http = require('http')
  , path = require('path');

/* Initialize app and config */
var app = express();

app.root = __dirname;
require('./app/config')(app, express);
require('./app/server/router')(app);


/* Create server */
var server = http.createServer(app);
io.listen(server);
server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
