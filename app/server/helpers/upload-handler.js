var upload = require('jquery-file-upload-middleware');

var UH = { };

var username;

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
    console.log("UPLOAD BEGIN");
	console.log(fileInfo);
});

upload.on('abort', function (fileInfo) { 
    console.log("UPLOAD ABORT");
	console.log(fileInfo);
});

upload.on('end', function (fileInfo) {
    console.log("UPLOAD END");
	console.log(fileInfo);
});

upload.on('error', function (e) {
    console.log("UPLOAD ERROR");
	console.log(e.message);
});

//Functions which use the upload module, or are related to handling of uploads
UH.fileHandler = function(root){
    root = root + "/app"
    console.log("Saving to: " + root);
	return upload.fileHandler({
		uploadDir: root + '/public/uploads',
		uploadUrl: '/uploads'
	});
};

UH.setUserName = function(usernameParam){
    username = usernameParam;
    console.log(username);
}



UH.helloWorld = function(){console.log("Hi world");}

module.exports = UH;