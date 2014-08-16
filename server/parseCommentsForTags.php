<?php

include_once('importer.php');

$db = connect_to_db();
$nodes = $db->fa('SELECT * FROM Nodes');

foreach($nodes as $node) {
	$node_id = $node['serial'];
	$comment = $node['comment'];
	if($comment == '')
		continue;
	
	$words = explode(" ", $comment);
	___($words);
	//then scan through all words
	foreach ($words as $word) {
		//if there are any words start with '#', it is a tag.
		if ($word{0} == '#') {
			//for each tag, check if it's already created by any users
			$tag_id = -1;
			$tags_q = 'SELECT * FROM Tags WHERE tag = :tag';
			$tags_p = array('tag' => $word);
			$tags_r = $db->fa($tags_q, $tags_p);
			if(count($tags_r) == 0) {
				//if not, then add this tag to the tag list first
				$tags_q = 'INSERT INTO Tags(tag) VALUES (:tag)';
				//$tags_p = array('tag' => $word);
				$tags_r = $db->q1($tags_q, $tags_p);
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
			$tags_r = $db->q1($tags_q, $tags_p);
		}
	}
}

?>