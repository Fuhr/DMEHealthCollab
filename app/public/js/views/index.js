$(document).ready(function () {
    var HOST_URL = 'http://192.168.0.14:3000'

    var socket = io.connect(HOST_URL);
    var _clientId = "";
    var _username = "";
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
    });
});