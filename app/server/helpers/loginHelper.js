module.exports = function(Server, Db, passport, LocalStrategy, flash){
	var server = new Server('localhost', 27017, {auto_reconnect: true});
	var db = new Db('exampleDb', server);

	function fetchUser(username, fn){
		db.open(function(err,db){
			if(!err){
				db.collection('users', function(err, collection) {
					collection.findOne({username:username},function(userErr,item){
						db.close();
						console.log(item);
						if(!userErr){
							return fn(null,item);
						}
						return fn(userErr,null);
					});
				});
			}else{
				console.log('Error!!!!!');
				return fn(err,null);
			}
		});
	};

	function findById(id, fn) {
		db.open(function(err,db){
			if(!err){
				db.collection('users', function(err, collection) {
					collection.findOne({_id:id},function(userErr,item){
						db.close();
						console.log(item);
						if(!userErr){
							return fn(null,item);
						}
						return fn(userErr,null);
					});
				});
			}else{
				console.log('Error!!!!!');
				return fn(err,null);
			}
		});
	}

	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		findById(id, function (err, user) {
			done(err, user);
		});
	});

	passport.use(new LocalStrategy(
		function(username, password, done) {
		// asynchronous verification, for effect...
			process.nextTick(function () {
			  
				// Find the user by username.  If there is no user with the given
				// username, or the password is not correct, set the user to `false` to
				// indicate failure and set a flash message.  Otherwise, return the
				// authenticated `user`.
				fetchUser(username, function(err, user) {
					if (err) { return done(err); }
					if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
					if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
					return done(null, user);
				})
			});
		}
	));
}