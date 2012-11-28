var flash = require('connect-flash')
	, passport = require('passport')
	, util = require('util')
	, LocalStrategy = require('passport-local').Strategy
	, mongo = require('mongodb')
	, Server = mongo.Server
	, Db = mongo.Db;
var LH = {};

function rndColor() {
    function c() {
        return ('0' + Math.floor(Math.random() * 256).toString(16)).substr(-2);
    }
    return '#' + c() + c() + c();
};

module.exports = LH;

LH.server = new Server('localhost', 27017, {auto_reconnect: true});
LH.db = new Db('userDb', LH.server);
LH.socketsByName = {};
LH.clientsByID = {};
LH.users = [];

LH.addUserToSocketID = function (username, socketid) {
    var user = {
        username: username,
        socketid: socketid,
        color: rndColor()
    };
    if (!LH.socketsByName[username]) {
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
            var tempUser = users[i];
            if (user.username == username) {
                user.socketid = socketid;
            }
        }
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

LH.createDb = function(){
	var users = [
		{ _id: 1, username: 'Oliver', password: '1234', nickname: 'Fjolliver', 
		sex: 'male', age: '26', email: 'oliver@example.com', phone: '70121416',
		country: 'Denmark', user_since: 'nov-10 2012'  },
				{ _id: 2, username: 'Emil', password: '1234', nickname: 'Yaagi', 
		sex: 'male', age: '23', email: 'emil@example.com', phone: '70131415',
		country: 'Denmark', user_since: 'nov-11 2012'  },
				{ _id: 3, username: 'Nicolai', password: '1234', nickname: 'Myrton', 
		sex: 'male', age: '23', email: 'nicolai@example.com', phone: '90115116',
		country: 'Denmark', user_since: 'nov-12 2012'  },
				{ _id: 4, username: 'Søren', password: '1234', nickname: 'Führ', 
		sex: 'male', age: '23', email: 'soren@example.com', phone: '90321321',
		country: 'Germany', user_since: 'nov-13 2012'  }
	];
	
	LH.db.open(function(err, db) {
		if(!err) {
			console.log("We are connected");
			db.collection('users', function(err, collection) {
				// var users = [{mykey:1}, {mykey:2}, {mykey:3}];

				collection.insert(users, {safe:true}, function(err, result) {

					collection.find().toArray(function(err, items) {});

					// var stream = collection.find({mykey:2}).stream();
					// stream.on("data", function(item) {
						// console.log(item);
					// });
					// stream.on("end", function() {});

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
	LH.db.open(function(err,db){
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

LH.findById = function(id, fn) {
	LH.db.open(function(err,db){
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
			LH.findByUsername(username, function(err, user) {
				if (err) { return done(err); }
				if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
				if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
				return done(null, user);
			})
		});
	}
));