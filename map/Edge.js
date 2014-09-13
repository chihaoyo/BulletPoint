var Edge = function(type, key, val) {
	this.type = type;
	this.key = key;
	this.val = val;
};
/*
Edge.prototype.draw = function(rootElement) {
	console.log('draw Edge ' + this.type + ' ' + this.key + ' ' + JSON.stringify(this.val));
	
	var XY1 = nodes.local[this.val.fromNode].XY;
	var XY2 = nodes.local[this.val.toNode].XY;
	rootElement.classed(this.type, true);
	rootElement.append('line').attr('x1', XY1.x).attr('y1', XY1.y).attr('x2', XY2.x).attr('y2', XY2.y);
};*/
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
}
Edge.prototype.draw = function(rootElement) {
//	console.log('draw Edge ' + this.type + ' ' + this.key + ' ' + JSON.stringify(this.val));
	
	rootElement.classed(this.type, true).append('line');
};
Edge.prototype.redraw = function(rootElement) {
};