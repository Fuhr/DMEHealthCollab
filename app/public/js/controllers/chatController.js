function chatController(outputSelector, inputSelector, socket){
    var _clientId = "";
    /* Socket handlers */
    socket.on('connect', function () {
        
        socket.on('clientId', function(data) {
            _clientId = data;
        });
        
        socket.on('chatToClient', function(data) {
            $(outputSelector).append(data);
        });
    });
    
    $(inputSelector).on('change',function(event){
        var value = $(this).val();
        console.log(value);
        socket.emit('chatToServer', value);
        $(this).val("");
    });
};