module.exports = function(app, io) {

    /* Page routing*/
	app.get('/test', function(req, res){
	    res.render('test', {});
	});
	
	app.get('/', function(req, res){
	    res.render('index', {});
	});	

    /* Socket handlers */
    io.sockets.on('connection', function (socket) {
        socket.on('rect', function (data) {
            io.sockets.emit('rectSend', data);
       });
    });
};