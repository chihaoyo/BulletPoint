<!DOCTYPE HTML>
<?php

include_once('../common/importer.php');

$userIDFromCookie = (isset($_COOKIE['BulletPointUserID']) ? $_COOKIE['BulletPointUserID'] : '');

?>
<html>
<head>
	<title>BulletPoint</title>
	<meta charset="utf-8" />
	<link rel="shortcut icon" href="favicon.ico" />
	<link href='http://fonts.googleapis.com/css?family=Roboto:300italic,500,500italic,300&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" href="index.css" />
</head>
<body>
	<h1>BulletPoint</h1>
	<p>You are <input type="text" name="userID" value="<?php echo $userIDFromCookie; ?>" class="long" id="BulletPointHomeUserIDInputField" /><input type="button" name="submit" value="update" id="BulletPointHomeUserIDUpdate"/> (debug use only)</p>
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

var setCookie = function(name, val, daysToExpire) {
	if(daysToExpire === undefined)
		daysToExpire = 3650; // ten years
	console.log('Set ' + name + ' to ' + val + ' in cookie');

	var d = new Date();
	d.setTime(d.getTime() + daysToExpire*24*3600*1000);
	document.cookie = name + '=' + val + '; expires=' + d.toGMTString();
};
var userIDFormat = /^@[0-9A-F]{8}-[0-9A-F]{4}-[1-5][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/; // format is all caps and case-sensitive
var userIDIsValid = function(id) {
	return (id.match(userIDFormat) != null);
};

$window.load(function() {
	var $userIDInputField = $('#BulletPointHomeUserIDInputField');
	var $userIDUpdate = $('#BulletPointHomeUserIDUpdate');
	$userIDUpdate.click(function(event) {
		var val = $userIDInputField.val().trim();
		if(val != '' && userIDIsValid(val))
			setCookie('BulletPointUserID', val);
	});
});

</script>