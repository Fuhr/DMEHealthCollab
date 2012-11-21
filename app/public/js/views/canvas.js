$(document).ready(function() {
    
    /* Init socket connection and view controller */
    var HOST_URL = 'http://localhost/'
    //var HOST_URL = 'http://192.168.0.16:3000'
    // var HOST_URL = 'http://10.0.0.43:3000'
    var socket = io.connect(HOST_URL);
    
	var cc = new canvasController('testContainer', socket);
    var chat = new chatController('#chat-output', '#chat-input', socket);
	
	/* DOM specific code goes here */

    $("#toggle-button").click(function() {
      cc.toggleDraggable();
    });
    $("#rect-button").click(function() {
        
        cc.setActiveShape('rect');
    });
    $("#ellipse-button").click(function() {
        cc.setActiveShape('ellipse');
    });
    $("#circle-button").click(function() {
        cc.setActiveShape('circle');
    });

 });


 





