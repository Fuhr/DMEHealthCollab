
/**
 * Module dependencies.
 */

var express = require('express')
  

/* Initialize app and config */
var app = express()
    , io = require('socket.io')
    , http = require('http')
    , path = require('path');

app.root = __dirname;
require('./app/config')(app, express);
require('./app/server/router')(app);


/* Create server */
var server = http.createServer(app);
io = io.listen(server);
server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

// TESTING PURPOSES ONLY - TO BE DELETED OR MOVED
io.sockets.on('connection', function (socket) {
    socket.on('rect', function (data) {
        io.sockets.emit('rectSend', data);
   });
});



