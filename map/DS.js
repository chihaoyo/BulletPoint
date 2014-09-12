/*

DS: data store that consolidates two types of data - synced and static
Synced data is linked to Firebase (Actively pushed to every client)
Static data is linked to MySQL database at 50.18.115.212 (Passively sits there waiting to be polled)

Static and Synced: imitates how Firebase works

# Manipulation
1. No support for child
2. Firebase.push(dictionary) -> Static.push(dictionary)
3. Firebase.child(id).update(dictionary) -> Static.update(id, dictionary)
4. Firebase.child(id).remove() -> Static.remove(id);
	
# Events
1. When first connect to a data storage, child_added event is trigger for each entry
2. After all child_added, a value event is triggered
3. child_added for each new entry added
4. child_updated for each entry updated
5. child_removed for each entry removed

*/

// Wrapper for static data to imitate a Firebase Snapshot
var Snapshot = function(data) {
	this.data = data;
}
Snapshot.prototype.name = function() { return this.data.serial.toString(); }
Snapshot.prototype.val = function() { return this.data; }


// Wrapper for a REST data store
var Static = function(parent, baseURL) {
	this.___parent = parent;
	this.type = 'stat';
	this.baseURL = baseURL;
	
	var that = this;
	$.ajax({
		url: that.baseURL + '/all',
		type: 'GET',
		success: function(data) {
			data = JSON.parse(data);
			// trigger child_added event for each entry retrieved
			for(var i = 0; i < data.length; i++) {
				that.___parent.on('child_added').apply(that, [new Snapshot(data[i])]);
			}
			// trigger value event once
			that.___parent.once('value').apply(that);
			delete that.___parent.___onceCallbacks['value']; // remove callback ∵ once
		}
	});
}
Static.prototype.push = function(dictionary) {
	if(dictionary === undefined || dictionary == null || dictionary == {} || dictionary.length <= 0)
		return false;
		
	var that = this;
	$.ajax({
		url: that.baseURL,
		type: 'POST',
		data: dictionary,
		success: function(data) {
//			console.log('Success: POST to ' + that.baseURL);
			data = JSON.parse(data);
			var callback = that.___parent.on('child_added');
			if(callback !== undefined && callback != null)
				callback.apply(that, [new Snapshot(data)]);
		}/*,
		error: function(data) {
			console.log('Error: POST to ' + that.baseURL);
			console.log(data.responseText);
		}*/
	});
}
Static.prototype.update = function(id, dictionary) {
	if(id === undefined || id == null || id == '')
		return false;
		
	if(dictionary.serial === undefined)
		dictionary.serial = id;
		
	var that = this;
	$.ajax({
		url: that.baseURL,
		type: 'POST',
		data: dictionary,
		success: function(data) {
			data = JSON.parse(data);
			var callback = that.___parent.on('child_changed');
			if(callback !== undefined && callback != null)
				callback.apply(that, [new Snapshot(data)]);
		}
	});
}
Static.prototype.remove = function(id) {
	if(id === undefined || id == null || id == '')
		return false;
		
	var that = this;
	$.ajax({
		url: that.baseURL + '/' + id,
		type: 'DELETE',
		success: function(data) {
			data = JSON.parse(data);
			var callback = that.___parent.on('child_removed');
			if(callback !== undefined && callback != null)
				callback.apply(that, [new Snapshot(data)]);
		}
	});
}


// Wrapper for Firebase
var Synced = function(parent, baseURL) {
	this.___parent = parent;
	this.type = 'sync';
	this.baseURL = baseURL;
	this.___firebase = new Firebase(this.baseURL);
	
	var that = this;
	for(var event in this.___parent.___onceCallbacks) {
		this.___firebase.once(event, _.bind(this.___parent.once(event), this));
	}
	for(var event in this.___parent.___onCallbacks) {
		this.___firebase.on(event, _.bind(this.___parent.on(event), this));
	}
}
Synced.prototype.push = function(dictionary) { return this.___firebase.push(dictionary); }
Synced.prototype.update = function(id, dictionary) { return this.___firebase.child(id).update(dictionary); }
Synced.prototype.remove = function(id) { return this.___firebase.child(id).remove(); }

// Consolidating two datasources
var DS = function(id, factoryFunc, hasStatic, hasSynced) {
	this.id = id;
	this.LocalDataEntity = factoryFunc;
	this.staticURL = hasStatic ? PARA.staticDSBaseURL + id : null;
	this.syncedURL = hasSynced ? PARA.syncedDSBaseURL + id : null;
	
	this.stat = null;
	this.sync = null;
	this.local = {};
	
	this.___onceCallbacks = {};
	this.___onCallbacks = {};
	
	this.flags = {initialized: false, ready: {sync: false, stat: false}};
}
DS.prototype.isConnected = function() {
	var syncedDataReady = (this.sync == null ? true : this.flags.ready.sync);
	var staticDataReady = (this.stat == null ? true : this.flags.ready.stat);
	return syncedDataReady && staticDataReady;
}
// bind or return callback on certain event
DS.prototype.once = function(event, callback) { // value
	if(callback === undefined)
		return this.___onceCallbacks[event];
	else
		this.___onceCallbacks[event] = callback;
}
DS.prototype.on = function(event, callback) { // child_added, child_changed, child_removed
	if(callback === undefined)
		return this.___onCallbacks[event];
	else
		this.___onCallbacks[event] = callback;
}
// init connection with remote data store
DS.prototype.connect = function() {
	this.stat = this.staticURL != null ? new Static(this, this.staticURL) : null
	this.sync = this.syncedURL != null ? new Synced(this, this.syncedURL) : null
}
DS.prototype.drawAll = function() {
	console.log(this.id + ' drawAll');
	// use enter/exit in d3 to determine which ones to draw/remove and which ones to skip // is it possible?
	
	var entities = rootCanvas.selectAll('g.' + this.id).data($.map(this.local, function(o, i) { return [o]; }), function(o) { return o.key + JSON.stringify(o.val); });
	
	var entitiesNew = entities.enter().append('g').attr('class', this.id).each(function(o, i) {
		o.draw();
	})
}