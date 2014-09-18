var Stepper = function(start, stepSize) {
	this.start = start;
	this.now = start;
	this.stepSize = stepSize;
};
Stepper.prototype.step = function() {
	var ___now = this.now;
	this.now += this.stepSize;
	return ___now;
};

var Node = function(storageType, key, val) {
	this.storageType = storageType;
	this.key = key;
	this.val = val;

	this.cssID = this.storageType + '_' + this.key;
	this.graphDimensions();
};
Node.prototype.graphDimensions = function() {
	this.d_ = {};
	this.d_.circleSize = CX.letterW*0.75;
	this.d_.removeIconSize = CX.lineH;
};
/*
Node.prototype.toString = function() { return this.key + ': ' + this.val.name; }
Node.prototype.getWidth = function() { return this.val.name.length*CX.letterW; }; // + 2*CX.letterW; };
Node.prototype.getHeight = function() { return CX.lineH; };*/

// event handler for d3
// 'this' is SVG element that fired the event
// 'that' (o) is this Node
Node.prototype.select = function(o, i) {
	// http://stackoverflow.com/questions/19075381/d3-mouse-events-click-dragend
	if (d3.event.defaultPrevented) return; // distinguish drag and click
	
	var that = o;
	NodeEdgeEngine.registerNode(that.key);
	d3.event.stopPropagation();
};
Node.prototype.edit = function(o, i) {
	NodeEdgeEngine.reset();

	var key = o.key;
	console.log('Edit Node ' + key);

	var node = nodes.local[key];
	var w = CX.textBoxW;
	var h = CX.textBoxH*4;
	var pos = ForceField.constrainToCanvas(o.x, o.y, w, h);
	var editWindow = rootCanvas.classed('editing', true).append('foreignObject')
		.attr('class', 'editWindow')
		.attr('x', pos.x)
		.attr('y', pos.y)
		.attr('width', w)
		.attr('height', h)
		.on('click', function() { d3.event.stopPropagation(); });

	var typeBox = editWindow.append('xhtml:input').attr('type', 'text').attr('value', node.val.type);
	var nameBox = editWindow.append('xhtml:input').attr('type', 'text').attr('value', node.val.name);
	var dataBox = editWindow.append('xhtml:input').attr('type', 'text').attr('value', node.val.data);
	var saveButton = editWindow.append('xhtml:input').attr('type', 'button').attr('value', 'save')
		.on('click', function() {
			var type = typeBox[0][0].value;
			var name = nameBox[0][0].value;
			var data = dataBox[0][0].value;
			nodes.update(key, {type: type, name: name, data: data});
			editWindow.remove();
		});
	var cencelButton = editWindow.append('xhtml:input').attr('type', 'button').attr('value', 'cancel')
		.on('click', function() {
			editWindow.remove();
		});

	d3.event.stopPropagation();
};
Node.prototype.remove = function(o, i) { // remove this node and all edges
	var key = o.key;
	console.log('Remove Node ' + key + ' and all connected edges');

	var edgesToRemove = [];
	for(var x in edges.local) {
		var edge = edges.local[x];
		if(edge.val.fromNode == key || edge.val.toNode == key)
			edgesToRemove.push(x);
	}
	for(var i = 0; i < edgesToRemove.length; i++) {
		edges.remove(edgesToRemove[i]);
	}
	nodes.remove(key);
};
Node.prototype.simplify = function() {
	return {key: this.key, fixed: false};
};
Node.prototype.draw = function(rootElement, className) {
	rootElement.on('click', function() { d3.event.stopPropagation(); });
	rootElement.append('rect').attr('class', 'box');

	var removeIcon = rootElement.append('g').attr('class', 'removeIcon clickable');
	removeIcon.append('rect').attr('class', 'box').attr('width', this.d_.removeIconSize).attr('height', this.d_.removeIconSize);
	removeIcon.append('line').attr('x1', 0).attr('y1', 0).attr('x2', this.d_.removeIconSize).attr('y2', this.d_.removeIconSize);
	removeIcon.append('line').attr('x1', this.d_.removeIconSize).attr('y1', 0).attr('x2', 0).attr('y2', this.d_.removeIconSize);
	removeIcon.on('click', this.remove);

	var center = rootElement.append('g').attr('class', 'center clickable').on('click', this.select);
	center.append('circle').attr('class', 'typeIndicator').attr('r', this.d_.circleSize);
	center.append('circle').attr('class', 'storageTypeIndicator').attr('r', this.d_.circleSize/3.0);
	
	var textYStepper = new Stepper(CX.lineH/4, CX.lineH); // baseline is at around 1/4 of lineH
	var nameTag = rootElement.append('text').attr('class', 'name').attr('x', CX.letterW).attr('y', textYStepper.step()).on('dblclick', this.edit);
	var typeTag = rootElement.append('text').attr('class', 'type').attr('x', CX.letterW).attr('y', textYStepper.step());

	this.redraw(rootElement, className);
};
Node.prototype.redraw = function(rootElement, className) {	
	rootElement.attr('class', className + ' ' + this.storageType + ' ' + this.val.type).attr('id', this.cssID);
	var nameTag = rootElement.select('text.name').text(this.val.name);
	var typeTag = rootElement.select('text.type').text(this.val.type);

	var removeIcon = rootElement.select('g.removeIcon').attr('transform', 'translate(' + [+nameTag.attr('x') + nameTag[0][0].getBBox().width + 2, -this.d_.removeIconSize/2].join(',') + ')');

	var box = rootElement[0][0].getBBox();
	rootElement.select('rect.box').attr('x', -this.d_.circleSize).attr('y', -this.d_.circleSize).attr('width', box.width).attr('height', box.height);
};