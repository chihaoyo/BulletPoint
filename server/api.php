<?php

include_once('importer.php');
include_once('api-get.php');

require 'Slim/Slim.php';
\Slim\Slim::registerAutoloader();

$db = connect_to_db();

$app = new \Slim\Slim();
$app->get('/:table/:id', function($table, $id) use ($app, $db) {
	$table = ucfirst($table);
	
	if($id == 'all') {
		echo json_encode(get_all($db, $table));
	}
	else if(is_numeric($id) && intval($id) > 0) {
		$id = intval($id);
		echo json_encode(get($db, $table, $id));
	}
	else {
		$app->notFound();
	}

});
$app->post('/:table', function($table) use ($app, $db) {
	$table = ucfirst($table);
	
	___("post to $table");
	$parameters = $app->request->post();
	___($parameters);
});
$app->delete('/:table/:id', function($table, $id) use ($app, $db){
	$table = ucfirst($table);
	
	if(is_numeric($id) && intval($id) > 0) {
		$id = intval($id);
		___("delete $table #$id");
	}
	else {
		$app->notFound();
	}
});
$app->notFound(function() {
	___('not available');
});
$app->run();

?>