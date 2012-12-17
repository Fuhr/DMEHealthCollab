$(document).ready(function () {

    /* Init socket connection and view controller */
    // var HOST_URL = 'http://10.0.0.27:3000'
    var HOST_URL = location.hostname;
    var socket = io.connect(HOST_URL);

    var cc = new canvasController('testContainer', socket);
    var chat = new chatController('#chat-output', '#chat-input', socket);

    /* DOM specific code goes here */


    $('#toggle-button').click(function () {
        cc.toggleDraggable();
    });
    $('#rect-button').click(function () {
        // cc.setDraggable(false);
        cc.setActiveShape('rect');
    });
    $('#ellipse-button').click(function () {
        cc.setActiveShape('ellipse');
    });
    $('#circle-button').click(function () {
        cc.setActiveShape('circle');
    });
    $('#picker').farbtastic(function (data) {
        cc.updateColor(data);
    });
    $('#clear-button').click(function () {
        cc.clearCanvas();
    });

    $(function () {
        $('#fileupload').fileupload({
            dataType: 'json',
            add: function (e, data) {
                $.each(data.files, function (index, file) {
                    file.username = chat.username;
                });
                data.submit();
            },
            done: function (e, data) {
                cc.addImageToBackground(data.result[0].url);
            },
            progressall: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                console.log(progress);
                $('#progress .bar').width(progress + '%');
                if (progress == 100) {
                    $('#progress').width(0);
                }
            }
        });
    });

});
