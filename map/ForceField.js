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
	console.log('ForceField.diagnosis begin');

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

	console.log('ForceField.diagnosis complete');
};
// http://bl.ocks.org/mbostock/4062045
// http://bl.ocks.org/mbostock/1095795
// http://bl.ocks.org/mbostock/3750558
ForceField.init = function() {
	console.log('ForceField.init');

	var fieldCharge = -600;
	var fieldFriction = 0.8;

	this.field = d3.layout.force()
		.nodes(nodes.localArray)
		.links(edges.localArray)
		.charge(fieldCharge)
		.friction(fieldFriction)
		.linkDistance(function(edge) { return 105; }) // linkDistance can depend on each edge
		.size([CX.canvasW - 50, CX.canvasH - 50])
		.on('tick', function(event) {
			nodes.___entities.attr('transform', function(o) {
				// bounding box with canvasW and canvasH
				// http://stackoverflow.com/questions/9573178/d3-force-directed-layout-with-bounding-box
				// http://mbostock.github.io/d3/talk/20110921/bounding.html
				//var x = Math.max(0, Math.min(o.x, CX.canvasW));
				//var y = Math.max(0, Math.min(o.y, CX.canvasH));
				var pos = ForceField.constrainToCanvas(o.x, o.y, 0, 0);
				o.x = pos.x;
				o.y = pos.y;
				return 'translate(' + [pos.x, pos.y].join(',') + ')';
			});
			edges.___entities.select('line')
				.attr('x1', function(o) { return o.source.x; })
				.attr('y1', function(o) { return o.source.y; })
				.attr('x2', function(o) { return o.target.x; })
				.attr('y2', function(o) { return o.target.y; });
			edges.___entities.select('.removeIcon').attr('transform', function(o) { return 'translate(' + [(o.source.x + o.target.x - this.getBBox().width)/2.0, (o.source.y + o.target.y - this.getBBox().height)/2.0].join(',') + ')'; });
			edges.___entities.select('.name').attr('transform', function(o) {
				var cx = (o.source.x + o.target.x)/2.0;
				var cy = (o.source.y + o.target.y)/2.0;
				var dy = o.target.y - o.source.y;
				var dx = o.target.x - o.source.x;
				var d = Math.atan(dy/dx)*360/Math.PI/2.0; // Math.atan gives radians and svg transform takes degrees
				return ['translate(' + [cx, cy].join(',') + ')', 'rotate(' + d + ')', 'translate(0, -6)'].join(' ');
			});
		});
	
	this.drag = this.field.drag()
		.origin(function(o) { return o; })
		.on('dragstart', function(o) {
			o.dragged = true;
			//o.fixed = true;
		})
		.on('dragend', function(o) {
			o.dragged = false;
		});

	$uiForm.find('[name="charge"]').val(fieldCharge);
	$uiForm.find('[name="friction"]').val(fieldFriction);
};
ForceField.drawAll = function() {
	console.log('ForceField.drawAll');
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
ForceField.constrainToCanvas = function(x, y, w, h) {
	var margin = {};
	margin.top = 50;
	margin.bottom = 25;
	margin.left = 25;
	margin.right = 25;

	x = Math.max(margin.left, Math.min(x, CX.canvasW - w - margin.right));
	y = Math.max(margin.top, Math.min(y, CX.canvasH - h - margin.bottom));

	return {x: x, y: y};
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
	console.log('NodeEdgeEngine.reset');
	if(this.A != null)
		rootCanvas.select('g.Node#' + nodes.local[this.A].cssID).classed('selected', false);
	if(this.B != null)
		rootCanvas.select('g.Node#' + nodes.local[this.B].cssID).classed('selected', false);
	this.A = null;
	this.B = null;
};
NodeEdgeEngine.createNode = function(x, y) {
	console.log('NodeEdgeEngine.createNode' + x + ' ' + y);
	// create new node at (x, y)
	// if A is non-null then create new edge (A->new node)
};
NodeEdgeEngine.registerNode = function(id) { // node (id) is clicked
	console.log('NodeEdgeEngine.registerNode' + id);
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