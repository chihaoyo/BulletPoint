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
$data = $db->fa('SELECT * FROM nodes ORDER BY serial DESC');
foreach($data as $row) {
	echo '<p>#' . $row['serial'] . ' <span class="italic">' . ($row['title'] != '' ? $row['title'] : 'Untitled') . '</span> at <code>' . $row['url'] . '</code> added by <span class="bold">' . $row['user_id'] . '</span>' . ($row['tags'] != '' ? ' with tags <span class="bold italic">' . $row['tags'] : '</span>')  . '</p>';
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