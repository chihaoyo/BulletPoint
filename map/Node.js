var Node = function(type, key, val) {
	this.type = type;
	this.key = key;
	this.val = val;
};
Node.prototype.getWidth = function() { return Math.ceil(this.val.v.length*X.letterW + 2*X.letterW); };
Node.prototype.getHeight = function() { return Math.ceil(X.lineH); };

Node.prototype.draw = function() {
	console.log('draw Node ' + this.type + ' ' + this.key + ' ' + JSON.stringify(this.val));
};
Node.prototype.redraw = function() {
	console.log('redraw Node ' + this.type + ' ' + this.key + ' ' + JSON.stringify(this.val));
};