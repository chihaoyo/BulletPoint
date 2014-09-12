var Edge = function(type, key, val) {
	this.type = type;
	this.key = key;
	this.val = val;
}
Node.prototype.draw = function() {
	console.log('draw Edge ' + this.type + ' ' + this.key + ' ' + JSON.stringify(this.val));
}

// EdgeEngine handles drawing edges in UI
// singleton!
var EdgeEngine = function() {
	this.last = null;
	this.edges = [];
}
EdgeEngine.prototype.clickHandler = function(id) { // node (id) is clicked
	if(this.last == null)
		this.last = id;
	else {
		this.edges.push(new Edge(this.last, id));
	}
}