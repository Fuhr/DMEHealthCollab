
/**
 * Module dependencies,
 * initialize app, and config
 */

var express = require('express')
var app = express()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server)
    , path = require('path');


app.root = __dirname;

require('./app/config')(app, express);
require('./app/server/router')(app, io);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});







