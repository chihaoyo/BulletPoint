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
	ds.local[key].redraw();
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
	ENVI.letterW = +(ENVI.fontSize*0.62).toFixed(4);
	ENVI.lineH = +(ENVI.fontSize*1.25).toFixed(4);
	
	ENVI.canvasW = +(ENVI.docW*0.99).toFixed();
	ENVI.canvasH = +(ENVI.docH - 6*ENVI.fontSize)*0.95.toFixed(); // exclude top & bottom margin: 3em
	
	// locate and set up root canvas
	rootCanvas = d3.select('div#canvas svg');
	rootCanvas.attr('width', ENVI.canvasW).attr('height', ENVI.canvasH);
	
	// bind event handlers to DS's
	nodes.once('value', handlers.value);//_.bind(handlers.value, nodes));
	nodes.on('child_added', handlers.child_added);//_.bind(handlers.child_added, nodes));
	nodes.on('child_changed', handlers.child_changed);
	nodes.on('child_removed', handlers.child_removed);
	
	// connect DS
	nodes.connect();
//	nodes.sync.push({type: 'article', name: 'http://p.q/r', owner: 'slave', data: JSON.stringify({comment: 'こんにちは'})})
//	nodes.stat.push({type: 'article', name: 'http://a.b/c', owner: 'master', data: JSON.stringify({comment: '中文'})});
};

$window.load(init);