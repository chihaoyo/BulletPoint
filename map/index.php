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
	<div class="form" id="addForm">
		<p><span>add a(n) </span><select name="nodeType">
			<option>human</option>
			<option>event</option>
			<option>place</option>
			<option>book</option>
			<option>ideology</option>
			<option>argument</option>
			<option>issue</option>
		</select> node <span class="sampleNode"></span> named <input type="text" name="nodeName" placeholder="name" /> with data <input type="text" name="nodeData" placeholder="Javascript Object" /> and make it <select name="nodeStorageType"><option>public</option><option>private</option></select><input type="button" name="submit" value="go" /></p>
		<p>add an <span class="emphasize">article</span> node <span class="sampleNode"></span> by using the Chrome plugin</p>
		<p>add an edge <span class="sampleEdge"></span> by clicking on two nodes consecutively</p>
	</div>
	<div id="canvas"><svg></svg></div>
</body>
<?php
/*
include_once('../common/importer.php');

$userIDFromCookie = (isset($_COOKIE['BulletPointUserID']) ? $_COOKIE['BulletPointUserID'] : '');
$userIDFormat = '/^@[0-9A-F]{8}-[0-9A-F]{4}-[1-5][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/';
*/
?>
<script src="js/jquery-2.1.1.min.js"></script>
<script src="//50.18.115.212/common/lib-jquery-ext.js"></script>
<script src="js/underscore.min.js"></script>
<script src="js/firebase.min.js"></script>
<script src="js/d3.min.js"></script>
<script src="DS.js"></script>
<script src="Node.js"></script>
<script src="Edge.js"></script>
<script src="ForceField.js"></script>
<script src="init.js"></script>
</html>