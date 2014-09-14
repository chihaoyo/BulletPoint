var Edge = function(storageType, key, val) {
	this.storageType = storageType;
	this.key = key;
	this.val = val;
};
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
Edge.prototype.draw = function(rootElement, className) {
//	console.log('draw Edge ' + this.storageType + ' ' + this.key + ' ' + JSON.stringify(this.val));
	
	rootElement.append('line');
	this.redraw(rootElement, className);
};
Edge.prototype.redraw = function(rootElement, className) {
	rootElement.attr('class', className + ' ' + this.storageType)
};