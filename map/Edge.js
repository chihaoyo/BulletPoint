var Edge = function(type, key, val) {
	this.type = type;
	this.key = key;
	this.val = val;
};
Edge.prototype.draw = function(rootElement) {
	console.log('draw Edge ' + this.type + ' ' + this.key + ' ' + JSON.stringify(this.val));
	
	var XY1 = nodes.local[this.val.fromNode].XY;
	var XY2 = nodes.local[this.val.toNode].XY;
	rootElement.classed(this.type, true);
	rootElement.append('line').attr('x1', XY1.x).attr('y1', XY1.y).attr('x2', XY2.x).attr('y2', XY2.y);
};
Edge.prototype.redraw = function(rootElement) {
};

// NodeEdgeEngine handles creating Nodes and Edges in UI
// singleton!
var NodeEdgeEngine = function() {
	this.last = null;
};
NodeEdgeEngine.prototype.reset = function() {
	console.log('NodeEdgeEngine: reset');
	this.last = null;
};
NodeEdgeEngine.prototype.createNode = function(x, y) {
	console.log('NodeEdgeEngine: createNode');
	// create new node at (x, y)
	// if last is non-null then create new edge (last->new node)
};
NodeEdgeEngine.prototype.registerNode = function(id) { // node (id) is clicked
	console.log('NodeEdgeEngine: registerNode');
	if(this.last == null)
		this.last = id;
	else {
		// create new edge (this.last->id)
		// new edge is static if any of the two nodes are static
		var type = 'sync';
		var dictionary = {type: 'nondir', name: 'unnamed', fromNode: this.last, toNode: id, data: '{}'};
		if(nodes.local[this.last].type == 'stat' || nodes.local[id].type == 'stat') {
			type = 'stat'
			dictionary.owner = PARA.userID;
		}
			
		// push!
		edges[type].push(dictionary);
		this.last = null;
	}
};