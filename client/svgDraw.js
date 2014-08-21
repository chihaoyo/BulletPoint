// testing d3.js force-layout network drawing function
var nodeRecordToSVGNode = function(jsonNode) {
	var textColumns = [];
	var titleText = jsonNode["title"];
	var charCount = 0,
		lengthLimit = 48;
	for (; charCount < titleText.length; charCount++) {
		if (byteCount(titleText.substring(0,charCount)) > lengthLimit) {
			break;
		}
	}
	textColumns[0] = titleText.substring(0,charCount);
	if(byteCount(titleText) > lengthLimit) {
		textColumns[0] += '\t...';
	}
	/*
	textColumns[0] = jsonNode["serial"];
	textColumns[1] = jsonNode["user_id"];
	textColumns[2] = jsonNode["title"];
	textColumns[3] = jsonNode["url"];
	textColumns[4] = jsonNode["comment"];
	*/
	return {
		size: 5,
		fontSize: 12,
		x: 300,
		y: 300,
		fixed: false,
		weight: 0,
		color: "blue",
		stroke: "cyan",
		strokeWidth: 2,
		textColumns: textColumns
	};
};

var drawOneNode = function(node) {
	var svgCanvas = d3.select("svg");	
	var nodeObject = svgCanvas.append("path");
	console.log('canvasSize:(' + svgCanvas.attr("width") + ',' + svgCanvas.attr("height") + ')');
	
	var posX = ~~(Math.random() * svgCanvas.attr("width")),
		posY = ~~(Math.random() * svgCanvas.attr("height"));
	node.x = posX;
	node.y = posY;

	/*
	var pathSelection = svgCanvas.append("path")
		.attr("transform", "translate(" + node.x + "," + node.y + ")")
		.attr("d", d3.svg.symbol()
			.size(node.size)
			.type(node.type))
		.style("fill", node.color);
		//.call(force.drag);
	*/
	var circleSelection = svgCanvas.append("circle")
		.attr("cx", node.x)
		.attr("cy", node.y)
		.attr("r", node.size)
		.attr("stroke", node.stroke)
		.attr("stroke-width", node.strokeWidth)
		.attr("fill", node.color);
	var columnCount = 0;
	node.textColumns.forEach(function(textEntry){
		if(typeof textEntry !== 'undefined') {
			var textSelection = svgCanvas.append("text")
				.attr("x", node.x + node.size)
				.attr("y", node.y + columnCount * node.fontSize * 1.25)
				.attr("font-size", node.fontSize)
				.attr("fill", "grey")
				.text(textEntry)
				.attr("transform", "rotate(-30, " + node.x + ", " + node.y + ")");
			columnCount++;
		}
	});
};


var drawSVG = function(jsonRecordFromServer) {
	// basic force layout initial settings
	var mapWidth = 1600,
		mapHeight = 1000,
		nodes = [],
		links = [];

	/*
	nodes.push({
		type: d3.svg.symbolTypes[2],
		size: 300,
		x: 100,
		y: 100,
		fixed: false,
		weight: 0,
		color: "blue",
		textColumns: "Hello, world!"
	});
	*/
	var force = d3.layout.force()
		.nodes(nodes)
		.links(links)
		.size([mapWidth, mapHeight]);
/*
d3.force : node attributes
	index - the zero-based index of the node within the nodes array.
	x - the x-coordinate of the current node position.
	y - the y-coordinate of the current node position.
	px - the x-coordinate of the previous node position.
	py - the y-coordinate of the previous node position.
	fixed - a boolean indicating whether node position is locked.
	weight - the node weight; the number of associated links.
*/

	// apppend SVG format canvas into body using the select function

	force.on("start", function() {
		//console.log('nodes[0]:(' + nodes[0].x + ',' + nodes[0].y + ')');

		var svgCanvas = d3.select("body").append("svg")
			.attr("width", mapWidth)
			.attr("height", mapHeight)
			.style("background-color", "black");
		//drawOneNode(nodes[0]);
		//var circleSelection = svgCanvas.selectAll("circle")
		var displayScale = d3.scale.linear()
									.domain([0,1])
									.range([0.05,0.95]);

		var pathSelection = svgCanvas.selectAll("path")
			.data(jsonRecordFromServer)
			.enter()
				.append("path")
					.attr("transform", function(d) {
							d["posX"] = displayScale(Math.random()) * svgCanvas.attr("width");
							d["posY"] = displayScale(Math.random()) * svgCanvas.attr("height");
							return ("translate(" + d["posX"] + "," + d["posY"] + ")");
						})
					.attr("d", d3.svg.symbol()
								.size(20)
								.type(d3.svg.symbolTypes[5]))
				/*.append("circle")
					.attr("cx", function(d) {
									d["posX"] = ~~((Math.random() * 0.9 + 0.05) * svgCanvas.attr("width"));
									return d["posX"];
								})
					.attr("cy", function(d) {
									d["posY"] = ~~((Math.random() * 0.9 + 0.05) * svgCanvas.attr("height"));
									return d["posY"];
								})
					.attr("r", 5)*/
					.attr("stroke-width", 1)
					.attr("stroke", "blue")
					.attr("fill", "darkturquoise");
					//.call(force.drag);

		/*
		var textSelection = svgCanvas.selectAll("text")
			.data(jsonRecordFromServer)
			.enter()
				.append("text")
					.attr("x", function(d) {return d["posX"]+10;})
					.attr("y", function(d) {return d["posY"];})
					.attr("font-size", 12)
					.attr("fill", "grey")
					.text(function(d) {return shortString(d["title"], 48);})
					.attr("transform", function(d) {
						console.log(this);
						return "rotate(-30, " + d["posX"] + ", " + d["posY"] + ")";});
		*/

		var urlSelection = svgCanvas.selectAll("a")
			.data(jsonRecordFromServer)
			.enter()
				.append("a")
					.attr("xlink:href", function(d) {return d["url"];})
					.append("text")
						.attr("x", function(d) {return d["posX"]+10;})
						.attr("y", function(d) {return d["posY"]+5;})
						.attr("font-size", 12)
						.attr("fill", "steelblue")
						.text(function(d) {return shortString(d["title"], 48);})
						.attr("transform", function(d) {return "rotate(-30, " + d["posX"] + ", " + d["posY"] + ")";});
/*	
		var pathSelection = svgCanvas.append("path")
			.attr("transform", "translate(" + nodes[0].x + "," + nodes[0].y + ")")
			.attr("d", d3.svg.symbol()
				.size(nodes[0].size)
				.type(nodes[0].type))
			.style("fill", "purple");
			//.call(force.drag);

		var textSelection = svgCanvas.append("text")
			.attr("x", nodes[0].x + nodes[0].size/20)
			.attr("y", nodes[0].y)
			.attr("font-size", 16)
			.attr("fill", "Cyan");
		
		textSelection.text("abcdefg");
*/		
		console.log('done');
	});
	force.start();
};

console.log("svgDraw.js is loaded.");
