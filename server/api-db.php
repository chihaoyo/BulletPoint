<?php

include_once('importer.php');

$db_structure = array(
	'Nodes' => array('user_id', 'url', 't_create', 't_update', 'title', 'comment'), 
	'Edges', => array(), 
	'Tags', => array('tag'), 
	'NodeTagPairs' => array('node_id', 'tag_id')
);

function db_structure_all_tables() { return array_keys($db_structure); }

function table_exists($table) {
	return in_array($table, db_structure_all_tables());
}
function has_all_required_cols($table, $data) {
	$required_cols = $db_structure[$table];
	$present_cols = array_keys($data);
	$keys_present_in_both = array_intersect($required_cols, $present_cols);
	___($required_cols);
	___($present_cols);
	___($keys_present_in_both);
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
function insert($db, $table, $data) {
	if(!has_all_required_cols($table, $data))
		return false;
}

has_all_required_cols('Nodes', array('user_id'=>0,'url'=>'abc'));

?>