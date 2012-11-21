function Shape (id, x0, y0, x1, y1, dx, dy, ellipseOrigo, radius, form, color) {
    this.id = id;
    this.x0 = x0;
    this.y0 = y0;
    this.x1 = x1;
    this.y1 = y1;
    this.dx = x1 - x0;
    this.dy = y1 - y0;
    this.ellipseOrigo = {x: '', y: ''};
    this.radius = radius;
    this.form = form;
    this.color = color;
    this.calcDelta = calcDelta;
    this.calcEllipseOrigo = calcEllipseOrigo;

    function calcDelta() {
        this.dx = this.x1 - this.x0; 
        this.dy = this.y1 - this.y0; 
        
    };
    
    function calcEllipseOrigo() {
        this.ellipseOrigo.x = this.x0 + (this.dx / 2);
        this.ellipseOrigo.y = this.y0 + (this.dy / 2);
        
    };
};

