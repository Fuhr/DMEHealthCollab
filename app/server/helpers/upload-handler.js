var upload = require('jquery-file-upload-middleware');

var UH = { };

upload.on('begin', function(fileInfo) {
	console.log(fileInfo);
});

UH.fileHandler = function(upDir, upUrl){
	return upload.fileHandler({
		uploadDir: __dirname + upDir,
		uploadUrl: upUrl
	})
};

UH.helloWorld = function(){console.log("Hi world");}

module.exports = UH;