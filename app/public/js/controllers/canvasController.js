function canvasController(parentDiv, socket) {
    
    /* Init modules and variables */
    var cu = new canvasUtils();
    var shape = new Shape();
    var indicatorData = new IndicatorData();
    var indicatorShape, mouseDown;
    var drawFunctions = {'rect': cu.drawRect, 'ellipse': cu.drawEllipse, 'circle': cu.drawCircle};
    var indicFunctions = {'rect': cu.drawIndicatorRect, 'ellipse': cu.drawIndicatorEllipse, 'circle': cu.drawIndicatorCircle};
	var _clientId = '';
	var shapeNumber = 0;
	var indicCoords = {'x': '', 'y': ''};

    var stage = cu.createStage(parentDiv, '700', '525');
    var layer = cu.createLayer(stage);
    var canvas = stage.getContainer();   
    var _draggable = false;
    
    /* Event handlers */ 
    canvas.addEventListener('mousedown' , function(evt) {      
        if (isDraggable()) return;
        
        mouseDown = true;
        
        var pos = getMousePositionOnCanvas(evt);       
        //indicatorShape = cu.drawIndicatorRect(layer, pos);
        indicatorShape = indicFunctions[shape.form](layer, pos);
        
        shape.x0 = pos.x;
        shape.y0 = pos.y;
        indicatorData.x0 = pos.x;
        indicatorData.y0 = pos.y;
        indicatorData.x1 = pos.x;
        indicatorData.y1 = pos.y;
        
    });
    
    canvas.addEventListener('mousemove', function(evt){
        if (mouseDown === true) {
            
            
            var pos = getMousePositionOnCanvas(evt);       
            if (Math.abs(indicatorData.x1-pos.x) > 10 || Math.abs(indicatorData.y1-pos.y) > 10) {
                indicatorData.x1 = pos.x;
                indicatorData.y1 = pos.y;
                
                indicatorData.calcDelta();
                
                if (shape.form === 'rect') {
                    indicatorShape.attrs.width = indicatorData.dx;
                    indicatorShape.attrs.height = indicatorData.dy;
                    
                } 
                else if (shape.form === 'ellipse') {
                    
                    indicatorData.calcEllipseOrigo();
                    indicatorShape.attrs.x = indicatorData.ellipseOrigo.x;
                    indicatorShape.attrs.y = indicatorData.ellipseOrigo.y;
                                        
                    indicatorShape.attrs.radius.x = Math.abs(indicatorData.dx / 2);
                    indicatorShape.attrs.radius.y = Math.abs(indicatorData.dy / 2);

                }
                else if (shape.form === 'circle') {
                    
                    indicatorData.calcEllipseOrigo();
                    indicatorShape.attrs.x = indicatorData.ellipseOrigo.x;
                    indicatorShape.attrs.y = indicatorData.ellipseOrigo.y;
                                        
                    indicatorShape.attrs.radius = Math.abs(Math.sqrt(dx*dx + dy*dy)/2);
                }
                
                layer.draw();      
                                
            }    
        }
        
         
    });
    


    canvas.addEventListener('mouseup', function(evt) {  
        if (isDraggable()) return;
                
        mouseDown = false;
        indicatorShape.remove();
        var pos = getMousePositionOnCanvas(evt);
        shape.x1 = pos.x;
        shape.y1 = pos.y;

        sendShapeToServer(socket, shape);
    });

    canvas.addEventListener('touchstart', function(evt) {  
        if (isDraggable()) return;      
        
        var pos = getTouchPositionOnCanvas(evt);       
        //indicatorShape = cu.drawIndicatorRect(layer, pos);
        indicatorShape = indicFunctions[shape.form](layer, pos);
        
        shape.x0 = pos.x;
        shape.y0 = pos.y;
        indicatorData.x0 = pos.x;
        indicatorData.y0 = pos.y;
        indicatorData.x1 = pos.x;
        indicatorData.y1 = pos.y;
    });
    
    canvas.addEventListener('touchmove', function(evt){

        var pos = getTouchPositionOnCanvas(evt);       
        if (Math.abs(indicatorData.x1-pos.x) > 10 || Math.abs(indicatorData.y1-pos.y) > 10) {
            indicatorData.x1 = pos.x;
            indicatorData.y1 = pos.y;
            
            indicatorData.calcDelta();
            
            if (shape.form === 'rect') {
                indicatorShape.attrs.width = indicatorData.dx;
                indicatorShape.attrs.height = indicatorData.dy;
                
            } 
            else if (shape.form === 'ellipse') {
                
                indicatorData.calcEllipseOrigo();
                indicatorShape.attrs.x = indicatorData.ellipseOrigo.x;
                indicatorShape.attrs.y = indicatorData.ellipseOrigo.y;
                                    
                indicatorShape.attrs.radius.x = Math.abs(indicatorData.dx / 2);
                indicatorShape.attrs.radius.y = Math.abs(indicatorData.dy / 2);

            }
            else if (shape.form === 'circle') {
                
                indicatorData.calcEllipseOrigo();
                indicatorShape.attrs.x = indicatorData.ellipseOrigo.x;
                indicatorShape.attrs.y = indicatorData.ellipseOrigo.y;
                                    
                indicatorShape.attrs.radius = Math.abs(indicatorData.dx / 2);
            }
            
            layer.draw();      
                            
        }        
    });
    
    canvas.addEventListener('touchend', function(evt) {
        if (isDraggable()) return;

        indicatorShape.remove();
        var pos = getTouchPositionOnCanvas(evt);
        shape.x1 = pos.x;
        shape.y1 = pos.y;

        sendShapeToServer(socket, shape);

    });
    
    /* Socket handlers */
    socket.on('connect', function () {
        
        socket.on('clientId', function(data) {
            _clientId = data;
        })  
        socket.on('drawShape', function(data) {
            
            var node = drawFunctions[data.form](layer, data);
            
            // console.log(node);
			if (_draggable) {
			    setDraggable(_draggable);
			}
			
			setUpNodeHandlers(node,socket);
			
            // console.log('Layer: ' + JSON.stringify(layer.getChildren(), null, 4)); 
        });
		socket.on('shapeMoved', function(data) {
			cu.moveNode(layer, data);
        });
    });


    /*--------------------------------------*/
    
    this.setActiveShape = function (type) {
          shape.form = type;
    };
    
    
    setDraggable = function (state) {
        _draggable = state;
        cu.setShapesDraggable(layer.getChildren(), state);
    };
    
    this.toggleDraggable = function () {
        if (!_draggable) {
            _draggable = true;
            setDraggable(_draggable); 
        } 
        else {
            _draggable = false;
            setDraggable(_draggable);
        }
    };
    
    isDraggable = function () {
        return _draggable;
    };
    
    getMousePositionOnCanvas = function(evt) {
        var pos = {'x': '', 'y': ''};
        var mousePosition = stage.getMousePosition();
        
        pos.x = mousePosition.x;
        pos.y = mousePosition.y;
        
        return pos;
    };

    getTouchPositionOnCanvas = function(evt) {
        var pos = {'x': '', 'y': ''};
        var touchPosition = stage.getTouchPosition();
        pos.x = touchPosition.x;
        pos.y = touchPosition.y;

        return pos;
    };
	
	setUpNodeHandlers = function(node, socket){
		node.on('dragend.canvasDrag',function(event){
            var pos = event.shape.getPosition()
            var sendObject = {
                id: event.shape.attrs.id,
                x: pos.x,
                y: pos.y
            };
			socket.emit('shapeMove',sendObject);
		});
	};
	
	sendShapeToServer = function(socket, shape) {
	    shape.id = _clientId + shapeNumber;
        shapeNumber++;
		
		shape.calcDelta();
		console.log(shape);
	    shape.color = cu.rndColor();
		if (shape.form === 'ellipse' || shape.form === 'circle') {
		    shape.calcEllipseOrigo();
	    }
		
		adx = Math.abs(shape.dx);
		ady = Math.abs(shape.dy);
		if(adx <= 25 && ady <= 25 || adx <= 25 || ady <= 25) {
            return;
        }
        socket.emit('shapeDrawn', shape);  
	};
};