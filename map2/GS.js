var Node = function(key) {
	this.key = key;
};
Node.prototype.makeGraphics = function(gContainer) {
	this.gContainer = gContainer;
	var element = theElements.get(this.key);
	if(element !== false) {
		var semanticType = element.semanticType;
		this.gContainer.attr('class', 'Element Node ' + semanticType).attr('id', this.key);

		this.gCenter = this.gContainer.append('g').attr('class', 'center');
		this.gCenter.append('circle').attr('class', 'clickable semanticTypeIndicator').attr('r', theUI.unitSize/2);
	}
	else {
		console.error('element not found ' + this.key);
	}
};
Node.prototype.positionGraphics = function(x, y) {
	if('gContainer' in this && 'gCenter' in this && this.gContainer != null && this.gCenter != null) {
		this.gContainer.attr('transform', 'translate(' + x + ',' + y + ')');
	}
};

var Link = function(key, source, target) {
	this.key = key;
	this.source = source;
	this.target = target;
};
Link.prototype.makeGraphics = function(gContainer) {
	this.gContainer = gContainer;
	var element = theElements.get(this.key);
	if(element !== false) {
		var semanticType = element.semanticType;
		this.gContainer.attr('class', 'Element Link ' + semanticType).attr('id', this.key);

		this.gLine = this.gContainer.append('line').attr('class', 'link');
		this.gCenter = this.gContainer.append('g').attr('class', 'center');
	}
	else{
		console.error('element not found ' + this.key);
	}
};
Link.prototype.positionGraphics = function(x1, y1, x2, y2) {
	if('gContainer' in this && 'gLine' in this && 'gCenter' in this && this.gContainer != null && this.gLine != null && this.gCenter != null) {
		this.gLine.attr('x1', x1).attr('y1', y1).attr('x2', x2).attr('y2', y2);
		this.gCenter.attr('transform', 'translate(' + (x1 + x2)/2 + ',' + (y1 + y2)/2 + ')');
	}
};

var Dictionary = function(initialValue) {
	if(arguments.length < 1)
		initialValue = {}
	this.o = initialValue;
};
Dictionary.prototype.get = function(key) {
	if(key in this.o)
		return this.o[key];
	return false;
};
Dictionary.prototype.set = function(key, val) {
	this.o[key] = val;
};
Dictionary.prototype.toString = function() {
	return JSON.stringify(this.o);
};
/*
var gTypes = {
	'node': {singular: 'node', plural: 'nodes', array: 'nodes', dictionary: 'nodesIndex', gElements: 'gNodes'},
	'link': {singular: 'link', plural: 'links', array: 'links', dictionary: 'linksIndex', gElements: 'gLinks'}
};*/

var theForceField = {};
theForceField.field = null;
theForceField.drag = null;
theForceField.nodes = [];
theForceField.links = [];
theForceField.nodesIndex = new Dictionary();
theForceField.linksIndex = new Dictionary();
theForceField.map = new Dictionary({
	'human': 'node',
	'organization': 'node',
	'event': 'node',
	'relation': 'link'
});
theForceField.getNode = function(key) {
	var i = this.nodesIndex.get(key);
	if(i !== false)
		return this.nodes[i];
	return false;
};
theForceField.getLink = function(key) {
	var i = this.linksIndex.get(key);
	if(i !== false)
		return this.links[i];
	return false;
};
theForceField.redraw = function() {
	if(this.field == null) {
		// initiate field
		this.field = d3.layout.force()
			.nodes(this.nodes)
			.links(this.links)
			.charge(-600)
			.friction(0.8)
			.linkDistance(105)
			.size([theUI.viewportW, theUI.viewportH])
			.on('tick', function(event) {
				theForceField.gNodes.each(function(o) {
					o.positionGraphics(o.x, o.y);
				});
				theForceField.gLinks.each(function(o) {
					o.positionGraphics(o.source.x, o.source.y, o.target.x, o.target.y);
				});
			});
	}
	if(this.drag == null) {
		this.drag = this.field.drag()
			.origin(function(o) { return o; })
			.on('dragstart', function(o) {
				o.dragged = true;
				//o.fixed = true;
			})
			.on('dragend', function(o) {
				o.dragged = false;
			});
	}

	// associate data for gElements
	this.gNodes = theCanvas.selectAll('g.Element.Node').data(this.nodes, function(o) { return o.key; });
	this.gLinks = theCanvas.selectAll('g.Elmenet.Link').data(this.links, function(o) { return o.key; });

	// insert new gElements
	this.gNodes.enter().insert('g').each(function(o, i) {
		var g = theForceField.getNode(o.key);
		if(g !== false)
			g.makeGraphics(d3.select(this));
	});
	this.gLinks.enter().insert('g').each(function(o, i) {
		var g = theForceField.getLink(o.key);
		if(g !== false)
			g.makeGraphics(d3.select(this));
	});

	// remove old gElements
	this.gNodes.exit().remove();
	this.gLinks.exit().remove();

	this.gNodes.call(this.drag);

	this.field.start();
};
theForceField.push = function(key, val) {
	var gType = this.map.get(val.semanticType);
	if(gType !== false) {
		if(gType == 'node') {
			this.nodes.push(new Node(key));
			this.nodesIndex.set(key, this.nodes.length - 1);
		}
		else if(gType == 'link') {
			this.links.push(new Link(key, this.getNode(val.content.fromElement), this.getNode(val.content.toElement)));
			this.linksIndex.set(key, this.links.length - 1);
		}
		this.redraw();
	}
	else {
		console.error('Undefined graphical type: ' + gType);
	}
};
theForceField.update = function(key, val) {
	var gType = this.map.get(val.semanticType);
	if(gType !== false) {
		if(gType == 'node') {
			var i = this.nodesIndex.get(key);
			this.nodes[i] = new Node(key);
		}
		else if(gType == 'link') {
			var i = this.linksIndex.get(key);
			this.links[i] = new Link(key, this.getNode(val.content.fromElement), this.getNode(val.content.toElement));
		}
		this.redraw();
	}
	else {
		console.error('Undefined graphical type: ' + gType);
	}
};
theForceField.remove = function(key) {

};