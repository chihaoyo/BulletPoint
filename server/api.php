<?php

include_once('importer.php');
include_once('api-db.php');

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
		if($id == 'all') {
			echo json_encode(select_all($db, $table));
		}
		else if(is_numeric($id) && intval($id) > 0) {
			$id = intval($id);
			echo json_encode(select($db, $table, $id));
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
		echo json_encode(write($db, $table, $parameters));
	}
});
$app->delete('/:table/:id', function($table, $id) use ($app, $db){
	if(!table_exists($table)) {
		$app->notFound();
	}
	else {
		if(is_numeric($id) && intval($id) > 0) {
			$id = intval($id);
			___("delete $table #$id");
		}
		else {
			$app->notFound();
		}
	}
});
$app->notFound(function() {
	echo 'false';
});
$app->run();

?>