$(document).ready(function() {
    
    /* Init socket connection and view controller */
    var HOST_URL = 'http://localhost/'
    // var HOST_URL = 'http://10.0.0.43:3000'
    var socket = io.connect(HOST_URL);
    
	var cc = new canvasController('testContainer', socket);
	
	/* DOM specific code goes here */

    $(".btn-inverse").click(function() {
      cc.toggleDraggable()
    });

 });


 





