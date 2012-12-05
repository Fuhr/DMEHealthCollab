var upload = require('jquery-file-upload-middleware');

var UH = { };

//Upload events here

	// fileInfo structure is the same as returned to browser
	// { 
	//     name: '3 (3).jpg',
	//     originalName: '3.jpg',
	//     size: 79262,
	//     type: 'image/jpeg',
	//     delete_type: 'DELETE',
	//     delete_url: 'http://yourhost/upload/3%20(3).jpg',
	//     url: 'http://yourhost/uploads/3%20(3).jpg',
	//     thumbnail_url: 'http://youhost/uploads/thumbnail/3%20(3).jpg' 
	// }

upload.on('begin', function(fileInfo) {
	console.log(fileInfo);
});

upload.on('abort', function (fileInfo) { 
	console.log(fileInfo);
});

upload.on('end', function (fileInfo) {
	console.log(fileInfo);
});

upload.on('error', function (e) {
	console.log(e.message);
});

//Functions which use the upload module, or are related to handling of uploads
UH.fileHandler = function(req, res, next){
	return upload.fileHandler({
		uploadDir: function() { 
			return __dirname + 'public/uploads/' + req.user.username;
		},
		uploadUrl: function() {
			return '/uploads/' + req.user.username;
		},
		imageVersions: {
			thumbnail: {
				width: 80,
				height: 80
			}
		}
	})(req, res, next);
};

UH.helloWorld = function(){console.log("Hi world");}

module.exports = UH;