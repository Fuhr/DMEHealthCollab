$(document).ready(function() {

    var socket = io.connect('http://localhost/');
    var stage = new Kinetic.Stage({
        container: 'testContainer',
        width: 578,
        height: 200
    });
        
    var layer = new Kinetic.Layer();
    stage.add(layer);
    var canvas = stage.getContainer();     
    var xo, yo, xe, ye;
         
     canvas.addEventListener('mousedown' , function(evt) {
         // console.log("x: "+ evt.layerX + "\n" + "y: " + evt.layerY);
         xo = evt.layerX;
         yo = evt.layerY;
     });
         
     socket.on('connect', function () {
       socket.send('hi');
       socket.on('news', function (hello) {
         // my msg
         console.log(hello);
       });
       
       
        canvas.addEventListener('mouseup', function(evt) {
            // console.log("x: "+ evt.layerX + "\n" + "y: " + evt.layerY);
            xe = evt.layerX;
            ye = evt.layerY;

            socket.emit('rect', {x0: xo, y0: yo, x1: xe, y1: ye});
        });  
     
        socket.on('rectSend', function(data) {
        
            console.log("Received - x0: " + data.x0);
            layer.add(new Kinetic.Rect({
                       x: data.x0,
                       y: data.y0,
                       width: data.x1-data.x0,
                       height: data.y1-data.y0,
                       fill: 'red',
                       stroke: 'black',
                       strokeWidth: 1,
                       draggable: true
                   })
                   );
                   layer.draw();
        });  
    });
 });