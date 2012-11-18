function canvasController(parentDiv, socket) {
    var cu = new canvasUtils();
    var coords = {"x0":"","x1":"","y0":"","y1":""};


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
        var pos = getMousePositionOnCanvas(evt);
        coords.x1 = pos.x;
        coords.y1 = pos.y;

        if (isDraggable()) return;
        sendRectToServer(socket, coords);
        
      
    });

    canvas.addEventListener('touchstart', function(evt) {
        var pos = getTouchPositionOnCanvas(evt);
        coords.x0 = pos.x;
        coords.y0 = pos.y;
    });

    canvas.addEventListener('touchend', function(evt) {
        var pos = getTouchPositionOnCanvas(evt);
        coords.x1 = pos.x;
        coords.y1 = pos.y;

        sendRectToServer(socket, coords);
    });
    



    /* Socket handlers */
    socket.on('connect', function () {
        socket.on('rectSend', function(data) {
            cu.drawTestRect(layer, data);
            // console.log('Layer: ' + JSON.stringify(layer.getChildren(), null, 4));
            
        });  
    });

    setDraggable = function (state) {
        _draggable = state;
        cu.setShapesDraggable(layer.getChildren(), state);
    }
    
    isDraggable = function () {
        return _draggable;
    }
    
    
    
    getMousePositionOnCanvas = function(evt) {
        var result = {'x': '', 'y': ''};
        result.x = evt.layerX;
        result.y = evt.layerY;

        return result;
    }

    getTouchPositionOnCanvas = function(evt) {
        var result = {'x': '', 'y': ''};
        var touchPosition = stage.getTouchPosition();
        result.x = touchPosition.x;
        result.y = touchPosition.y;

        return result;
    }

    sendRectToServer = function(socket, coords) {
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
            color: cu.rndColor()});
    }
}