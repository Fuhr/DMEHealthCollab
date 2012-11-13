module.exports = function(app, io) {

    /* Page routing*/
	app.get('/test', function(req, res){
	    res.render('test', {});
	});
	
	app.get('/', function(req, res){
	    res.render('index', {});
	});	

    /* Socket handlers
    * Any functions related to socket handlers should have its own modules!
    * See this example: http://erickrdch.com/2012/05/chat-application-with-node-js-and-socket-io.html
    * for module exports see: http://www.hacksparrow.com/node-js-exports-vs-module-exports.html
    */
    io.sockets.on('connection', function (socket) {
        socket.on('rect', function (data) {
            io.sockets.emit('rectSend', data);
       });
    });
};