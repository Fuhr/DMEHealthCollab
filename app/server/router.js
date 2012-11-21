LH = require('./helpers/login-helper');

module.exports = function(app, io, passport) {

    /* Page routing*/
	app.get('/canvas', function(req, res){
	    res.render('canvas', {});
	});
	
	app.get('/', ensureAuthenticated, function(req, res){
		res.render('index', { user: req.user, username: req.user.username });
	});
	
	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});
	
	app.get('/createDb', function(req, res){
		LH.createDb();
		res.redirect('/');
	});
	
	app.get('/login', function(req, res){
		res.render('login', { user: req.user, message: req.flash('error') });
	});

	app.post('/login', 
		passport.authenticate('local', { failureRedirect: '/login', failureFlash: true })
		, function(req, res) {
			res.redirect('/');
	});
	
    /* Socket handlers
    * Any functions related to socket handlers should have its own modules!
    * See this example: http://erickrdch.com/2012/05/chat-application-with-node-js-and-socket-io.html
    * for module exports see: http://www.hacksparrow.com/node-js-exports-vs-module-exports.html
    */
    io.sockets.on('connection', function (socket) {
        
        socket.emit('clientId', socket.id);
        socket.on('shapeDrawn', function (data) {
            io.sockets.emit('drawShape', data);
       });
	   socket.on('shapeMove', function (data) {
            io.sockets.emit('shapeMoved', data);
       });
    });
	
	function ensureAuthenticated(req, res, next) {
		if (req.isAuthenticated()) { return next(); }
		res.redirect('/login');
	};
};