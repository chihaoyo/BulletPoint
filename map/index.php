<!DOCTYPE HTML>
<svg id="main"></svg>
<?php

include_once('../common/importer.php');

$userIDFromCookie = (isset($_COOKIE['BulletPointUserID']) ? $_COOKIE['BulletPointUserID'] : '');
$userIDFormat = '/^@[0-9A-F]{8}-[0-9A-F]{4}-[1-5][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/';

?>
<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js"></script>
<script src="//50.18.115.212/common/lib-jquery-ext.js"></script>
<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script>

var $window = $(window);
var $document = $(document);

var X = {};
var userID = '@A2DCFDB5-C277-4AA1-AC53-0904120C4F69';
var rootCanvas = null;
var nodesLocal = null;

var init = function() {
	// scope environment
	X.docW = $document.width();
	X.docH = $document.height();
	
	X.fontSize = 13.0;
	X.letterW = +(X.fontSize*0.62).toFixed(4);
	X.lineH = +(X.fontSize*1.25).toFixed(4);
	
	X.canvasW = +X.docW*0.99.toFixed();
	X.canvasH = +(X.docH - 6*X.fontSize)*0.95.toFixed(); // exclude top & bottom margin: 3em
	
	console.log(X);
	
	// locate and set up root canvas
	rootCanvas = d3.select('svg#main');
	rootCanvas.attr('width', X.canvasW).attr('height', X.canvasH);

	// retrieve data
	$.get('//50.18.115.212/bulletpoint/server/Nodes/' + userID, {}, function(data) {
		data = JSON.parse(data);
		nodesLocal = data;
		draw_nodes();
	});
}
var draw_nodes = function() {
	console.log(rootCanvas);
	console.log(nodesLocal);
}

$window.load(init);

</script>