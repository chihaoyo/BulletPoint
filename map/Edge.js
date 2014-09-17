var Edge = function(storageType, key, val) {
	this.storageType = storageType;
	this.key = key;
	this.val = val;
	this.graphDimensions();
};
Edge.prototype.graphDimensions = function() {
	this.d_ = {};
	this.d_.removeIconSize = ENVI.lineH;
};
Edge.prototype.remove = function(o, i) {
	var key = o.key;
	console.log('remove Edge ' + key);
	
	edges.remove(key);
	d3.event.stopPropagation();
}
Edge.prototype.simplify = function() {
	var p = nodes.localArrayIndexOf(this.val.fromNode);
	var q = nodes.localArrayIndexOf(this.val.toNode);
	if(p === undefined || q === undefined)
		console.error('Nodes not found in localArray');
	var e = {
		key: this.key, 
		source: nodes.localArray[p], 
		target: nodes.localArray[q],
		fixed: false
	};
	return e;
};
Edge.prototype.draw = function(rootElement, className) {	
	rootElement.append('line');

	var label = rootElement.append('g').attr('class', 'label');
	var removeIcon = label.append('g').attr('class', 'removeIcon clickable');
	removeIcon.append('rect').attr('class', 'box').attr('width', this.d_.removeIconSize).attr('height', this.d_.removeIconSize);
	removeIcon.append('line').attr('x1', 0).attr('y1', 0).attr('x2', this.d_.removeIconSize).attr('y2', this.d_.removeIconSize);
	removeIcon.append('line').attr('x1', this.d_.removeIconSize).attr('y1', 0).attr('x2', 0).attr('y2', this.d_.removeIconSize);
	removeIcon.on('click', this.remove);

	this.redraw(rootElement, className);
};
Edge.prototype.redraw = function(rootElement, className) {
	rootElement.attr('class', className + ' ' + this.storageType)
};