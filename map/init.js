var DICT = {
	'MapNodes': {singular: 'Node', plural: 'Nodes'},
	'MapEdges': {singular: 'Edge', plural: 'Edges'}	
};

var engine = new NodeEdgeEngine();

// DS's
var nodes = new DS('MapNodes', Node, true, true);
var edges = new DS('MapEdges', Edge, true, true);

// handlers for both nodes and edges
var handlers = {};
handlers.value = function() {
	console.log(this.___parent.id + ' ' + this.type + ' value');
	var ds = this.___parent;
	var type = this.type;
	ds.flags.ready[type] = true;
	
	if(ds.isConnected() && ds.flags.initialized == false) {
		ds.drawAll();
		ds.flags.initialized = true;
	}
};
handlers.child_added = function(snapshot) {
	console.log(this.___parent.id + ' ' + this.type + ' child_added');
	var ds = this.___parent;
	var type = this.type;
	
	var key = snapshot.name();
	var val = snapshot.val();
	ds.local[key] = new ds.LocalDataEntity(type, key, val);
	if(ds.flags.initialized)
		ds.drawAll();
};
handlers.child_changed = function(snapshot) {
	console.log(this.___parent.id + ' ' + this.type + ' child_changed');
	var ds = this.___parent;
//	var type = this.type;
	
	var key = snapshot.name();
	var val = snapshot.val();
	ds.local[key].val = val;
	ds.local[key].redraw(rootCanvas.select('g#' + key));
};
handlers.child_removed = function(snapshot) {
	console.log(this.___parent.id + ' ' + this.type + ' child_removed');
	var ds = this.___parent;
//	var type = this.type;
	
	var key = snapshot.name();
	var val = snapshot.val();
	delete ds.local[key];
	
	if(ds.flags.initialized)
		ds.drawAll();
};

var ENVI = {};

var $window = $(window);
var $document = $(document);

var rootCanvas = null;

var init = function() {
	// scope environment
	ENVI.docW = $document.width();
	ENVI.docH = $document.height();
	
	ENVI.fontSize = 13.0;
	ENVI.letterW = Math.ceil(ENVI.fontSize*0.62);
	ENVI.lineH = Math.ceil(ENVI.fontSize*1.25);
	
	ENVI.canvasW = Math.ceil(ENVI.docW*0.99);
	ENVI.canvasH = Math.ceil((ENVI.docH - 6*ENVI.fontSize)*0.95); // exclude top & bottom margin: 3em
	
	// locate and set up root canvas
	rootCanvas = d3.select('div#canvas svg');
	rootCanvas.attr('width', ENVI.canvasW).attr('height', ENVI.canvasH);
	rootCanvas.on('click', function() { engine.reset(); });
	rootCanvas.on('dblclick', function() { engine.createNode(d3.event.x, d3.event.y); });
	
	// bind event handlers to DS's
	nodes.once('value', handlers.value);
	nodes.on('child_added', handlers.child_added);
	nodes.on('child_changed', handlers.child_changed);
	nodes.on('child_removed', handlers.child_removed);
	
	edges.once('value', handlers.value);
	edges.on('child_added', handlers.child_added);
	edges.on('child_changed', handlers.child_changed);
	edges.on('child_removed', handlers.child_removed);
	
	// connect DS
	nodes.connect();
	edges.connect();
//	nodes.sync.push({type: 'article', name: 'http://p.q/r', owner: 'slave', data: JSON.stringify({comment: 'こんにちは'})})
//	nodes.stat.push({type: 'article', name: 'http://a.b/c', owner: 'master', data: JSON.stringify({comment: '中文'})});
};

$window.load(init);