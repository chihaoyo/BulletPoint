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
ForceField.init = function() {
	this.field = d3.layout.force()
		.nodes(nodes.localArray)
		.links(edges.localArray)
		.charge(-1000)
		.linkDistance(100)
		.size([ENVI.canvasW, ENVI.canvasH])
		.on('tick', function() {
			nodes.___entities.attr('transform', function(o) { return 'translate(' + [o.x, o.y].join(',') + ')'; });
			edges.___entities.select('line')
				.attr('x1', function(o) { return o.source.x; })
				.attr('y1', function(o) { return o.source.y; })
				.attr('x2', function(o) { return o.target.x; })
				.attr('y2', function(o) { return o.target.y; });
		});
	
	this.drag = this.field.drag()
		.on('dragstart', function(o) {
			//d3.select(this).classed('fixed', o.fixed = true);
			o.dragged = true;
			o.fixed = true;
		})
		.on('dragend', function(o) {
			o.dragged = false;
		});
	nodes.___entities.call(this.drag);
};
ForceField.drawAll = function() {
	console.log('ForceField drawAll');
	nodes.drawAll();
	edges.drawAll();
	
	if(!this.flags.initialized) {
		this.init();
		this.flags.initialized = true;
	}
	this.field.start();
};


// NodeEdgeEngine handles creating Nodes and Edges in UI
// singleton!
var NodeEdgeEngine = {last: null};
NodeEdgeEngine.reset = function() {
	console.log('NodeEdgeEngine: reset');
	this.last = null;
};
NodeEdgeEngine.createNode = function(x, y) {
	console.log('NodeEdgeEngine: createNode');
	// create new node at (x, y)
	// if last is non-null then create new edge (last->new node)
};
NodeEdgeEngine.registerNode = function(id) { // node (id) is clicked
	console.log('NodeEdgeEngine: registerNode');
	if(this.last == null)
		this.last = id;
	else {
		if(this.last != id) {
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
	}
};