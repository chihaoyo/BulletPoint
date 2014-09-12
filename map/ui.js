// environment
//var font_size = 14.0;
//var a = +(font_size*0.60).toFixed(4); // letter width
//var u = +(font_size*1.25).toFixed(4); // line height
var X = {};
// svg root
var svg = null;

var init = function() {
	X.docW = $document.width();
	X.docH = $document.height();
	
	X.fontSize = 13.0;
	X.letterW = +(X.fontSize*0.62).toFixed(4);
	X.lineH = +(X.fontSize*1.25).toFixed(4);
	
	X.canvasW = +X.docW*0.99.toFixed();
	X.canvasH = +(X.docH - 6*X.fontSize)*0.95.toFixed(); // exclude top & bottom margin: 3em
	
	console.log(X);
	
	svg = d3.select('svg');
	svg.attr('width', X.canvasW).attr('height', X.canvasH);
};

var coorXY = function(p, q) {
	return {x: (p*X.canvasW + X.canvasW)/2.0, y: (q*X.canvasH + X.canvasH)/2.0};
};
var coorPQ = function(x, y) {
	return {p: (x - X.canvasW/2.0)/X.canvasW*2.0, q: (y - X.canvasH/2.0)/X.canvasH*2.0};
};
var make_node = function(c, v) {
	return {c: c, v: v, p: 0, q: 0, note: ''};
};

// http://stackoverflow.com/questions/6989100/sort-points-in-clockwise-order
var draw_frame = function() {
	svg.selectAll('.frame').remove();
	
	var coors = [];
	for(i in nodes_local) {
		var node = nodes_local[i];
		if(node.val.c == 'cornerstone')
			coors.push({p: node.val.p, q: node.val.q});
	}
	var sortClockwise = function(a, b) { return a.p*b.q - b.p*a.q; };
	coors.sort(sortClockwise);
	
	var XY0 = coorXY(0, 0);
	
	// draw border
	svg.insert('polygon', ':first-child')
		.attr('class', 'frame border')
		.attr('points', coors.map(function(n) { var XY = coorXY(n.p, n.q); return [XY.x, XY.y].join(','); }).join(' '));
		
	// draw origin
	svg.insert('circle', ':first-child')
		.attr('class', 'frame origin')
		.attr('r', +(X.fontSize*0.2).toFixed())
		.attr('cx', XY0.x).attr('cy', XY0.y)
	
	// draw axes
	for(var i = 0; i < coors.length; i++) {
		var XY = coorXY(coors[i].p, coors[i].q);
		svg.insert('line', ':first-child')
			.attr('class', 'frame axis')
			.attr('x1', XY0.x).attr('y1', XY0.y)
			.attr('x2', XY.x).attr('y2', XY.y)
	}
};

// http://bost.ocks.org/mike/join/
// http://bl.ocks.org/mbostock/3808218
var draw_nodes = function() {
	// join
	var nodes = svg.selectAll('g.node').data($.map(nodes_local, function(o, i) { return [o]; }), function(o) { return JSON.stringify(o.val); });
	// http://stackoverflow.com/questions/6857468/a-better-way-to-convert-js-object-to-array

	// enter
	var new_nodes = nodes.enter().append('g');
	console.log('draw_nodes: adding ' + new_nodes.size() + ' nodes');

	// draw new nodes
	new_nodes.attr('class', function(o, i) { return 'node draggable ' + o.val.c + (o.val.v.substr(0, 1) == '-' ? ' negated' : ''); })
		.attr('id', function(o, i) { return o.key; })
		.attr('transform', function(o, i) {
			var XY = coorXY(o.val.p, o.val.q);
			o.x = XY.x;
			o.y = XY.y;
			return 'translate(' + o.x.toFixed() + ',' + o.y.toFixed() + ')'; 
		})
		.on('mouseover', function(o, i) {
			d3.select(this).classed('focus', true);
		})
		.on('mouseout', function(o) {
			d3.select(this).classed('focus', false);
		});
		
	new_nodes.append('rect').attr('class', 'block')
		.attr('x', function(o) { return -o.getWidth()/2; })
		.attr('y', function(o) { return -o.getHeight()/2; })
		.attr('width', function(o) { return o.getWidth(); })
		.attr('height', function(o) { return o.getHeight(); });
		
	// draw center of node for reference
	new_nodes.append('circle').attr('r', 3).attr('cx', 0).attr('cy', 0).attr('fill', 'rgba(0, 0, 0, 0.5)'); // center point
	
	new_nodes.append('text').attr('text-anchor', 'middle')
		.attr('y', function(o) { return o.getHeight()/4; })
		.text(function(o) { return o.val.v; });
	new_nodes.append('circle').attr('class', 'red')
		.attr('cx', function(o) { return -o.getWidth()/2; })
		.attr('cy', function(o) { return -o.getHeight()/2; })
		.attr('r', (X.letterW/3*2).toFixed(4))
		.on('click', function(o, i) { remove_node(o, i); });
	
	// exit
	var old_nodes = nodes.exit();
	console.log('draw_nodes: removing ' + old_nodes.size() + ' nodes');
	old_nodes.remove();
	
	// draw frame
	draw_frame();

	// enable dnd
	new_nodes.call(drag);
};
var redraw_node = function(k, v) {
	var XY = coorXY(v.p, v.q);
	svg.select('g.node#' + k).attr('transform', 'translate(' + XY.x.toFixed() + ', ' + XY.y.toFixed() + ')');
	draw_frame();
};

var add_node = function(c, v) {
	console.log('add node ' + c + ' ' + v);
	nodes_.push(make_node(c, v));
};
var remove_node = function(o, i) {
	console.log('remove node @' + o.key + ' ' + JSON.stringify(o.val));
	nodes_.child(o.key).remove();
};
var save_node = function(o, i) {
	console.log('save node @' + o.key  + ' ' + JSON.stringify(o.val));
	nodes_.child(o.key).update(o.val);
};

var EDGE_ENGINE = new EdgeEngine();
// dnd + click + edge creation
var drag = d3.behavior.drag()
	.on('drag', function(o, i) {
		o.dragging = true;
		o.x += d3.event.dx;
		o.y += d3.event.dy;
		d3.select(this).attr('transform', 'translate(' + o.x.toFixed() + ', ' + o.y.toFixed() + ')');
	})
	.on('dragend', function(o, i) {
		// bound XY within canvas
		if(o.x < 0 || o.x > X.canvasW)
			o.x = (o.x < 0 ? 0 : X.canvasW);
		if(o.y < 0 || o.y > X.canvasH)
			o.y = (o.y < 0 ? 0 : X.canvasH);
		var PQ = coorPQ(o.x, o.y);
		if(o.val.p == PQ.p && o.val.q == PQ.q) {
			EDGE_ENGINE.clickHandler(o.key);
		}
		else {
			o.val.p = PQ.p;
			o.val.q = PQ.q;
			save_node(o, i);
		}
		o.dragging = false;
	});

// ui
var $category = $('#category');
var $input = $('#input');
var $submit = $('#submit');
$category.change(function() {
	$input.attr('category', $category.val());
});
$submit.click(function() {
	var c = $category.val();
	var v = $input.val();
	if(c != '' && v != '')
		add_node(c, v);

	$input.val('');
	return false;
});
$category.change();