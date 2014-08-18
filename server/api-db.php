<?php

$db_structure = array(
	'Nodes' => array(
		'cols' => array(
			'serial' => ':serial',
			'user_id' => ':user_id', 
			'url_hash' => ':url_hash',
			'url' => ':url', 
			't_create' => ':now', 
			't_update' => ':now', 
			'title' => ':title',
			'comment' => ':comment'
		), 
		'required_cols' => array('user_id', 'url', 'title', 'comment'), 
		'unique_key_cols' => array('user_id', 'url_hash')
	), 
	'Edges' => array(), 
	'Tags' => array(
		'cols' => array(
			'serial' => ':serial', 
			'tag' => ':tag'
		),
		'required_cols' => array('tag'),
		'unique_key_cols' => array('tag')
	), 
	'NodeTagPairs' => array(
		'cols' => array(
			'serial' => ':serial', 
			'node_id' => ':node_id',
			'tag_id' => ':tag_id'
		),
		'required_cols' => array('node_id', 'tag_id'),
		'unique_key_cols' => array('node_id', 'tag_id')
	)
);

function db_structure_all_tables() { global $db_structure; return array_keys($db_structure); }

function table_exists($table) {
	return in_array($table, db_structure_all_tables());
}
function has_all_required_cols($table, $data) {
	global $db_structure;
	
	$data_cols = array_keys($data);
	$required_cols = $db_structure[$table]['required_cols'];
	return count($required_cols) == count(array_intersect($required_cols, $data_cols));
}
function has_serial_col($table, $data) {
	return isset($data['serial']);
}
function has_unique_key_cols($table, $data) {
	global $db_structure;
	
	$data_cols = array_keys($data);
	$unique_key_cols = $db_structure[$table]['unique_key_cols'];
	return count($unique_key_cols) > 0 && count($unique_key_cols) == count(array_intersect($unique_key_cols, $data_cols));
}

// $table cannot be in $p
function select_all($db, $table) {
	$q = "SELECT * FROM $table WHERE 1";
	return $db->fa($q);
}
function select($db, $table, $serial) {
	$q = "SELECT * FROM $table WHERE serial = :serial";
	$p = array('serial' => $serial);
	return $db->f1($q, $p);
}
function select_node($db, $user_id, $url_hash) {
	$q = "SELECT * FROM Nodes WHERE user_id = :user_id AND url_hash = :url_hash";
	$p = array('user_id' => $user_id, 'url_hash' => $url_hash);
	return $db->f1($q, $p);
}
define('DB_UNDEFINED', false);
define('DB_UPDATE', 'UPDATE');
define('DB_INSERT', 'INSERT');
function write($db, $table, $data) {
//	___("write to $table");
//	___($data);
	global $db_structure;
	
	$cols_to_insert = $db_structure[$table]['cols'];
	
	// update or insert based on data received
	$action = DB_UNDEFINED;
	if(has_serial_col($table, $data))
		$action = DB_UPDATE;
	else if(has_all_required_cols($table, $data))
		$action = DB_INSERT;
	else if(has_unique_key_cols($table, $data))
		$action = DB_UPDATE;
	
	// modify cols according to action
	if($action == DB_INSERT)
		unset($cols_to_insert['serial']);
	else if($action == DB_UPDATE)
		$cols_to_insert = array_merge(array_intersect_key($cols_to_insert, $data), array_intersect_key($cols_to_insert, array('t_update' => true)));
	else
		return false;
	
	// add additional data
	if(isset($data['url']))
		$data['url_hash'] = md5($data['url']);
	$data['now'] = time();
	
	// prepare SQL for INSERT
	$q = "INSERT INTO $table(" . implode(', ', array_keys($cols_to_insert)) . ') VALUES (' . implode(', ', array_values($cols_to_insert)) . ') ';
	
	// prepare SQL for UPDATE
	$cols_to_update = array_diff_key($cols_to_insert, array('t_create' => true)); // t_create should never be updated
	if(!function_exists('map_key_val_to_pair')) {
		function map_key_val_to_pair($key, $val) { return "$key = $val"; }
	}
	$pairs_to_update = array_map('map_key_val_to_pair', array_keys($cols_to_update), array_values($cols_to_update));
	
	$q .= 'ON DUPLICATE KEY UPDATE serial = LAST_INSERT_ID(serial), ' . implode(', ', $pairs_to_update);
	
//	___($action);
//	___($q);
//	___($data);
	
	// do it
	return ($db->q1($q, $data) !== false ? $db->lastInsertId() : false);
}
function delete($db, $table, $serial) {
	$q = "DELETE FROM $table WHERE serial = :serial";
	$p = array('serial' => $serial);
	return $db->q1($q, $p);
}
function delete_node_tag_pairs_on_node($db, $node_id) {
	$q = "DELETE FROM NodeTagPairs WHERE node_id = :node_id";
	$p = array('node_id' => $node_id);
	return $db->q1($q, $p);
}

//include_once('importer.php');
//$db = connect_to_db();
//___(write($db, 'Nodes', array('user_id'=>'@0', 'url'=>'http://a.b.c/', 'title'=>'X', 'comment'=>'xxx')));
//___(write($db, 'Nodes', array('serial'=>139, 'comment'=>'ggg')));
//___(write($db, 'Nodes', array('user_id'=>'@0', 'url_hash'=>'8c3dd945ba85b616beb17a71d9305851', 'comment'=>'kkk')));
//___(write($db, 'Nodes', array('user_id'=>'@0', 'url_hash'=>'8c3dd945ba85b616beb17a71d9305851', 'url'=>'http://a.b.c/', 'title'=>'Q', 'comment'=>'qqq')));
//___(write($db, 'Tags', array('tag'=>'#aaa')));
//___(write($db, 'Tags', array('serial'=>525, 'tag'=>'#bbb')));

//___('done');

?>