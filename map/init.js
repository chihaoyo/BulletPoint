var PARA = {
	userID: '@A2DCFDB5-C277-4AA1-AC53-0904120C4F69',
	staticDSBaseURL: '//50.18.115.212/bulletpoint/server/',
	syncedDSBaseURL: '//resplendent-fire-8362.firebaseio.com/bulletpoint/'
};

var DICT = {
	'MapNodes': {singular: 'Node', plural: 'Nodes'},
	'MapEdges': {singular: 'Edge', plural: 'Edges'}	
};

// DS's
var nodes = new DS('MapNodes', Node, true, true);
var edges = new DS('MapEdges', Edge, true, true);

// handlers for both nodes and edges
var handlers = {};
handlers.value = function() {
	console.log(this.___parent.id + ' ' + this.type + ' value');
	var ds = this.___parent;
	var type = this.type;
	ds.isReady(type, true);
	
	if(ds.isReady() && !ds.isInitialized()) {
		ds.localArrayMakeover();
		ForceField.drawAll();
		ds.isInitialized(true);
	}
};
handlers.child_added = function(snapshot) {
	console.log(this.___parent.id + ' ' + this.type + ' child_added');
	var ds = this.___parent;
	var type = this.type;
	
	var key = snapshot.name();
	var val = snapshot.val();
	var entity = new ds.LocalDataEntity(type, key, val);
	ds.local[key] = entity;
	
	if(ds.isInitialized()) {
		ds.localArray.push(entity.simplify())
		ForceField.drawAll();
	}
};
handlers.child_changed = function(snapshot) {
	console.log(this.___parent.id + ' ' + this.type + ' child_changed');
	var ds = this.___parent;
//	var type = this.type;
	
	var key = snapshot.name();
	var val = snapshot.val();
	ds.local[key].val = val;
	ds.localArray[ds.localArrayIndexOf(key)] = ds.local[key].simplify();
	ds.local[key].redraw(rootCanvas.select('g#' + key));
};
handlers.child_removed = function(snapshot) {
	console.log(this.___parent.id + ' ' + this.type + ' child_removed');
	var ds = this.___parent;
//	var type = this.type;
	
	var key = snapshot.name();
	var val = snapshot.val();
	delete ds.local[key];
	
	if(ds.isInitialized()) {
		ds.localArray.splice(ds.localArrayIndexOf(key), 1);
		ForceField.drawAll();
	}
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
	rootCanvas.on('click', function() { NodeEdgeEngine.reset(); });
	rootCanvas.on('dblclick', function() { NodeEdgeEngine.createNode(d3.event.x, d3.event.y); });
	
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