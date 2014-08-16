<?php

include_once('importer.php');

$user_id = $_POST['user_id'];
$url = $_POST['url'];
$title = $_POST['title'];
$comment = $_POST['comment'];
$now = time();

$db = connect_to_db();
$q = 'SELECT * FROM Nodes WHERE user_id = :user_id AND url = :url';
$p = array('user_id' => $user_id, 'url' => $url);
$r = $db->fa($q, $p);

if(count($r) > 0) {
	$r = false;
}
else {
	//insert a new node
	$q = 'INSERT INTO Nodes(user_id, url, t_create, t_update, title, comment) VALUES (:user_id, :url, :now, :now, :title, :comment)';
	$p = array('user_id' => $user_id, 'url' => $url, 'now' => $now, 'title' => $title, 'comment' => $comment);
	$r = $db->q1($q, $p);

	//deal with comment & tags
	//split the comment by ' '(space) into bunch of words
	$node_id = $db->lastInsertId();
	$words = explode(" ", $comment);
	//then scan through all words
	foreach ($words as $word) {
		//if there are any words start with '#', it is a tag.
		if ($word{0} == '#') {
			//for each tag, check if it's already created by any users
			$tag_id = -1;
			$tags_q = 'SELECT * FROM Tags WHERE tag = :tag';
			$tags_p = array('tag' => $word);
			$tags_r = $db->fa($q, $p);
			if(count($tags_r) == 0) {
				//if not, then add this tag to the tag list first
				$tags_q = 'INSERT INTO Tags(tag) VALUES(:tag)';
				//$tags_p = array('tag' => $word);
				$tags_r = $db->q1($q, $p);
				$tag_id = $db->lastInsertId();
			}
			else
				$tag_id = $tags_r[0]['serial'];
			//now we are sure this tag exists in the system
			//since the current user-url pair doesn't exist in the database before the add.php is called this time,
			//we are sure that this user-url-tag triple doesn't exist in the system for now
			//so we can add it anyway.
			$tags_q = 'INSERT INTO NodeTagPairs(node_id, tag_id) VALUES (:node_id, :tag_id)';
			$tags_p = array('node_id' => $node_id, 'tag_id' => $tag_id);
			$tags_r = $db->q1($q, $p);
		}
	}
}

if($r === true) {
	echo $db->lastInsertId();
}
else {
	echo 'duplicate';
}

?>