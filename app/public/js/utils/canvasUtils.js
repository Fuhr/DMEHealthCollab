function canvasUtils() {

	var _nodes = {};
    
    this.createStage = function(parent, width, height) {
        var stage = new Kinetic.Stage({
            container: parent,
            width: width, //700
            height: height //525
        });
        
        return stage;
    }
    
    this.createLayer = function(stage) {
        var layer = new Kinetic.Layer();
        stage.add(layer);
        
        return layer;
    }

    
    this.drawTestRect = function(layer, data) {
		var node = new Kinetic.Rect({
		   x: data.coords.x0,
		   y: data.coords.y0,
		   width: data.dx,
		   height: data.dy,
		   fill: data.color,
		   stroke: 'black',
		   strokeWidth: 1,
		   draggable: false,
		   id: data.coords.id
		});
		_nodes[data.coords.id] = node;
        layer.add(node);
        layer.draw();        
		return node;
    }
    
    this.setShapesDraggable = function (shapes, state) {
        console.log("Shape: " +  shapes.length);
        
        for (var i = 0; i< shapes.length; i++) {            
            shapes[i].setDraggable(state);
            
        }
    }
	
	this.moveNode = function(layer, moveObject){
		var node = _nodes[moveObject.id];
		node.setPosition(moveObject.x, moveObject.y);
		layer.draw();
	}
    
    
    // Test function. Should be deleted in the future
    this.rndColor = function() {
         function c() {
             return ('0' + Math.floor(Math.random() * 256).toString(16)).substr(-2);
         }
         return '#' + c() + c() + c();
    }
}