var flash = require('connect-flash')
	, passport = require('passport')
	, util = require('util')
	, LocalStrategy = require('passport-local').Strategy
	, mongo = require('mongodb')
	, Server = mongo.Server;
	// , Db = mongo.Db;
var LH = {};

function rndColor() {
    function c() {
        return ('0' + Math.floor(Math.random() * 256).toString(16)).substr(-2);
    }
    return '#' + c() + c() + c();
};

module.exports = LH;

// LH.server = new Server('localhost', 27017, {auto_reconnect: true});
// LH.db = new Db('userDb', LH.server);

// LH.db = new Db('nodejitsu_fjolliver_nodejitsudb769554085', new mongo.Server('ds043927.mongolab.com', 43927, {}));
// LH.db.auth("nodejitsu_fjolliver", "vhcjo0j0joffl6q62jagg11ar3");


LH.db = new mongo.Db('nodejitsu_fjolliver_nodejitsudb769554085',
  new mongo.Server('ds043927.mongolab.com', 43927, {})
);




LH.socketsByName = {};
LH.clientsByID = {};
LH.users = [];

LH.addUserToSocketID = function (username, socketid) {
	done = function(user){
		console.log('Entered Done');
	    if (!LH.socketsByName[username]) {
			console.log('Add to socketsByName list');
	        LH.socketsByName[username] = user;
	        LH.clientsByID[socketid] = user;
	        LH.users.push(user);
	    } else {
	        var oldUser = LH.getUserByName(username);
	        delete LH.socketsByName[oldUser.username];
	        delete LH.clientsByID[oldUser.socketid];
	        LH.socketsByName[username] = user;
	        LH.clientsByID[socketid] = user;
	        for (var i = 0; i < LH.users.length; i++) {
	            var tempUser = LH.users[i];
	            if (tempUser.username == username) {
	                tempUser.socketid = socketid;
	            }
	        }
	    }
	}
	var user = LH.findByUsername(username, function(err,foundUser){
		if (err) {
			return 'Error';
		} else if (!foundUser) {
			return 'Invalid username';
		}else{
			var tempUser = foundUser;
			tempUser['color'] = rndColor();
			done(tempUser);
		}
	});
};

LH.deleteUserBySocketID = function (socketid){
	var oldUser = LH.clientsByID[socketid];
	if (!oldUser) {
        return "NOUSER";
    } else {
    	delete LH.socketsByName[oldUser.username];
    	delete LH.clientsByID[oldUser.socketid];
    	for (var i = 0; i < LH.users.length; i++) {
            var tempUser = LH.users[i];
            if (oldUser.username == tempUser.username) {
            	LH.users.splice(i,1);
            }
        }
        return oldUser;
    }
};

LH.deleteUserByUserName = function (username){
	var oldUser = LH.socketsByName[username];
	if (!oldUser) {
        return "NOUSER";
    } else {
    	delete LH.socketsByName[oldUser.username];
    	delete LH.clientsByID[oldUser.socketid];
    	for (var i = 0; i < LH.users.length; i++) {
            var tempUser = LH.users[i];
            if (oldUser.username == tempUser.username) {
            	LH.users.splice(i,1);

            }
        }
        return oldUser;
    }
};

LH.getUserBySocketID = function (socketid) {
    var user = LH.clientsByID[socketid];
    if (!user) {
        return "NOUSER";
    } else {
        return user;
    }
};

LH.getUserByName = function (username) {
    var user = LH.socketsByName[username];
    if (!user) {
        return "NOSOCKET";
    } else {
        return user;
    }
};
LH.addNewUser = function(newData, callback)
{
	console.log('###############addNewUser########');
	console.log(newData);
	
LH.db.open(function (err, db_p) {
  if (err) { throw err; }
  LH.db.authenticate('nodejitsu_fjolliver', 'vhcjo0j0joffl6q62jagg11ar3', function (err, replies) {
			LH.db.collection('userDb', function(err, collection) {
				collection.insert(newData, {safe:true}, function(err, result) {
					collection.find().toArray(function(err, items) {});
					console.log('###### DB ######');
					console.log(replies);

					// // log all users in the db
					// var stream = collection.find({}).stream();
					// stream.on("data", function(item) {
						// console.log(item);
					// });
					// stream.on("end", function() {});
					LH.db.close();
					});
			});
		});
	});
}

LH.createDb = function(){
	var users = [
		{ username: 'Oliver', password: '1234', nickname: 'Fjolliver', 
		sex: 'male', age: '26', email: 'oliver@example.com', phone: '70121416',
		country: 'Denmark', user_since: 'nov-10 2012'  },
				{ username: 'Emil', password: '1234', nickname: 'Yaagi', 
		sex: 'male', age: '23', email: 'emil@example.com', phone: '70131415',
		country: 'Denmark', user_since: 'nov-11 2012'  },
				{ username: 'Nicolai', password: '1234', nickname: 'Myrton', 
		sex: 'male', age: '23', email: 'nicolai@example.com', phone: '90115116',
		country: 'Denmark', user_since: 'nov-12 2012'  },
				{ username: 'Søren', password: '1234', nickname: 'Führ', 
		sex: 'male', age: '23', email: 'soren@example.com', phone: '90321321',
		country: 'Germany', user_since: 'nov-13 2012'  }
	];
	
	LH.db.open(function(err, db) {
		if(!err) {
			db.collection('users', function(err, collection) {
				collection.insert(users, {safe:true}, function(err, result) {
					collection.find().toArray(function(err, items) {});

					// log all users in the db
					var stream = collection.find({}).stream();
					stream.on("data", function(item) {
						console.log(item);
					});
					stream.on("end", function() {});
					db.close();
				});
			});
		}
	});
};

LH.findByUsername = function(username, fn){
	console.log('Trying to auth for '+username);
	LH.db.open(function(err, db) {
		if(err) { throw err; }
		LH.db.authenticate('nodejitsu_fjolliver', 'vhcjo0j0joffl6q62jagg11ar3', function (err, replies) {
			console.log('Auth OK');
			LH.db.collection('userDb', function(err, collection) {
				console.log('Looking for '+username);
				collection.findOne({username:username},function(userErr,item){
					LH.db.close();
					if(!userErr){
						console.log('Just found '+item.username);
						return fn(null,item);
					}
					return fn(userErr,null);
				});
			});
		});
		
	});
};

LH.findById = function(id, fn) {
LH.db.authenticate('nodejitsu_fjolliver', 'vhcjo0j0joffl6q62jagg11ar3', function (err, replies) {
			LH.db.collection('userDb', function(err, collection) {
				var obj_id = mongo.ObjectID.createFromHexString(id);
				collection.findOne({_id:obj_id},function(userErr,item){
					db.close();
					if(!userErr){
						return fn(null,item);
					}
					return fn(userErr,null);
				});
			});
		
	});
};

passport.serializeUser(function(user, done) {
	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	LH.findById(id, function (err, user) {
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
			console.log('##### Logging in.... ######');
			LH.findByUsername(username, function(err, user) {
				if (err) { return done(err); }
				if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
				if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
				console.log('Now returning '+user.username);
				return done(null, user);
			})
		});
	}
));