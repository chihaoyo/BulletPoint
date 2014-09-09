<!DOCTYPE HTML>
<svg id="main"></svg>
<?php

include_once('importer.php');

$userIDFromCookie = (isset($_COOKIE['BulletPointUserID']) ? $_COOKIE['BulletPointUserID'] : '');
$userIDFormat = '/^@[0-9A-F]{8}-[0-9A-F]{4}-[1-5][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/';

?>
<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js"></script>
<script src="//50.18.115.212/common/lib-jquery-ext.js"></script>
<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script>

var $window = $(window);
var $canvas = $('svg#main');

$.get('//50.18.115.212/bulletpoint/server/Nodes/@A2DCFDB5-C277-4AA1-AC53-0904120C4F69', {}, function(data) {
	data = JSON.parse(data);
	console.log(data);
});

$window.load = function() {
};

</script>