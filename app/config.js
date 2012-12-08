
module.exports = function(app, express, flash, passport) {

	app.configure(function(){
		app.set('port', process.env.PORT || 3000);
		app.set('views', app.root + '/app/server/views');
		app.set('view engine', 'jade');
		app.use(express.favicon());
		app.use(express.logger('dev'));
        //Configuration for upload handling
        // app.use('/upload', uploadhandler.fileHandler(app.root));
		app.use(express.bodyParser());
		app.use(express.methodOverride());
		app.use(express.cookieParser('your secret here'));
		app.use(express.session());
		app.use(flash());
		// app.use(require('stylus').middleware(app.root + '/app/public'));
		app.use(express.static(app.root + '/app/server'));
		app.use(express.static(app.root + '/app/public'));
		app.use(passport.initialize());
		app.use(passport.session());
		app.use(app.router);
    });
	
	app.configure('development', function(){
		app.use(express.errorHandler());
    });
}