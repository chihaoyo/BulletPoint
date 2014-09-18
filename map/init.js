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

var PARA = {
	debug: true,
	userID: '@A2DCFDB5-C277-4AA1-AC53-0904120C4F69',
	staticDSBaseURL: '//50.18.115.212/bulletpoint/api/',
	syncedDSBaseURL: '//resplendent-fire-8362.firebaseio.com/bulletpoint/'
};

var DICT = {
	'MapNodes': {singular: 'Node', plural: 'Nodes'},
	'MapEdges': {singular: 'Edge', plural: 'Edges'},
	'sync': {className: 'Synced'},
	'stat': {className: 'Static'}
};

// DS's
var nodes = new DS('MapNodes', Node, true, true);
var edges = new DS('MapEdges', Edge, true, true);

// handlers for data events
// 'this' is either a Static or a Sync
// 'this.___parent' is a DS
var handlers = {};
handlers.value = function() {
//	console.log(this.___parent.id + ' ' + this.storageType + ' value');
	console.log('DS.' + DICT[this.storageType].className + '.value ' + this.___parent.id);
	var ds = this.___parent;
	var storageType = this.storageType;
	ds.isReady(storageType, true);
};
handlers.child_added = function(snapshot) {
//	console.log(this.___parent.id + ' ' + this.storageType + ' child_added');
	console.log('DS.' + DICT[this.storageType].className + '.child_added ' + this.___parent.id);
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
//	console.log(this.___parent.id + ' ' + this.storageType + ' child_changed');
	console.log('DS.' + DICT[this.storageType].className + '.child_changed ' + this.___parent.id);
	var ds = this.___parent;
	var storageType = this.storageType;
	
	var key = snapshot.name();
	var val = snapshot.val();

	var className = DICT[this.___parent.id].singular;
	var entity = ds.local[key];
	entity.val = val;
	ds.localArray[ds.localArrayIndexOf(key)] = entity.simplify();
	ds.local[key].redraw(rootCanvas.select('g.' + className + '#' + entity.cssID), className);
};
handlers.child_removed = function(snapshot) {
//	console.log(this.___parent.id + ' ' + this.storageType + ' child_removed');
	console.log('DS.' + DICT[this.storageType].className + '.child_removed ' + this.___parent.id);
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

var CX = {};

var $window = $(window);
var $document = $(document);
var $controls, $addForm, $uiForm;

var rootCanvas = null;

var init = function() {
	$controls = $('#controls');
	$addForm = $controls.find('#addForm');
	$uiForm = $controls.find('#uiForm');

	// scope environment
	CX.docW = $window.width();
	CX.docH = $window.height();
	
	CX.fontSize = 11.0;
	CX.letterW = Math.ceil(CX.fontSize*0.62);
	CX.lineH = Math.ceil(CX.fontSize*1.25);
	CX.textBoxW = Math.ceil(CX.fontSize*16.1); // 15em + 1.1
	CX.textBoxH = Math.ceil(CX.fontSize*2.31);
	
	CX.canvasW = CX.docW; //Math.ceil(CX.docW*0.99);
	CX.canvasH = CX.docH - $controls.outerHeight(); //Math.ceil((CX.docH - 6*CX.fontSize)*0.95); // exclude top & bottom margin: 3em
	
	// locate and set up root canvas
	rootCanvas = d3.select('div#canvas svg');
	rootCanvas
		.attr('width', CX.canvasW).attr('height', CX.canvasH)
		.on('click', function() { NodeEdgeEngine.reset(); });
	
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
	var $addNodeType = $addForm.find('[name="nodeType"]');
	var $addNodeName = $addForm.find('[name="nodeName"]');
	var $addNodeData = $addForm.find('[name="nodeData"]');
	var $addNodeStorageType = $addForm.find('select[name="nodeStorageType"]');

	$addNodeType.change(function(event) {
		var that = $(this);
		that.siblings('.sampleNode').attr('class', 'sampleNode ' + that.val());
	}).change();

	var $addSubmit = $addForm.find('[name="submit"]');
	$addSubmit.click(function(event) {
		var nodeType = $addNodeType.val();
		var nodeName = $addNodeName.val().trim();
		var nodeData = $addNodeData.val().trim();
		var nodeStorageType = $addNodeStorageType.val();

		// validation
		if(nodeName == '' || ['sync', 'stat'].indexOf(nodeStorageType) == -1)
			return;

		var nodeOwner = PARA.userID;
//		console.log(nodeType + ' ' + nodeName + ' ' + nodeData + ' ' + nodeStorageType + ' ' + nodeOwner);
		
		// set data
		var dictionary = {type: nodeType, name: nodeName, data: nodeData};
		if(nodeData == '') nodeData = '{}';
		if(nodeStorageType == 'stat') dictionary.owner = nodeOwner;

		// push
		nodes[nodeStorageType].push(dictionary);

		// reset
		$addNodeName.val('');
		$addNodeData.val('');

		event.preventDefault();
	});

	$uiForm.find('[name="submit"]').click(function(event) {
		var charge = $uiForm.find('[name="charge"]').val();
		var friction = $uiForm.find('[name="friction"]').val();
		ForceField.field.charge(charge).friction(friction).start();
	});
};

$window.load(init);