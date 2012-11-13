$(document).ready(function() {
   // do stuff when DOM is ready
   
   // console.log("herp derp");
   // 
   // var newCanvas = 
   //    $('<canvas/>',{'class':'testCanvas'})
   //    .width(600)
   //    .height(400);
   //       
   // $("#testCanvas").append(newCanvas);
   
   var stage = new Kinetic.Stage({
           container: 'testCanvas',
           width: 578,
           height: 200
         });

         var layer = new Kinetic.Layer();

         // var rect = new Kinetic.Rect({
         //            x: 239,
         //            y: 75,
         //            width: 100,
         //            height: 50,
         //            fill: 'green',
         //            stroke: 'black',
         //            strokeWidth: 4,
         //            draggable: true
         //          });

         // add the shape to the layer
         // layer.add(rect);

         // add the layer to the stage
         stage.add(layer);
         
         var canvas = stage.getContainer();
         
         
         var xo, yo, xe, ye;
         
         canvas.addEventListener('mousedown' , function(evt) {
             console.log("x: "+ evt.layerX + "\n" + "y: " + evt.layerY);
             xo = evt.layerX;
             yo = evt.layerY;
         });
         
         
         canvas.addEventListener('mouseup', function(evt) {
              console.log("x: "+ evt.layerX + "\n" + "y: " + evt.layerY);
              xe = evt.layerX;
              ye = evt.layerY;
              
              layer.add(new Kinetic.Rect({
                  x: xo,
                  y: yo,
                  width: xe-xo,
                  height: ye-yo,
                  fill: 'red',
                  stroke: 'black',
                  strokeWidth: 1,
                  draggable: true
              })
              );
              layer.draw();
              console.log(stage);
          });
 });