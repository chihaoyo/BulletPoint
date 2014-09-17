<!DOCTYPE HTML>
<html>
<head>
	<title>bulletpoint/map</title>
	<meta charset="utf-8" />
	<link rel="shortcut icon" href="favicon.ico" />
	<link href='http://fonts.googleapis.com/css?family=Roboto:300italic,500,500italic,300&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" href="main.css" />
</head>
<body>
	<div id="canvas"><svg></svg></div>
	<div class="form" id="addForm">
		<p><span>add a(n) </span><select name="nodeType">
			<option>human</option>
			<option>organization</option>
			<option>event</option>
			<option>place</option>
			<option>book</option>
			<option>ideology</option>
			<option>argument</option>
			<option>issue</option>
		</select> node <span class="sampleNode"></span> named <input type="text" name="nodeName" placeholder="name" /> with data <input type="text" name="nodeData" placeholder="Javascript Object" /> and make it <select name="nodeStorageType"><option value="sync">public</option><option value="stat">private</option></select><input type="button" name="submit" value="go" /></p>
		<p>add an <span class="emphasize">article</span> node <span class="sampleNode"></span> by using the Chrome plugin</p>
		<p>add an edge <span class="sampleEdge"></span> by clicking on the circle <span class="sampleNode"></span> of two nodes consecutively</p>
		<p>double click on the name of the node to edit it</p>
	</div>
</body>
<script src="js/jquery-2.1.1.min.js"></script>
<script src="//50.18.115.212/common/lib-jquery-ext.js"></script>
<script src="js/underscore-min.js"></script>
<script src="js/firebase.min.js"></script>
<script src="js/d3.min.js"></script>
<script src="DS.js"></script>
<script src="Node.js"></script>
<script src="Edge.js"></script>
<script src="ForceField.js"></script>
<script src="init.js"></script>
</html>