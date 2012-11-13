$(document).ready(function() {

    var socket = io.connect('http://localhost/');
    var stage = new Kinetic.Stage({
        container: 'testContainer',
        width: 600,
        height: 400
    });
        
    var layer = new Kinetic.Layer();
    var circleLayer = new Kinetic.Layer();
    stage.add(layer);
    stage.add(circleLayer);
    var canvas = stage.getContainer();     
    var color, x0, y0, x1, y1;
   
    canvas.addEventListener('mousedown' , function(evt) {
         // console.log("x: "+ evt.layerX + "\n" + "y: " + evt.layerY);
         x0 = evt.layerX;
         y0 = evt.layerY;
     });
     canvas.addEventListener('mouseup', function(evt) {
         // console.log("x: "+ evt.layerX + "\n" + "y: " + evt.layerY);
         x1 = evt.layerX;
         y1 = evt.layerY;
         color = rndColor();
         socket.emit('rect', {x0: x0, y0: y0, x1: x1, y1: y1, color: color});
     });
     canvas.addEventListener('click', function() {
     	nowDance(layer);
     	nowDance(circleLayer);
     	}, false);
     socket.on('connect', function () {
       socket.on('rectSend', function(data) {
           console.log("Received - x0: " + data.x0);
           drawTestCircle(circleLayer);
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
 
function drawTestRect(layer, data) {
    layer.add(new Kinetic.Rect({
           x: data.x0,
           y: data.y0,
           width: data.x1-data.x0,
           height: data.y1-data.y0,
           fill: data.color,
           stroke: 'black',
           strokeWidth: 1,
           draggable: true
        }));
    layer.draw();
}

function drawTestCircle(circleLayer) {
        var circle = new Kinetic.Circle({
          x: 20,
          y: 20,
          radius: 20,
          fill: "yellow",
          stroke: "black",
          strokeWidth: 2,
          draggable: true
        });
        circleLayer.add(circle);
        
		circle.on("mouseover", function() {
    		this.setFill("orange");
        	circleLayer.draw();
        });
        circle.on("mouseout", function() {
        	this.setFill("#ffff2b");
            circleLayer.draw();
        });
        circle.on("click", function() {
        circle.remove();
        circleLayer.draw();
        });            
		circleLayer.draw();
}
function nowDance(layer) {
        for(var n = 0; n < layer.getChildren().length; n++) {
        	var shape = layer.getChildren()[n];
          	var stage = shape.getStage();
          	shape.transitionTo({
            	rotation: Math.random() * Math.PI * 2,
            	radius: Math.random() * 100 + 20,
            	x: Math.random() * stage.getWidth(),
            	y: Math.random() * stage.getHeight(),
            	opacity: Math.random(),
            	duration: 1,
            	easing: 'ease-in-out'
			});
        }
}
