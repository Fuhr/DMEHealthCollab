function chatController(outputSelector, inputSelector, socket){
    var _clientId = "";
    var _username = "";
    /* Socket handlers */
    socket.on('connect', function () {

        socket.on('clientId', function (data) {
            _clientId = data;
            var postData = { userid: _clientId };
            $.ajax({
                url: '/userpost',
                type: 'POST',
                data: postData,
                success: function (response) {
                    _username = response.username;
                    console.log(JSON.stringify(response));
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log('Problem fetching username');
                }
            });
        });

        socket.on('chatToClient', function (data) {
            var temp = '<span style="color:' + data.color + ';">&nbsp;<b>' + data.username + '</b></span><b>:</b> <span>' + data.msg + '<br></span>';
            $(outputSelector).append(temp);
        });
    });
    
    $(inputSelector).on('change',function(event){
        var value = $(this).val();
        console.log(value);
        socket.emit('chatToServer', value);
        $(this).val("");
    });
};