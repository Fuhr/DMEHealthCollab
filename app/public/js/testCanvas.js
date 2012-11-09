$(document).ready(function() {
   // do stuff when DOM is ready
   
   console.log("herp derp");
   
   var newCanvas = 
      $('<canvas/>',{'class':'testCanvas'})
      .width(100)
      .height(100);
      
   $("#testCanvas").append(newCanvas);

 });