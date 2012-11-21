function canvasController(parentDiv, socket) {
    
    /* Init modules and variables */
    var cu = new canvasUtils();
    var shape = new Shape();
    var drawFunctions = {'rect': cu.drawRect, 'ellipse': cu.drawEllipse, 'circle': cu.drawCircle};
	var _clientId = "";
	var shapeNumber = 0;

    var stage = cu.createStage(parentDiv, '700', '525');
    var layer = cu.createLayer(stage);
    var canvas = stage.getContainer();         
    var _draggable = false;
    
    /* Event handlers */ 
    canvas.addEventListener('mousedown' , function(evt) {            
        var pos = getMousePositionOnCanvas(evt);         
        shape.x0 = pos.x;
        shape.y0 = pos.y;
        
    });

    canvas.addEventListener('mouseup', function(evt) {  
        if (isDraggable()) return;
        
        var pos = getMousePositionOnCanvas(evt);
        shape.x1 = pos.x;
        shape.y1 = pos.y;

        sendShapeToServer(socket, shape);
    });

    canvas.addEventListener('touchstart', function(evt) {        
        var pos = getTouchPositionOnCanvas(evt);
        shape.x0 = pos.x;
        shape.y0 = pos.y;
    });

    canvas.addEventListener('touchend', function(evt) {
        if (isDraggable()) return;

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
            
            
            // var node = cu.drawTestRect(layer, data);
            var node = drawFunctions[data.form](layer, data);
			
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