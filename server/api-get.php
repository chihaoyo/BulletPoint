<?php

// $table cannot be in $p
function get_all($db, $table) {
	$q = "SELECT * FROM $table WHERE 1";
	return $db->fa($q);
}
function get($db, $table, $serial) {
	$q = "SELECT * FROM $table WHERE serial = :serial";
	$p = array('serial' => $serial);
	return $db->f1($q, $p);
}

?>