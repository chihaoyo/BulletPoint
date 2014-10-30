var Collection = function(url, child_added_handler, child_changed_handler, child_removed_handler) {
	if(arguments.length > 0) {
		this.url = url;
		this.handle = new Firebase(this.url);
		this.items = {};
		if(arguments.length >= 4) {
			this.handle.on('child_added', _.bind(child_added_handler, this));
			this.handle.on('child_changed', _.bind(child_changed_handler, this));
			this.handle.on('child_removed', _.bind(child_removed_handler, this));
		}
	}
	else
		return {};
};
Collection.prototype.get = function(key) {
	if(key in this.items)
		return this.items[key];
	return false;
}
Collection.prototype.push = function(val) { // API
	if(this.handle != null)
		this.handle.push(val);
};
Collection.prototype.update = function(key, val) { // API
	if(this.handle != null)
		this.handle.child(key).update(val);
};
Collection.prototype.remove = function(key) { // API
	if(this.handle != null)
		this.handle.child(key).remove();
};

var Element = function() {
	var semanticType, owner, privacy, content;
	if(arguments.length == 1 && typeof arguments[0] == 'object') {
		var o = arguments[0];
		semanticType = o.semanticType;
		owner = o.owner;
		privacy = o.privacy;
		content = o.content;
	}
	else if(arguments.length == 4) {
		semanticType = arguments[0];
		owner = arguments[1];
		privacy = arguments[2];
		content = arguments[3];
	}
	else
		return {}; // Is this right?

	this.semanticType = semanticType;
	this.owner = owner;
	this.privacy = privacy;
	this.content = $.extend(true, {}, content); // deep copying of content
};
/**

semanticType:
	text
	human
	organization
	place
	event
	relation

*/