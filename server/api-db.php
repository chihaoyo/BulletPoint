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
	),
	'MapNodes' => array(
		'cols' => array(
			'serial' => ':serial',
			'type' => ':type',
			'name' => ':name',
			'owner' => ':owner',
			'data' => ':data'
		),
		'required_cols' => array('type', 'name'),
		'unique_key_cols' => array() //array('type', 'name', 'owner')
	),
	'MapEdges' => array(
		'cols' => array(
			'serial' => ':serial',
			'type' => ':type',
			'name' => ':name',
			'fromNode' => ':fromNode',
			'toNode' => ':toNode',
			'owner' => ':owner',
			'data' => ':data'
		),
		'required_cols' => array('fromNode', 'toNode'),
		'unique_key_cols' => array() // array('type', 'name', 'fromNode', 'toNode', 'owner')
	)
);

function db_structure_all_tables() { global $db_structure; return array_keys($db_structure); }

// check
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

// select
function select_all($db, $table) {
	$q = "SELECT * FROM $table WHERE 1"; // $table cannot be in $p
	return $db->fa($q);
}
function select($db, $table, $serial) {
	$q = "SELECT * FROM $table WHERE serial = :serial";
	$p = array('serial' => $serial);
	return $db->f1($q, $p);
}
function select_node($db, $user_id, $url_hash = null) {
	$q = "SELECT * FROM Nodes WHERE user_id = :user_id"; //" AND url_hash = :url_hash" : '');
	$p = array('user_id' => $user_id); //, 'url_hash' => $url_hash);
	
	if($url_hash != null) {
		$q .= " AND url_hash = :url_hash";
		$p['url_hash'] = $url_hash;
		return $db->f1($q, $p);
	}
	
	return $db->fa($q, $p);
}

// insert OR update
define('DB_UNDEFINED', false);
define('DB_UPDATE', 'UPDATE');
define('DB_INSERT', 'INSERT');
function write($db, $table, $data) {
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
	
	// do it
	$r = ($db->q1($q, $data) !== false ? $db->lastInsertId() : false);
	if($r !== false) {
		$r = $db->f1("SELECT * FROM $table WHERE serial = :serial", array('serial' => $r));
	}
	return $r;
}

// delete
function delete($db, $table, $serial) {
	$q = "SELECT * FROM $table WHERE serial = :serial";
	$p = array('serial' => $serial);
	$r = $db->f1($q, $p);
	
	$q = "DELETE FROM $table WHERE serial = :serial";
//	$p = array('serial' => $serial);
	return ($db->q1($q, $p) ? $r : false);
}
function delete_node_tag_pairs_on_node($db, $node_id) {
	$q = "DELETE FROM NodeTagPairs WHERE node_id = :node_id";
	$p = array('node_id' => $node_id);
	return $db->q1($q, $p);
}

?>