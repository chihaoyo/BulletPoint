var Node = function(storageType, key, val) {
	this.storageType = storageType;
	this.key = key;
	this.val = val;
};
Node.prototype.toString = function() { return this.key + ': ' + this.val.name; }
Node.prototype.getWidth = function() { return this.toString().length*ENVI.letterW + 2*ENVI.letterW; };
Node.prototype.getHeight = function() { return ENVI.lineH; };

// event handler for d3
// 'this' is SVG element that fired the event
// 'that' (o) is this Node
Node.prototype.clicked = function(o, i) {
	// http://stackoverflow.com/questions/19075381/d3-mouse-events-click-dragend
	if (d3.event.defaultPrevented) return; // distinguish drag and click
	
	var that = o;
	var rootElement = rootCanvas.select('g#' + that.storageType + '_' + that.key);
//	rootElement.classed('selected', true);
	NodeEdgeEngine.registerNode(that.key);
	d3.event.stopPropagation();
};
Node.prototype.simplify = function() {
	return {key: this.key, fixed: false};
};
Node.prototype.draw = function(rootElement, className) {
//	console.log('draw Node ' + this.storageType + ' ' + this.key + ' ' + JSON.stringify(this.val));
	
	rootElement.append('circle').attr('class', 'center').attr('r', ENVI.letterW*0.75).on('click', this.clicked);
	rootElement.append('text').attr('class', 'name').attr('x', ENVI.letterW).attr('y', ENVI.lineH/4); // baseline is at around 1/4 of lineH
	this.redraw(rootElement, className);
};
Node.prototype.redraw = function(rootElement, className) {
//	console.log('redraw Node ' + this.storageType + ' ' + this.key + ' ' + JSON.stringify(this.val));
	
	rootElement.attr('class', className + ' ' + this.storageType + ' ' + this.val.type).attr('id', this.storageType + '_' + this.key);
	rootElement.select('text.name').text(this.val.name);
};