function canvasUtils() {

	var _nodes = {};
    
    this.createStage = function(parent, width, height) {
        var stage = new Kinetic.Stage({
            container: parent,
            width: width, //700
            height: height //525
        });
        
        return stage;
    };
    
    this.createLayer = function(stage) {
        var layer = new Kinetic.Layer();
        stage.add(layer);
        
        return layer;
    };

    this.drawIndicatorRect = function(layer, shapeData) {
        var node = new Kinetic.Rect({
            x: shapeData.x,
            y: shapeData.y,
            width: 0,
            height: 0,
            fill: '#111',
            opacity: 0.3,
            stroke: 'black',
            strokeWidth: 1,
            draggable: false		
		});
		layer.add(node);
		layer.draw();
		return node;
    };
    
    this.drawIndicatorEllipse = function(layer, shapeData) {
		var node = new Kinetic.Ellipse({
            x: shapeData.ellipseOrigo.x,
            y: shapeData.ellipseOrigo.y,
            width: shapeData.dx,
            height: shapeData.dy,
            fill: shapeData.color,
            stroke: 'black',
            strokeWidth: 1,
            draggable: false,
            id: shapeData.id
		});
		node.attrs.radius.x = Math.abs(node.attrs.radius.x);
		node.attrs.radius.y = Math.abs(node.attrs.radius.y);
		_nodes[shapeData.id] = node;
        layer.add(node);
        layer.draw();        
		return node;
    };
    
    this.drawIndicatorCircle = function(layer, shapeData) {
		var node = new Kinetic.Circle({
            x: shapeData.ellipseOrigo.x,
            y: shapeData.ellipseOrigo.y,
            width: shapeData.dx,
            height: shapeData.dy,
            fill: shapeData.color,
            stroke: 'black',
            strokeWidth: 1,
            draggable: false,
            id: shapeData.id
		});
		
		node.attrs.radius = Math.abs(node.attrs.radius);
		_nodes[shapeData.id] = node;
        layer.add(node);
        
        layer.draw();        
		return node;
    };
    
    this.drawRect = function(layer, shapeData) {
		var node = new Kinetic.Rect({
            x: shapeData.x0,
            y: shapeData.y0,
            width: shapeData.dx,
            height: shapeData.dy,
            fill: shapeData.color,
            stroke: 'black',
            strokeWidth: 1,
            draggable: false,
            id: shapeData.id
		});
		_nodes[shapeData.id] = node;
        layer.add(node);
        layer.draw();        
		return node;
    };
    
    this.drawEllipse = function(layer, shapeData) {
		var node = new Kinetic.Ellipse({
            x: shapeData.ellipseOrigo.x,
            y: shapeData.ellipseOrigo.y,
            width: shapeData.dx,
            height: shapeData.dy,
            fill: shapeData.color,
            stroke: 'black',
            strokeWidth: 1,
            draggable: false,
            id: shapeData.id
		});
		
		node.attrs.radius.x = Math.abs(node.attrs.radius.x);
		node.attrs.radius.y = Math.abs(node.attrs.radius.y);
		_nodes[shapeData.id] = node;
        layer.add(node);
        layer.draw();        
		return node;
    };
    
    this.drawCircle = function(layer, shapeData) {
		var node = new Kinetic.Circle({
            x: shapeData.ellipseOrigo.x,
            y: shapeData.ellipseOrigo.y,
            width: shapeData.dx,
            height: shapeData.dy,
            fill: shapeData.color,
            stroke: 'black',
            strokeWidth: 1,
            draggable: false,
            id: shapeData.id
		});
		
		node.attrs.radius = Math.abs(node.attrs.radius);
		_nodes[shapeData.id] = node;
        layer.add(node);
        
        layer.draw();        
		return node;
    };
    
    
    this.setShapesDraggable = function (shapes, state) {        
        for (var i = 0; i< shapes.length; i++) {            
            shapes[i].setDraggable(state);
            
        }
    };
	
	this.moveNode = function(layer, moveObject){
		var node = _nodes[moveObject.id];
		node.setPosition(moveObject.x, moveObject.y);
		layer.draw();
	};
    
    
    // Test function. Should be deleted in the future
    this.rndColor = function() {
         function c() {
             return ('0' + Math.floor(Math.random() * 256).toString(16)).substr(-2);
         }
         return '#' + c() + c() + c();
    };
}