<!DOCTYPE HTML>
<?php

include_once('importer.php');

$userIDFromCookie = (isset($_COOKIE['BulletPointUserID']) ? $_COOKIE['BulletPointUserID'] : '');

?>
<html>
<head>
	<title>BulletPoint</title>
	<meta charset="utf-8" />
	<link rel="shortcut icon" href="favicon.ico" />
	<link href='http://fonts.googleapis.com/css?family=Droid+Serif:400,700,400italic,700italic' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" href="http://50.18.115.212/fonts/helvetica-neue/stylesheet.css" />
	<link rel="stylesheet" href="index.css" />
</head>
<body>
	<h1>BulletPoint</h1>
	<p>You are <input id="BulletPointUserIDFromCookie" type="text" value="<?php echo $userIDFromCookie; ?>" style="width: 300px;" /></p>
	<h2>Nodes</h2>
<?php

$db = connect_to_db();
$data = $db->fa('SELECT * FROM Nodes ORDER BY serial DESC');
foreach($data as $row) {
	$comment = $row['comment'];
	$tags = $db->fa(
		'SELECT * FROM Tags WHERE serial in (SELECT tag_id FROM NodeTagPairs WHERE node_id = :node_id)', 
		array('node_id' => $row['serial'])
	);
	if(count($tags) > 0)
		$tags = implode(' ', array_select('tag', $tags));//array_column($tags, 'tag'));
	else
		$tags = '';

	echo sprintf('<p><span>#%s</span>, <a href="%s" target="_blank"><span class="">%s</span></a>, <span class="bold">%s</span>%s%s</p>', 
		$row['serial'], 
		$row['url'], 
		$row['title'], 
		$row['user_id'], 
		($comment != '' ? ', “<span class="italic">' . $comment . '</span>”' : ''), 
		($tags != '' ?  ', <span class="bold">' . $tags . '</span>' : '')
	);
}

?>
</body>
</html>
<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js"></script>
<script src="//50.18.115.212/common/lib-jquery-ext.js"></script>
<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script>

var $window = $(window);

$window.load = function() {
};

</script>