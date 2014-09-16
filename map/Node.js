var Stepper = function(start, stepSize) {
	this.start = start;
	this.now = start;
	this.stepSize = stepSize;
};
Stepper.prototype.step = function() {
	var ___now = this.now;
	this.now += this.stepSize;
	return ___now;
};

var Node = function(storageType, key, val) {
	this.storageType = storageType;
	this.key = key;
	this.val = val;
	this.graphDimensions();
};
Node.prototype.graphDimensions = function() {
	this.d_ = {};
	this.d_.circleSize = ENVI.letterW*0.75;
	this.d_.removeIconSize = ENVI.lineH;
};
/*
Node.prototype.toString = function() { return this.key + ': ' + this.val.name; }
Node.prototype.getWidth = function() { return this.val.name.length*ENVI.letterW; }; // + 2*ENVI.letterW; };
Node.prototype.getHeight = function() { return ENVI.lineH; };*/

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
Node.prototype.remove = function(o, i) { // remove this node and all edges
	var key = o.key;
	console.log('remove node ' + key + ' and all connected edges');
};
Node.prototype.simplify = function() {
	return {key: this.key, fixed: false};
};
Node.prototype.draw = function(rootElement, className) {
//	console.log('draw Node ' + this.storageType + ' ' + this.key + ' ' + JSON.stringify(this.val));
	rootElement.append('rect').attr('class', 'box');

	var removeIcon = rootElement.append('g').attr('class', 'removeIcon');
	removeIcon.append('rect').attr('class', 'box').attr('width', this.d_.removeIconSize).attr('height', this.d_.removeIconSize);
	removeIcon.append('line').attr('x1', 0).attr('y1', 0).attr('x2', this.d_.removeIconSize).attr('y2', this.d_.removeIconSize);
	removeIcon.append('line').attr('x1', this.d_.removeIconSize).attr('y1', 0).attr('x2', 0).attr('y2', this.d_.removeIconSize);
	removeIcon.on('click', this.remove);
	
	rootElement.append('circle').attr('class', 'center').attr('r', this.d_.circleSize).on('click', this.clicked);
	
	var textYStepper = new Stepper(ENVI.lineH/4, ENVI.lineH); // baseline is at around 1/4 of lineH
	rootElement.append('text').attr('class', 'name').attr('x', ENVI.letterW).attr('y', textYStepper.step());
	rootElement.append('text').attr('class', 'type').attr('x', ENVI.letterW).attr('y', textYStepper.step());
	this.redraw(rootElement, className);
};
Node.prototype.redraw = function(rootElement, className) {
//	console.log('redraw Node ' + this.storageType + ' ' + this.key + ' ' + JSON.stringify(this.val));
	
	rootElement.attr('class', className + ' ' + this.storageType + ' ' + this.val.type).attr('id', this.storageType + '_' + this.key);
	var nameTag = rootElement.select('text.name').text(this.val.name);
	var typeTag = rootElement.select('text.type').text(this.val.type);

	var removeIcon = rootElement.select('g.removeIcon').attr('transform', 'translate(' + [+nameTag.attr('x') + nameTag[0][0].getBBox().width + 2, -this.d_.removeIconSize/2].join(',') + ')');

	var box = rootElement[0][0].getBBox();
	rootElement.select('rect.box').attr('x', -this.d_.circleSize).attr('y', -this.d_.circleSize).attr('width', box.width).attr('height', box.height);
};