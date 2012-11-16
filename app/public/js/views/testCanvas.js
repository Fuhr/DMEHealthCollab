$(document).ready(function() {
    
    //     document.addEventListener('touchmove', function(e) {
    //  e.preventDefault();
    // }, false);
    
    
    // var HOST_URL = 'http://localhost/'
    var HOST_URL = 'http://10.0.0.33:3000'
    
    var socket = io.connect(HOST_URL);
    var stage = new Kinetic.Stage({
        container: 'testContainer',
        width: 700,
        height: 525
    });
            
    var layer = new Kinetic.Layer();
    stage.add(layer);
    var canvas = stage.getContainer();         
    var coords = {"x0":"","x1":"","y0":"","y1":""};
    
    
    
    
    /* Event handlers */ 
    canvas.addEventListener('mousedown' , function(evt) {
         x0 = evt.layerX;
         y0 = evt.layerY;
         
         coords.x0 = x0;
         coords.y0 = y0;
         console.log(coords);
     });
     canvas.addEventListener('mouseup', function(evt) {
         x1 = evt.layerX;
         y1 = evt.layerY;
         
         coords.x1 = x1;
         coords.y1 = y1;
         
         sendRectToServer(socket, coords);
         
     });
     
     canvas.addEventListener('touchstart', function(evt) {
         var touchPosition = stage.getTouchPosition();
         coords.x0 = touchPosition.x;
         coords.y0 = touchPosition.y;
     });
     
     canvas.addEventListener('touchend', function(evt) {
          var touchPosition = stage.getTouchPosition();
          coords.x1 = touchPosition.x;
          coords.y1 = touchPosition.y;
          
          sendRectToServer(socket, coords);
      });
         
     socket.on('connect', function () {
       socket.on('rectSend', function(data) {
           drawTestRect(layer, data);
        });  
    });
 });

/* TODO: Move these functions to util and/or drawing modules/classes */

function rndColor() {
     function c() {
         return ('0' + Math.floor(Math.random() * 256).toString(16)).substr(-2);
     }
     return '#' + c() + c() + c();
 }
 
function sendRectToServer(socket, coords) {
    dx = coords.x1 - coords.x0;
    dy = coords.y1 - coords.y0;
    
    console.log("dx: " + dx + " dy: " + dy);

    // TODO: This statement is bugged - doesn't take negative values into account
    /* Exits function if draw distance is too small */
   
    // if(dx <= 25 && dy <= 25 || dx = 25 || dy <= 25) {
    //         return
    // }
    
    /* Send shape information to server, thus pushing to other clients */ 
    socket.emit('rect', {
           coords: coords,
           dx: dx,
           dy: dy,
           color: rndColor()});
}
 
function drawTestRect(layer, data) {
    layer.add(new Kinetic.Rect({
           x: data.coords.x0,
           y: data.coords.y0,
           width: data.dx,
           height: data.dy,
           fill: data.color,
           stroke: 'black',
           strokeWidth: 1,
           draggable: true
        }));
    layer.draw();
}




