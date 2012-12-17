LH = require('./helpers/login-helper');
var CT = require('./helpers/country-list');
var AGE = require('./helpers/age-list');
var fs = require('fs');

module.exports = function (app, io, passport) {
    var shapeList = [];
    var _background = "";

    /* Page routing*/
    app.get('/canvas', ensureAuthenticated, function (req, res) {
        res.render('canvas', { menu: 'Canvas', username: req.user.username });
    });

    // app.get('/account', ensureAuthenticated, function (req, res) {
    //     res.render('account', { username: req.user.username, user: req.user, onlineusers: LH.users,
    //         capitalize: function(string){
    //             return string.charAt(0).toUpperCase() + string.slice(1);
    //         }
    //     });
    // });
    
    app.get('/', ensureAuthenticated, function (req, res) {
        res.render('account', { menu: 'Home', username: req.user.username, user: req.user, onlineusers: LH.users,
            capitalize: function(string){
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
        });
    });

    app.get('/onlineusers', ensureAuthenticated, function (req, res) {
    	console.log('###################USERS##################');
    	console.log(LH.users);
        res.render('onlineusers', { username: req.user.username, onlineusers: LH.users });
    });

    app.get('/logout', function (req, res) {
    	var deletedUser = LH.deleteUserByUserName(req.user.username);
		io.sockets.emit('userDisconnect', deletedUser.username);
        req.logout();
        res.redirect('/');
    });

    app.get('/createDb', function (req, res) {
        LH.createDb();
        res.redirect('/');
    });

    app.get('/login', function (req, res) {
       
        res.render('login', { user: req.user, message: req.flash('error'), newUser: '' });
    });

    app.post('/userpost', function (req, res) {
        var socketid = req.body.userid;
        var username = req.user.username;
        LH.addUserToSocketID(username, socketid);
        var sendData = { username: username };
        res.send(sendData);
    });

    app.post('/login',
        passport.authenticate('local', { failureRedirect: '/login', failureFlash: true, })
        , function (req, res) {
            
            res.redirect('/');            
    });

    app.get('/public/uploads/:username/:filename', function(req, res){
        fs.readFile(app.root + '/app/public/uploads/'+req.params.username+'/'+req.params.filename, function(err, data){
            res.writeHead('200', {
                'Content-type': data.type
            });
            res.end(data,'binary');
        });
    });

	// creating new accounts
	app.get('/signup', function(req, res) {
		res.render('signup', { title: 'Signup', ages : AGE, countries : CT });
	});
	
	app.post('/signup', function(req, res){
		console.log('############# CREATE USER ################');
		console.log(req.body.country);
		var currentDate = new Date();
		LH.addNewUser({
			username	: req.body.user,
			password	: req.body.pass,
			nickname	: req.body.name,
			sex			: req.body.sex,
			age			: req.body.age,
			email		: req.body.email,		
			phone		: req.body.phone,
			country		: req.body.country,
			user_since	: currentDate.toDateString()  
			}	
		);
        // res.redirect('/');
        // res.render('login', { user: '', message: ' New user created: ', newUser: req.body.user });
	});
    /* Socket handlers
    * Any functions related to socket handlers should have its own modules!
    * See this example: http://erickrdch.com/2012/05/chat-application-with-node-js-and-socket-io.html
    * for module exports see: http://www.hacksparrow.com/node-js-exports-vs-module-exports.html
    */
    io.sockets.on('connection', function (socket) {

        socket.emit('clientId', socket.id);
        socket.emit('getShapesOnConnect', {
            shapes: shapeList,
            background: _background
        });
        socket.on('shapeDrawn', function (data) {
            var serverShape = JSON.parse(data.serverShape);
            serverShape.attrs.id = data.clientShape.id;
            shapeList.push(serverShape);
            io.sockets.emit('drawShape', data.clientShape);
       });

       socket.on('shapeMove', function (data) {

            for (var i=0;i<shapeList.length;i++){
                if (shapeList[i].attrs.id == data.position.id) {
                    shapeList[i].attrs.x = data.position.x;
                    shapeList[i].attrs.y = data.position.y;
                }
            }
            
            io.sockets.emit('shapeMoved', data.position);
       });
            
       
       socket.on('chatToServer', function (data) {
            var user = LH.getUserBySocketID(socket.id);
            var sendData = {};
            sendData.username = user.username;
            sendData.color = user.color;
            sendData.msg = data;
            io.sockets.emit('chatToClient', sendData);
        });
        
        socket.on('disconnect', function () {
			var deletedUser = LH.deleteUserBySocketID(socket.id);
			io.sockets.emit('userDisconnect', deletedUser.username);
		});

        socket.on('backgroundImage', function(data){
            console.log('####################BACKGROUND##########################');
            console.log(data);
            _background = data;
            io.sockets.emit('changeBackground', data);
        });
		
		socket.on('clearCanvas', function() {
			shapeList = [];
			_background = "";
			io.sockets.emit('canvasCleared');
		});
    });
    
    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) { return next(); }
        res.redirect('/login');
    };
};