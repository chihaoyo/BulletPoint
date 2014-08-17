<?php

include_once('importer.php');

require 'Slim/Slim.php';
\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();
$app->get('/nodes/:id', function($id) use ($app) {
	if($id == 'all') {
		___('get all Nodes');
	}
	else if(is_numeric($id) && intval($id) > 0) {
		$id = intval($id);
		___('get Node #' . $id);
	}
	else {
		$app->notFound();
	}

});
$app->post('/nodes', function() use ($app) {
	___('post to Nodes');
	$parameters = $app->request->post();
	___($parameters);
});
$app->delete('/nodes/:id', function($id) use ($app){
	if(is_numeric($id) && intval($id) > 0) {
		$id = intval($id);
		___('delete Node #' . $id);
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