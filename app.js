
/**
 * Module dependencies,
 * initialize app, and config
 */

var express = require('express')
var app = express()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server)
    , path = require('path')
	, flash = require('connect-flash')
	, passport = require('passport')
	, util = require('util')
	, LocalStrategy = require('passport-local').Strategy
	, mongo = require('mongodb')
	, Server = mongo.Server
	, Db = mongo.Db
	, upload = require('jquery-file-upload-middleware')
	, uploadhandler = require('./app/server/helpers/upload-handler');


app.root = __dirname;

console.log(upload.UploadHandler);

require('./app/server/helpers/login-helper');
require('./app/config')(app, express, flash, passport, uploadhandler);
require('./app/server/router')(app, io, passport);
io.set('log level', 1);
server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});







