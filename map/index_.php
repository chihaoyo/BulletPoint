<!DOCTYPE HTML>
<html>
<head>
	<title>#iameetinghouse</title>
	<meta charset="utf-8" />
	<link rel="shortcut icon" href="favicon.ico" />
	<link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Source+Code+Pro:400,700" />
	<link rel="stylesheet" href="main.css" />
</head>
<body>
	<div id="canvas"><svg></svg></div>
	<form>
		<span>add a node that is a(n) </span><select id="category">
			<option>human</option>
			<option>organism</option>
			<option>organization</option>
			<option>project</option>
			<option>place</option>
			<option>issue</option>
			<option>concept</option>
			<option>cornerstone</option>
		</select><input type="text" id="input" /><input type="submit" value="add" id="submit" />
	</form>
</body>
<script src="../js/jquery-2.1.1.min.js"></script>
<script src="../js/d3.min.js"></script>
<script src="../js/jquery.unevent.js"></script>
<script src="https://cdn.firebase.com/js/client/1.0.18/firebase.js"></script>
<script src="Node.js"></script>
<script src="EdgeEngine.js"></script>
<script src="ui.js"></script>
<script>

// data
var root_ = new Firebase('https://resplendent-fire-8362.firebaseio.com/iameetinghouse/');
var initialized = false;

var nodes_local = {};
var nodes_ = root_.child('nodes2');
var edges_ = root_.child('edges2');
nodes_.once('value', function(snapshot) {
	console.log('nodes on value');
	// this executes when app first launched locally, right?
	if(!initialized) {
		console.log('draw nodes for the first time');
		draw_nodes();
	}
	initialized = true;
	console.log('initialized');
});
nodes_.on('child_added', function(snapshot) {
	var key = snapshot.name();
	var val = snapshot.val();
	console.log('nodes on child_added ' + key + ' ' + JSON.stringify(val));

	var node = new Node(key, val);
	nodes_local[key] = node;

	if(initialized) {
		console.log('draw nodes at added child event');
		draw_nodes();
	}
}, function(error) {
	console.log('error: ' + error.code);
});
nodes_.on('child_changed', function(snapshot) {
	var key = snapshot.name();
	var val = snapshot.val();
	console.log('nodes on child_changed ' + key + ' ' + JSON.stringify(val));
	
	nodes_local[key].val = val;
	redraw_node(key, val);
});
nodes_.on('child_removed', function(snapshot) {
	var key = snapshot.name();
	var val = snapshot.val();
	console.log('nodes on child_removed ' + key + ' ' + JSON.stringify(val));
	
	delete nodes_local[key];
	draw_nodes();
});

var $window = $(window);
var $document = $(document);
$window.load(init);
$window.on('resize', function() {
	console.log('unevent: resize');
}, 500);

</script>
</html>