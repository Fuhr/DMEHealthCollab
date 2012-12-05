LH = require('./helpers/login-helper');

module.exports = function (app, io, passport, uploadhandler) {
    var shapeList = [];

    /* Page routing*/
    app.get('/canvas', ensureAuthenticated, function (req, res) {
        res.render('canvas', { username: req.user.username });
    });

    app.get('/account', ensureAuthenticated, function (req, res) {
        res.render('account', { username: req.user.username, user: req.user,
            capitalize: function(string){
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
        });
    });

    app.get('/onlineusers', ensureAuthenticated, function (req, res) {
        res.render('onlineusers', { username: req.user.username, onlineusers: LH.users });
    });

    app.get('/', ensureAuthenticated, function (req, res) {
        res.render('index', { user: req.user, username: req.user.username });
    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/createDb', function (req, res) {
        LH.createDb();
        res.redirect('/');
    });

    app.get('/login', function (req, res) {
        res.render('login', { user: req.user, message: req.flash('error') });
    });

    app.post('/userpost', function (req, res) {
        var socketid = req.body.userid;
        var username = req.user.username;
        LH.addUserToSocketID(username, socketid);
        var sendData = { username: username };
        uploadhandler.setUserName(username);
        res.send(sendData);
    });

    app.post('/login',
        passport.authenticate('local', { failureRedirect: '/login', failureFlash: true })
        , function (req, res) {
            res.redirect('/');
    });
    
    // app.get('/upload',function(req, res) {
        // console.log("SUCCESS"); 
        // res.send("HI");
        // res.redirect('/');
    // });
    

	

		

    /* Socket handlers
    * Any functions related to socket handlers should have its own modules!
    * See this example: http://erickrdch.com/2012/05/chat-application-with-node-js-and-socket-io.html
    * for module exports see: http://www.hacksparrow.com/node-js-exports-vs-module-exports.html
    */
    io.sockets.on('connection', function (socket) {

        socket.emit('clientId', socket.id);
        socket.emit('getShapesOnConnect', shapeList);
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
    });
    
    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) { return next(); }
        res.redirect('/login');
    };
};