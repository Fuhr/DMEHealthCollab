module.exports = function(app) {


	app.get('/test', function(req, res){
	    res.render('test', { title: 'Express' });
	});
	
	app.get('/', function(req, res){
	    res.render('index1', { title: 'Express' });
	});	
};