function chatController(outputSelector, inputSelector, socket){
    var self = this;
    var _clientId = "";
    this.username = "";
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
                    self.username = response.username;
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
    
    $(inputSelector).on('keypress',function(e){
        var code = (e.keyCode ? e.keyCode : e.which);
        if(code == 13){
            sendToChat(this);
        } else {
            return true;
        }
    });
    
    $('#chat-input-button').on('click', function(event){
        sendToChat(inputSelector)
    });
    
    
    sendToChat = function (selector) {
        var value = $(selector).val();        
        socket.emit('chatToServer', value);
        $(selector).val("");
        
        var height = $('#chat-output')[0].scrollHeight;
        $('#chat-output').scrollTop(height);

    }
};