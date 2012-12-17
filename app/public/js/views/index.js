$(document).ready(function () {
    var HOST_URL = location.hostname;

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
                    getUsers();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log('Problem fetching username');
                }
            });
        });
    });
        
    getUsers = function() {
        $.ajax({
            url: '/onlineusers',
            type: 'GET',
            dataType: 'JSON',
            success: function (response) {
                
                $('#usersTable').html('');              
                var users = response.users;
                for (var i = 0; i < users.length; i++) {
                    
                    //HOLY CRAP THIS IS SO UGLY! OMG :/ 
                    $('#usersTable').append('<tr><td><span style="color:' +
                        users[i].color + ';">' +
                        users[i].username + '</span></td><td><a href="mailto:' +
                        users[i].email + '">' +
                        users[i].email +'</a></td><td>' +
                        users[i].nickname + '</td><td>' +
                        users[i].sex +'</td><td>' +
                        users[i].age +'</td></tr>');                  
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('Error on GET ');
            }
        });
    };
    
    fillOnlineUsers = function() {
        
    }
    
});
