// Toolkit for drawing UI
var TK = {};
TK.rand = function() {
	return Math.random()*2-1;//((Math.random()*2-1) + (Math.random()*2-1) + (Math.random()*2-1))/3.0;
};
TK.map = function(v, p, q, s, t) {
	return  (v - p)/(q - p)*(t - s) + s;
};
TK.coorXY = function(p, q) {
	return {x: Math.ceil((p*ENVI.canvasW + ENVI.canvasW)/2.0), y: Math.ceil((q*ENVI.canvasH + ENVI.canvasH)/2.0)};
};
TK.coorPQ = function(x, y) {
	return {p: (x - ENVI.canvasW/2.0)/ENVI.canvasW*2.0, q: (y - ENVI.canvasH/2.0)/ENVI.canvasH*2.0};
};

var Node = function(type, key, val) {
	this.type = type;
	this.key = key;
	this.val = val;
};
Node.prototype.toString = function() { return this.key + ': ' + this.val.name; }
Node.prototype.getWidth = function() { return this.toString().length*ENVI.letterW + 2*ENVI.letterW; };
Node.prototype.getHeight = function() { return ENVI.lineH; };

// event handler for d3
// this would be SVG element that fired the event
Node.prototype.clicked = function(o, i) {
	var that = o;
	var rootElement = rootCanvas.select('g#' + that.type + '_' + that.key);
//	rootElement.classed('selected', true);
	engine.registerNode(that.key);
	d3.event.stopPropagation();
}

Node.prototype.draw = function(rootElement) {
	console.log('draw Node ' + this.type + ' ' + this.key + ' ' + JSON.stringify(this.val));
	
	var PQ = {p: TK.map(TK.rand(), -1.0, 1.0, -0.9, 0.9), q: TK.map(TK.rand(), -1.0, 1.0, -0.9, 0.9)};
	var XY = TK.coorXY(PQ.p, PQ.q);
	
	rootElement.classed(this.type + ' ' + this.val.type, true).attr('id', this.type + '_' + this.key).attr('transform', 'translate(' + XY.x + ',' + XY.y + ')');
	rootElement.append('circle').attr('class', 'center').attr('r', ENVI.letterW*0.75).on('click', this.clicked);
	rootElement.append('text').attr('x', ENVI.letterW).attr('y', ENVI.lineH/4).text(this.toString());
	
	this.XY = XY;
};
Node.prototype.redraw = function(rootElement) {
	console.log('redraw Node ' + this.type + ' ' + this.key + ' ' + JSON.stringify(this.val));
	
	rootElement.select('text').text(this.toString());
};