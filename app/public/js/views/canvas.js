$(document).ready(function() {
    
    /* Init socket connection and view controller */
    //var HOST_URL = 'http://localhost:3000/'
    //var HOST_URL = 'http://192.168.0.16:3000'
    var HOST_URL = 'http://192.168.0.14:3000'
    //var HOST_URL = 'http://192.168.0.17:3000'
    //var HOST_URL = 'http://9.150.189.162:3000'
    var socket = io.connect(HOST_URL);
    
    var cc = new canvasController('testContainer', socket);
    var chat = new chatController('#chat-output', '#chat-input', socket);
    
    /* DOM specific code goes here */
    


    $('#picker').farbtastic(function(data){
        cc.updateColor(data);
    });
    $('#toggle-button').click(function() {
      cc.toggleDraggable();
    });
    $('#rect-button').click(function() {
        
        cc.setActiveShape('rect');
    });
    $('#ellipse-button').click(function() {
        cc.setActiveShape('ellipse');
    });
    $('#circle-button').click(function() {
        cc.setActiveShape('circle');
    });

 });
