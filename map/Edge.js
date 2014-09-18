var Edge = function(storageType, key, val) {
	this.storageType = storageType;
	this.key = key;
	this.val = val;

	this.cssID = this.storageType + '_' + this.key;
	this.graphDimensions();
};
Edge.prototype.graphDimensions = function() {
	this.d_ = {};
	this.d_.removeIconSize = CX.lineH;
};
Edge.prototype.select = function(o, i) {
	console.log('Select Edge ' + o.key);
	d3.event.stopPropagation();
};
Edge.prototype.edit = function(o, i) {
	NodeEdgeEngine.reset();

	var key = o.key;
	console.log('edit edge ' + key);

	var edge = edges.local[key];
	var w = CX.textBoxW;
	var h = CX.textBoxH*4;
	var pos = ForceField.constrainToCanvas((o.source.x + o.target.x)/2.0, (o.source.y + o.target.y)/2.0, w, h);
	var editWindow = rootCanvas.classed('editing', true).append('foreignObject')
		.attr('class', 'editWindow')
		.attr('x', pos.x)
		.attr('y', pos.y)
		.attr('width', w)
		.attr('height', h)
		.on('click', function() { d3.event.stopPropagation(); });

	var typeBox = editWindow.append('xhtml:input').attr('type', 'text').attr('value', edge.val.type);
	var nameBox = editWindow.append('xhtml:input').attr('type', 'text').attr('value', edge.val.name);
	var dataBox = editWindow.append('xhtml:input').attr('type', 'text').attr('value', edge.val.data);
	var saveButton = editWindow.append('xhtml:input').attr('type', 'button').attr('value', 'save')
		.on('click', function() {
			var type = typeBox[0][0].value;
			var name = nameBox[0][0].value;
			var data = dataBox[0][0].value;
			edges.update(key, {type: type, name: name, data: data});
			editWindow.remove();
		});
	var cencelButton = editWindow.append('xhtml:input').attr('type', 'button').attr('value', 'cancel')
		.on('click', function() {
			editWindow.remove();
		});

	d3.event.stopPropagation();
};
Edge.prototype.remove = function(o, i) {
	var key = o.key;
	console.log('remove Edge ' + key);

	edges.remove(key);
	d3.event.stopPropagation();
}
Edge.prototype.simplify = function() {
	var p = nodes.localArrayIndexOf(this.val.fromNode);
	var q = nodes.localArrayIndexOf(this.val.toNode);
	if(p === undefined || q === undefined)
		console.error('Nodes not found in localArray');
	var e = {
		key: this.key, 
		source: nodes.localArray[p], 
		target: nodes.localArray[q],
		fixed: false
	};
	return e;
};
Edge.prototype.draw = function(rootElement, className) {
	var line = rootElement.append('line').on('click', this.select);

	var nameTag = rootElement.append('text').attr('class', 'name').on('dblclick', this.edit);

	var removeIcon = rootElement.append('g').attr('class', 'removeIcon clickable');
	removeIcon.append('rect').attr('class', 'box').attr('width', this.d_.removeIconSize).attr('height', this.d_.removeIconSize);
	removeIcon.append('line').attr('x1', 0).attr('y1', 0).attr('x2', this.d_.removeIconSize).attr('y2', this.d_.removeIconSize);
	removeIcon.append('line').attr('x1', this.d_.removeIconSize).attr('y1', 0).attr('x2', 0).attr('y2', this.d_.removeIconSize);
	removeIcon.on('click', this.remove);

	this.redraw(rootElement, className);
};
Edge.prototype.redraw = function(rootElement, className) {
	rootElement.attr('class', className + ' ' + this.storageType + ' ' + this.val.type).attr('id', this.cssID);
//	console.log('redraw edge');
//	console.log(this.val.name);
//	console.log(rootElement.select('text.name'))

	rootElement.select('text.name').text(this.val.name);
};