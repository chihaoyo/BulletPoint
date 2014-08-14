<?php

include_once('importer.php');

$user_id = $_POST['user_id'];
$url = $_POST['url'];
$title = $_POST['title'];
$tags = $_POST['tags'];
$now = time();

$db = connect_to_db();
$q = 'SELECT * FROM nodes WHERE user_id = :user_id AND url = :url';
$p = array('user_id' => $user_id, 'url' => $url);
$r = $db->fa($q, $p);

if(count($r) > 0) {
	$r = false;
}
else {
	$q = 'INSERT INTO nodes(user_id, url, t_create, t_update, title, tags) VALUES(:user_id, :url, :now, :now, :title, :tags)';
	$p = array('user_id' => $user_id, 'url' => $url, 'now' => $now, 'title' => $title, 'tags' => $tags);

	$r = $db->q1($q, $p);
}

if($r === true) {
	echo $db->lastInsertId();
}
else {
	echo 'duplicate';
}

?>