var upload = require('jquery-file-upload-middleware');

var UH = { };

upload.on('begin', function(fileInfo) {
	console.log(fileInfo);
});

module.exports = UH;