function canvasController(parentDiv, socket) {
    
    /* Init modules and variables */
    var cu = new canvasUtils();
    var coords = {"x0":"","x1":"","y0":"","y1":"","id":""};
	var _clientId = "";
	var rectNumber = 0;

    var stage = cu.createStage(parentDiv, '700', '525');
    var layer = cu.createLayer(stage);
    var canvas = stage.getContainer();         
    var _draggable = false;
    
    /* Event handlers */ 
    canvas.addEventListener('mousedown' , function(evt) {            
        var pos = getMousePositionOnCanvas(evt);         
        coords.x0 = pos.x;
        coords.y0 = pos.y;
    });

    canvas.addEventListener('mouseup', function(evt) {  
        if (isDraggable()) return;
        
        var pos = getMousePositionOnCanvas(evt);
        coords.x1 = pos.x;
        coords.y1 = pos.y;

        sendRectToServer(socket, coords);
    });

    canvas.addEventListener('touchstart', function(evt) {        
        var pos = getTouchPositionOnCanvas(evt);
        coords.x0 = pos.x;
        coords.y0 = pos.y;
    });

    canvas.addEventListener('touchend', function(evt) {
        if (isDraggable()) return;

        var pos = getTouchPositionOnCanvas(evt);
        coords.x1 = pos.x;
        coords.y1 = pos.y;

        sendRectToServer(socket, coords);
    });
    
    /* Socket handlers */
    socket.on('connect', function () {
        
        socket.on('clientId', function(data) {
            _clientId = data;
        })  
        socket.on('rectSend', function(data) {
            var node = cu.drawTestRect(layer, data);
			setUpNodeHandlers(node,socket);
            // console.log('Layer: ' + JSON.stringify(layer.getChildren(), null, 4)); 
        });
		socket.on('rectMoved', function(data) {
			cu.moveNode(layer, data);
        });
    });


    /*--------------------------------------*/
    
    setDraggable = function (state) {
        _draggable = state;
        cu.setShapesDraggable(layer.getChildren(), state);
    }
    
    this.toggleDraggable = function () {
        if (!_draggable) {
            _draggable = true;
            setDraggable(_draggable); 
        } 
        else {
            _draggable = false;
            setDraggable(_draggable);
        }
    }
    
    isDraggable = function () {
        return _draggable;
    }
    
    getMousePositionOnCanvas = function(evt) {
        var pos = {'x': '', 'y': ''};
        var mousePosition = stage.getMousePosition();
        
        pos.x = mousePosition.x;
        pos.y = mousePosition.y;
        
        return pos;
    }

    getTouchPositionOnCanvas = function(evt) {
        var pos = {'x': '', 'y': ''};
        var touchPosition = stage.getTouchPosition();
        pos.x = touchPosition.x;
        pos.y = touchPosition.y;

        return pos;
    }
	
	setUpNodeHandlers = function(node, socket){
		node.on('dragend.canvasDrag',function(event){
            var pos = event.shape.getPosition()
            var sendObject = {
                id: event.shape.attrs.id,
                x: pos.x,
                y: pos.y
            };
			socket.emit('rectMove',sendObject);
		});
	}

    sendRectToServer = function(socket, coords) {
        dx = coords.x1 - coords.x0;
        dy = coords.y1 - coords.y0;

		coords.id = _clientId + rectNumber;
		rectNumber++;
		
		adx = Math.abs(dx);
		ady = Math.abs(dy);
        if(adx <= 25 && ady <= 25 || adx <= 25 || ady <= 25) {
            return;
        }
        
        /* Send shape information to server, thus pushing to other clients */ 
        socket.emit('rect', {
            coords: coords,
            dx: dx,
            dy: dy,
            color: cu.rndColor()});
    }
}