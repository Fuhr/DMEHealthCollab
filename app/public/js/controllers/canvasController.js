function canvasController(parentDiv, socket) {
    
    /* Init modules and variables */
    var cu = new canvasUtils();
    var shape = new Shape();
    var indicatorData = new IndicatorData();
    var indicatorShape, mouseDown;
    var color = '#000'
    var drawFunctions = {'rect': cu.drawRect, 'ellipse': cu.drawEllipse, 'circle': cu.drawCircle};
    var indicFunctions = {'rect': cu.drawIndicatorRect, 'ellipse': cu.drawIndicatorEllipse, 'circle': cu.drawIndicatorCircle};
    var _clientId = '';
    var shapeNumber = 0;
    
    var stage = cu.createStage(parentDiv, '700', '525');
    var layer = cu.createLayer(stage);
    var canvas = stage.getContainer();   
    var _draggable = true;
    
    
    /* Event handlers */ 
    canvas.addEventListener('mousedown' , function(evt) {      
        if (isDraggable()) return;
        
        mouseDown = true;
        
        var pos = getMousePositionOnCanvas(evt);       
        indicatorShape = indicFunctions[shape.form](layer, pos, color);
        
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
            
            updateIndicatorShape(pos);  
        }
    });

    canvas.addEventListener('mouseup', function(evt) {  
        if (isDraggable()) return;
                
        mouseDown = false;
        var pos = getMousePositionOnCanvas(evt);
        shape.x1 = pos.x;
        shape.y1 = pos.y;
        
        sendShapeToServer(socket, shape);
    });

    canvas.addEventListener('touchstart', function(evt) {  
        if (isDraggable()) return;      
        
        var pos = getTouchPositionOnCanvas(evt);       
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
        updateIndicatorShape(pos);
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

        socket.on('clientId', function (data) {
            _clientId = data;
        });

        socket.on('getShapesOnConnect', function (data) {
            // try{
            for (var i = 0; i < data.length; i++) {

                var node = Kinetic.Node.create(JSON.stringify(data[i]));

                if (node.shapeType === 'Circle' || 'Ellipse') {
                    node.attrs.radius = data[i].attrs.radius;
                }
                cu.addNode(node);
                layer.add(node);
                layer.draw();

                setUpNodeHandlers(node, socket);
            }
            // }catch(error) {
            //                console.log(error);
            //            }
            if (_draggable) {
                setDraggable(_draggable);
            }

        });

        socket.on('drawShape', function (data) {

            var node = drawFunctions[data.form](layer, data);
            if (_draggable) {
                setDraggable(_draggable);
            }
            setUpNodeHandlers(node, socket);
        });
        socket.on('shapeMoved', function (data) {
            cu.moveNode(layer, data);
        });

        socket.on('changeBackground', function (data) {
            var element = canvas.firstChild.firstChild;
            element.style['background-image'] = "url('" + data + "')";
        });
    });


    /*--------------------------------------*/
    
    this.updateColor = function (data) {
      color = data;
    };
    
    this.setActiveShape = function (type) {
          shape.form = type;
          setDraggable(false);
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
            var positionChange = {
                id: event.shape.attrs.id,
                x: pos.x,
                y: pos.y
            };
            var sendObject = {
                position: positionChange,
                eventShape: event.shape
                };
            socket.emit('shapeMove',sendObject);
        });
    };
    
    updateIndicatorShape = function(pos) {
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
    };
    
    
    sendShapeToServer = function(socket, shape) {
        
    
        shape.id = _clientId + shapeNumber;
        shapeNumber++;
        shape.calcDelta();
        shape.color = color;
        
        
        if (shape.form === 'ellipse' || shape.form === 'circle') {
            shape.calcEllipseOrigo();
        }
        adx = Math.abs(shape.dx);
        ady = Math.abs(shape.dy);

        var serverShape = indicatorShape;
        serverShape.attrs.stroke = color;
        serverShape.attrs.opacity = 1;
        
        indicatorShape.remove();
        layer.draw();

        if(adx <= 25 && ady <= 25 || adx <= 25 || ady <= 25) {
            return;
        }

        socket.emit('shapeDrawn', {'clientShape':shape,'serverShape':serverShape});
    };

    this.addImageToBackground = function (url) {
        socket.emit('backgroundImage', url);
    };
};