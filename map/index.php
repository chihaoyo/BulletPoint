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
	<form>
		<p><span>add a(n) </span><select name="type">
			<option>human</option>
			<option>event</option>
			<option>place</option>
			<option>book</option>
			<option>ideology</option>
			<option>argument</option>
			<option>issue</option>
		</select> node named <input type="text" name="name" placeholder="name" /> with data <input type="text" name="data" placeholder="Javascript Object" /> and keep it <select name="storage"><option>public</option><option>private</option></select><input type="button" value="add" /></p><p>add an <span class="emphasize">article</span> node by using the Chrome plugin</p><p>add an edge by clicking on two nodes consecutively</p>
	</form>
	<div id="canvas"><svg></svg></div>
</body>
<?php
/*
include_once('../common/importer.php');

$userIDFromCookie = (isset($_COOKIE['BulletPointUserID']) ? $_COOKIE['BulletPointUserID'] : '');
$userIDFormat = '/^@[0-9A-F]{8}-[0-9A-F]{4}-[1-5][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/';
*/
?>
<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js"></script>
<script src="//50.18.115.212/common/lib-jquery-ext.js"></script>
<script src="//underscorejs.org/underscore-min.js"></script>
<script src="//cdn.firebase.com/js/client/1.0.18/firebase.js"></script>
<script src="//d3js.org/d3.v3.min.js"></script>
<script src="DS.js"></script>
<script src="Node.js"></script>
<script src="Edge.js"></script>
<script src="ForceField.js"></script>
<script src="init.js"></script>
</html>