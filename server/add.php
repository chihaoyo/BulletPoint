<?php

include_once('importer.php');

$user_id = $_POST['user_id'];
$url = $_POST['url'];
$title = $_POST['title'];
$comment = $_POST['comment'];
$now = time();

$db = connect_to_db();
$q = 'SELECT * FROM nodes WHERE user_id = :user_id AND url = :url';
$p = array('user_id' => $user_id, 'url' => $url);
$r = $db->fa($q, $p);

if(count($r) > 0) {
	$r = false;
}
else {
	$q = 'INSERT INTO nodes(user_id, url, t_create, t_update, title, comment) VALUES(:user_id, :url, :now, :now, :title, :comment)';
	$p = array('user_id' => $user_id, 'url' => $url, 'now' => $now, 'title' => $title, 'comment' => $comment);

	$r = $db->q1($q, $p);
}

if($r === true) {
	echo $db->lastInsertId();
}
else {
	echo 'duplicate';
}

?>