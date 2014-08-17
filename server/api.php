<?php

include_once('importer.php');
include_once('api-get.php');

require 'Slim/Slim.php';
\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();
$app->get('/:table/:id', function($table, $id) use ($app) {
	if($id == 'all') {
		___("get all $table")
	}
	else if(is_numeric($id) && intval($id) > 0) {
		$id = intval($id);
		___("get $table #$id";
	}
	else {
		$app->notFound();
	}

});
$app->post('/:table', function($table) use ($app) {
	___("post to $table" . 's');
	$parameters = $app->request->post();
	___($parameters);
});
$app->delete('/$table/:id', function($table, $id) use ($app){
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