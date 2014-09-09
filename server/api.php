<?php

include_once('../common/importer.php');
include_once('api-db.php');
include_once('api-parsing.php');

require 'Slim/Slim.php';
\Slim\Slim::registerAutoloader();

$db = connect_to_db();

$app = new \Slim\Slim();
$app->get('/:table/:id', function($table, $id) use ($app, $db) {
	// check $table for SQL injection here
	if(!table_exists($table)) {
		$app->notFound();
	}
	else {
		header('Access-Control-Allow-Origin: *'); // enable CORS for GET
		
		if($id == 'all') {
			echo json_encode(select_all($db, $table));
		}
		else if(is_numeric($id) && intval($id) > 0) {
			$id = intval($id);
			echo json_encode(select($db, $table, $id));
		}
		else if($table == 'Nodes' && is_user_id($id)) {
			// get all Nodes from that user
			echo json_encode(select_node($db, $id));
		}
		else {
			$app->notFound();
		}
	}
});
$app->get('/Nodes/:user_id/:url_hash', function($user_id, $url_hash) use ($app, $db)  {
	if(substr($user_id, 0, 1) == '@') {
		echo json_encode(select_node($db, $user_id, $url_hash));
	}
	else {
		$app->notFound();
	}
});
$app->post('/:table', function($table) use ($app, $db) {
	if(!table_exists($table)) {
		$app->notFound();
	}
	else {
		$parameters = $app->request->post();
		$r = write($db, $table, $parameters);

		if($r !== false && $table == 'Nodes' && isset($parameters['comment']) && $parameters['comment'] != '') {
			$node_id = $r;

			// parse comment // add Tags
			$tags = find_tags($parameters['comment']);
			$tag_ids = array();
			foreach($tags as $tag) {
				$tag_ids[] = write($db, 'Tags', array('tag' => $tag));
			}
			if(count($tag_ids) > 0) {
				// delete NodeTagPairs // add NodeTagPairs
				delete_node_tag_pairs_on_node($db, $node_id);
				foreach($tag_ids as $tag_id)
					write($db, 'NodeTagPairs', array('node_id' => $node_id, 'tag_id' => $tag_id));
			}
		}

		echo json_encode($r);
	}
});
$app->delete('/:table/:id', function($table, $id) use ($app, $db){
	if(!table_exists($table)) {
		$app->notFound();
	}
	else {
		if(is_numeric($id) && intval($id) > 0) {
			$id = intval($id);
			echo json_encode(delete($db, $table, $id));
		}
		else {
			$app->notFound();
		}
	}
});
$app->delete('/NodeTagPairs/Node/:node_id', function($table, $id) use ($app, $db){
	if(is_numeric($node_id) && intval($node_id) > 0) {
		$node_id = intval($node_id);
		echo json_encode(delete_node_tag_pair_on_node($db, $node_id));
	}
	else {
		$app->notFound();
	}
});
$app->notFound(function() {
	echo 'false';
});
$app->run();

?>