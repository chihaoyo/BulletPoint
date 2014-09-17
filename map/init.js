var compareElement = function(source, target) {
	if(source === undefined || source == null) {
		return true;
	}
	else if(source instanceof Element) {
		return source == target;
	}
	else if((typeof source).toLowerCase() == 'string') {
		return $(target).filter(source).length > 0;
	}
};
/*
// ClickDispatcher
// http://bl.ocks.org/tmcw/4067674
var CD = function(el) { // only fire events that is targeted at el (toElement) when el is provided
	var event = d3.dispatch('click', 'dblclick');
	var dispatcher = function(selection) {
		var down,
			tolerance = 5,
			last,
			wait = null;
		// euclidean distance
		var dist = function(a, b) { return Math.sqrt(Math.pow(a[0] - b[0], 2), Math.pow(a[1] - b[1], 2)); };
		selection.on('mousedown', function() {
			down = d3.mouse(document.body);
			last = +new Date();
		});
		selection.on('mouseup', function() {
			if(dist(down, d3.mouse(document.body)) > tolerance) {
				return;
			} else {
				if(wait) {
					window.clearTimeout(wait);
					wait = null;
					//if(el === undefined || el == d3.event.toElement)
					if(compareElement(el, d3.event.toElement))
						event.dblclick(d3.event);
				}
				else {
					wait = window.setTimeout((function(e) {
						return function() {
							//if(el === undefined || el == e.toElement)
							if(compareElement(el, e.toElement))
								event.click(e);
							wait = null;
						};
					})(d3.event), 250);
				}
			}
		});
	};
	return d3.rebind(dispatcher, event, 'on'); // copy event.on onto dispatcher (and more)
};*/

var PARA = {
	userID: '@A2DCFDB5-C277-4AA1-AC53-0904120C4F69',
	staticDSBaseURL: '//50.18.115.212/bulletpoint/api/',
	syncedDSBaseURL: '//resplendent-fire-8362.firebaseio.com/bulletpoint/'
};

var DICT = {
	'MapNodes': {singular: 'Node', plural: 'Nodes'},
	'MapEdges': {singular: 'Edge', plural: 'Edges'}	
};

// DS's
var nodes = new DS('MapNodes', Node, true, true);
var edges = new DS('MapEdges', Edge, true, true);

// handlers for data events
// 'this' is either a Static or a Sync
// 'this.___parent' is a DS
var handlers = {};
handlers.value = function() {
	console.log(this.___parent.id + ' ' + this.storageType + ' value');
	var ds = this.___parent;
	var storageType = this.storageType;
	ds.isReady(storageType, true);
};
handlers.child_added = function(snapshot) {
	console.log(this.___parent.id + ' ' + this.storageType + ' child_added');
	var ds = this.___parent;
	var storageType = this.storageType;
	
	var key = snapshot.name();
	var val = snapshot.val();
	var entity = new ds.LocalDataEntity(storageType, key, val);
	ds.local[key] = entity;
	
	if(ds.isReady()) {
		ds.localArray.push(entity.simplify())
		ForceField.drawAll();
	}
};
handlers.child_changed = function(snapshot) {
	console.log(this.___parent.id + ' ' + this.storageType + ' child_changed');
	var ds = this.___parent;
	var storageType = this.storageType;
	
	var key = snapshot.name();
	var val = snapshot.val();
	ds.local[key].val = val;
	ds.localArray[ds.localArrayIndexOf(key)] = ds.local[key].simplify();
	ds.local[key].redraw(rootCanvas.select('g#' + storageType + '_' + key), DICT[this.___parent.id].singular);
};
handlers.child_removed = function(snapshot) {
	console.log(this.___parent.id + ' ' + this.storageType + ' child_removed');
	var ds = this.___parent;
//	var storageType = this.storageType;
	
	var key = snapshot.name();
	var val = snapshot.val();
	delete ds.local[key];
	
	if(ds.isReady()) {
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
	ENVI.textBoxH = Math.ceil(ENVI.fontSize*2.31);
	
	ENVI.canvasW = Math.ceil(ENVI.docW*0.99);
	ENVI.canvasH = Math.ceil((ENVI.docH - 6*ENVI.fontSize)*0.95); // exclude top & bottom margin: 3em
	
	// locate and set up root canvas
	rootCanvas = d3.select('div#canvas svg');
	rootCanvas.attr('width', ENVI.canvasW).attr('height', ENVI.canvasH);

	rootCanvas.on('click', function() { NodeEdgeEngine.reset(); });
	/*
	var rootCanvasCD = CD('svg'); //$('div#canvas svg')[0]);
		rootCanvasCD.on('click', function(event) { NodeEdgeEngine.reset(); });
		rootCanvasCD.on('dblclick', function(event) { NodeEdgeEngine.createNode(d3.event.x, d3.event.y); });
	rootCanvas.call(rootCanvasCD);*/
//	rootCanvas.on('click', function() { NodeEdgeEngine.reset(); });
//	rootCanvas.on('dblclick', function() { NodeEdgeEngine.createNode(d3.event.x, d3.event.y); });
	
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

	// make addForm functionable
	// Weird thing: $.find does NOT work when finding within a <form>?
	var $addForm = $('#addForm');
	var $addFormNodeType = $addForm.find('[name="nodeType"]');
	$addFormNodeType.change(function(event) {
		var that = $(this);
		that.siblings('.sampleNode').attr('class', 'sampleNode ' + that.val());
	}).change();
	var $addFormSubmit = $addForm.find('[name="submit"]');
	$addFormSubmit.click(function(event) {
		var nodeType = $addFormNodeType.val();
		var nodeName = $addForm.find('[name="nodeName"]').val();
		var nodeData = $addForm.find('[name="nodeData"]').val();
		var nodeStorageType = $addForm.find('select[name="nodeStorageType"]').val();

		if(nodeData == '')
			nodeData = '{}';
		
		if(nodeName != '' && (nodeStorageType == 'sync' || nodeStorageType == 'stat'))
			nodes[nodeStorageType].push({type: nodeType, name: nodeName, data: nodeData});

		event.preventDefault();
	});
};

$window.load(init);