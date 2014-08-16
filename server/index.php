<!DOCTYPE HTML>
<?php

include_once('importer.php');

?>
<html>
<head>
	<title>BulletPoints</title>
	<meta charset="utf-8" />
	<link rel="shortcut icon" href="favicon.ico" />
	<link href='http://fonts.googleapis.com/css?family=Droid+Serif:400,700,400italic,700italic' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" href="http://chihaoyo.me/fonts/helvetica-neue/stylesheet.css" />
	<link rel="stylesheet" href="main.css" />
</head>
<body>
	<h1>BulletPoints</h1>
	<h2>Nodes:</h2>
<?php

$db = connect_to_db();
$data = $db->fa('SELECT * FROM Nodes ORDER BY serial DESC');
foreach($data as $row) {
	$tags = $db->fa(
		'SELECT * FROM Tags WHERE serial in (SELECT tag_id FROM NodeTagPairs WHERE node_id = :node_id)', 
		array('node_id' => $row['serial'])
	);
	if(count($tags) > 0) {
		$tags = implode(' ', array_column($tags, 'tag'));
	}
	else {
		$tags = '';
	}

	echo sprintf('<p><span>#%s</span>, <a href="%s" target="_blank"><span class="">%s</span></a>, @<span class="bold">%s</span>%s%s</p>', 
		$row['serial'], 
		$row['url'], 
		$row['title'], 
		$row['user_id'], 
		($row['comment'] != '' ? ', “<span class="italic">' . $row['comment'] . '</span>”' : ''), 
		$tags
	);
}

?>
</body>
</html>
<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js"></script>
<script src="//chihaoyo.me/common/lib-jquery-ext.js"></script>
<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script>

$(function() {
});

</script>