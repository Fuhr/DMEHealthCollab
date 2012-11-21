
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
	, Db = mongo.Db;


app.root = __dirname;

require('./app/server/helpers/login-helper');
require('./app/config')(app, express, flash, passport);
require('./app/server/router')(app, io, passport);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});







