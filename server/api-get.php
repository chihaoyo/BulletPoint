<?php

function get_all($db, $table) {
	$q = 'SELECT * FROM :table WHERE 1';
	$p = array('table' => $table);
	return $db->fa($q, $p);
}
function get($db, $table, $serial) {
	$q = 'SELECT * FROM :table WHERE serial = :serial';
	$p = array('table' => $table, 'serial' => $serial);
	return $db->f1($q, $p);
}

?>