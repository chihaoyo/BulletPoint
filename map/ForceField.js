// Toolkit for drawing UI
var TK = {};
TK.rand = function() {
	return Math.random()*2-1;//((Math.random()*2-1) + (Math.random()*2-1) + (Math.random()*2-1))/3.0;
};
TK.map = function(v, p, q, s, t) {
	return  (v - p)/(q - p)*(t - s) + s;
};
TK.coorXY = function(p, q) {
	return {x: Math.ceil((p*CX.canvasW + CX.canvasW)/2.0), y: Math.ceil((q*CX.canvasH + CX.canvasH)/2.0)};
};
TK.coorPQ = function(x, y) {
	return {p: (x - CX.canvasW/2.0)/CX.canvasW*2.0, q: (y - CX.canvasH/2.0)/CX.canvasH*2.0};
};

// ForceField lays out nodes and link
// singleton!
var ForceField = {
	field: null,
	drag: null, 
	flags: {initialized: false, ready: {nodes: false, edges: false}}
};
ForceField.isReady = function(whichOne, val) {
	if(whichOne === undefined && val === undefined)
		return this.flags.ready.nodes && this.flags.ready.edges;
	else if(val === undefined)
		return this.flags.ready[whichOne];
	else {
		this.flags.ready[whichOne] = val;
		if(this.isReady()) {
			nodes.localArrayInit();
			edges.localArrayInit();
			this.drawAll();
		}
		
		return val;
	}
};
ForceField.diagnosis = function() {
	console.log('diagnosis start');

	var edgesToRemove = [];
	for(var x in edges.local) {
		var edge = edges.local[x];
		var terminals = [edge.val.fromNode, edge.val.toNode];
		for(var i = 0; i < terminals.length; i++) {
			var nodeID = terminals[i];
			if(nodes.local[nodeID] === undefined) {
				console.log('Node ' + nodeID + ' not found');
				edgesToRemove.push(x);
			}
		}
	}
	for(var i = 0; i < edgesToRemove.length; i++)
		edges.remove(edgesToRemove[i]);

	console.log('diagnosis complete');
};
// http://bl.ocks.org/mbostock/4062045
// http://bl.ocks.org/mbostock/1095795
// http://bl.ocks.org/mbostock/3750558
ForceField.init = function() {
	this.field = d3.layout.force()
		.nodes(nodes.localArray)
		.links(edges.localArray)
		.charge(-1000)
		.linkDistance(function(edge) { return 100; }) // linkDistance can depend on each edge
		.size([CX.canvasW, CX.canvasH])
		.on('tick', function(event) {
			nodes.___entities.attr('transform', function(o) { return 'translate(' + [o.x, o.y].join(',') + ')'; });
			edges.___entities.select('line')
				.attr('x1', function(o) { return o.source.x; })
				.attr('y1', function(o) { return o.source.y; })
				.attr('x2', function(o) { return o.target.x; })
				.attr('y2', function(o) { return o.target.y; });
			edges.___entities.select('g.label').attr('transform', function(o) { return 'translate(' + [(o.source.x + o.target.x - this.getBBox().width)/2.0, (o.source.y + o.target.y - this.getBBox().height)/2.0].join(',') + ')'; });
		});
	
	this.drag = this.field.drag()
		.origin(function(o) { return o; })
		.on('dragstart', function(o) {
			o.dragged = true;
//			o.fixed = true;
		})
		.on('dragend', function(o) {
			o.dragged = false;
		});
};
ForceField.drawAll = function() {
	console.log('ForceField drawAll');
	this.diagnosis();

	nodes.drawAll();
	edges.drawAll();
	
	if(!this.flags.initialized) {
		this.init();
		this.flags.initialized = true;
	}
	nodes.___entities.call(this.drag);
	
	this.field.start();
};


// NodeEdgeEngine handles creating Nodes and Edges in UI
// singleton!
var NodeEdgeEngine = {A: null, B: null};
NodeEdgeEngine.edgeExists = function(p, q, type) {
	for(var x in edges.local) {
		var edge = edges.local[x];
		var flag = false;
		if(edge.val.type == type) {
			if(['nondir', 'bidir'].indexOf(type) != -1)
				flag = _.difference([edge.val.fromNode, edge.val.toNode], [p, q]).length == 0
			else
				flag = edge.val.fromNode == p && edge.val.toNode == q;
		}
		return flag;
	}
};
NodeEdgeEngine.reset = function() {
	console.log('NodeEdgeEngine: reset');
	if(this.A != null)
		rootCanvas.select('g.Node#' + nodes.local[this.A].cssID).classed('selected', false);
	if(this.B != null)
		rootCanvas.select('g.Node#' + nodes.local[this.B].cssID).classed('selected', false);
	this.A = null;
};
NodeEdgeEngine.createNode = function(x, y) {
	console.log('NodeEdgeEngine: createNode');
	// create new node at (x, y)
	// if A is non-null then create new edge (A->new node)
};
NodeEdgeEngine.registerNode = function(id) { // node (id) is clicked
	console.log('NodeEdgeEngine: registerNode ' + id);
	if(this.A == null) {
		this.A = id;
		rootCanvas.select('g.Node#' + nodes.local[this.A].cssID).classed('selected', true);
	}
	else {
		if(this.A != id) {
			this.B = id;
			// create new edge (this.A->this.B)
			// new edge is static if any of the two nodes are static
			var storageType = 'sync';
			var dictionary = {type: 'nondir', name: 'unnamed', fromNode: this.A, toNode: this.B, data: '{}'};
			if(nodes.local[this.A].storageType == 'stat' || nodes.local[this.B].storageType == 'stat') {
				storageType = 'stat'
				dictionary.owner = PARA.userID;
			}
			// push!
			if(!this.edgeExists(dictionary.fromNode, dictionary.toNode, dictionary.type))
				edges[storageType].push(dictionary);
		}
		this.reset();
	}
};