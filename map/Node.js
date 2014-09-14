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
	// http://stackoverflow.com/questions/19075381/d3-mouse-events-click-dragend
	if (d3.event.defaultPrevented) return; // distinguish drag and click
	
	var that = o;
	var rootElement = rootCanvas.select('g#' + that.type + '_' + that.key);
//	rootElement.classed('selected', true);
	NodeEdgeEngine.registerNode(that.key);
	d3.event.stopPropagation();
};
/*
Node.prototype.draw = function(rootElement) {
	console.log('draw Node ' + this.type + ' ' + this.key + ' ' + JSON.stringify(this.val));
	
	var PQ = {p: TK.map(TK.rand(), -1.0, 1.0, -0.9, 0.9), q: TK.map(TK.rand(), -1.0, 1.0, -0.9, 0.9)};
	var XY = TK.coorXY(PQ.p, PQ.q);
	
	rootElement.classed(this.type + ' ' + this.val.type, true).attr('id', this.type + '_' + this.key).attr('transform', 'translate(' + XY.x + ',' + XY.y + ')');
	rootElement.append('circle').attr('class', 'center').attr('r', ENVI.letterW*0.75).on('click', this.clicked);
	rootElement.append('text').attr('x', ENVI.letterW).attr('y', ENVI.lineH/4).text(this.toString());
	
	this.XY = XY;
};*/
Node.prototype.simplify = function() {
	return {key: this.key, fixed: false};
};
Node.prototype.draw = function(rootElement, className) {
//	console.log('draw Node ' + this.type + ' ' + this.key + ' ' + JSON.stringify(this.val));
	
	rootElement.append('circle').attr('class', 'center').attr('r', ENVI.letterW*0.75).on('click', this.clicked);
	rootElement.append('text').attr('x', ENVI.letterW).attr('y', ENVI.lineH/4);
	this.redraw(rootElement, className);
	/*
	rootElement.attr('class', className + ' ' + this.type + ' ' + this.val.type).attr('id', this.type + '_' + this.key);
	rootElement.append('circle').attr('class', 'center').attr('r', ENVI.letterW*0.75).on('click', this.clicked);
	rootElement.append('text').attr('x', ENVI.letterW).attr('y', ENVI.lineH/4).text(this.toString());*/
};
Node.prototype.redraw = function(rootElement, className) {
//	console.log('redraw Node ' + this.type + ' ' + this.key + ' ' + JSON.stringify(this.val));
	
	rootElement.attr('class', className + ' ' + this.type + ' ' + this.val.type).attr('id', this.type + '_' + this.key);
	rootElement.select('text').text(this.toString());
};