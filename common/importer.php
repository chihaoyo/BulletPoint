<?php

// providing information regarding file system
//echo '<pre>' . print_r($_SERVER, 1) . '</pre>';
//$__root = $_SERVER['DOCUMENT_ROOT'];//'/var/www/html';
//set_include_path(get_include_path() . PATH_SEPARATOR . $__root . PATH_SEPARATOR . "$__root/common" . PATH_SEPARATOR);
//echo '<pre>' . get_include_path() . '</pre>';
// options
/*
ini_set('auto_detect_line_endings', true);
*/

// detecting app directory
function __dir_to_app_name() {
	$x = $_SERVER['SCRIPT_NAME'];
	$x = (substr($x, 0, 1) == '/' ? substr($x, 1) : $x);
	$x = explode('/', $x);
	$x = (is_array($x) && count($x) > 0 ? (substr($x[0], 0, 1) == '~' ? $x[1] : $x[0]) : 'default');
	
	return $x;
}

// setting up parameter and variables for app
$__db = array('user' => 'root', 'password' => '/*gr0w1ng*/');
$__app = array('name' => __dir_to_app_name(), 'root' => 'chihaoyo', 'timezone' => 'America/New_York', 'is_debugging' => true);

// libs
include_once('lib-misc.php');
include_once('lib-db.php');

//init_table_session_in_db($__app['name']);
//include_once('lib-session.php');

?>