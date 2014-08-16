<?php

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///// DATABASE OBJECT ///////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class _DO extends PDO {
	// basic functions for query
	public function q($sql) {
		return ($this->query($sql) !== false ? true : false);
	}
	public function qa($sql) { // deprecated
		return $this->qfa();
	}
	public function qf($sql) {
		return $this->query($sql)->fetch(PDO::FETCH_ASSOC);
	}
	public function qfa($sql) {
		return $this->query($sql)->fetchAll(PDO::FETCH_ASSOC);
	}
	public function e($string) {
		return substr($this->quote($string), 1, -1);
	}
	
	// prepare and execute
	public function f1($sql, $parameters = array()) {
		$statement = $this->prepare($sql);
		$statement->execute($parameters);
		return $statement->fetch(PDO::FETCH_ASSOC);
	}
	public function fa($sql, $parameters = array()) {
		$statement = $this->prepare($sql);
		$statement->execute($parameters);
		return $statement->fetchAll(PDO::FETCH_ASSOC);
	}
	public function q1($sql, $parameters = array()) {
		$statement = $this->prepare($sql);
		return $statement->execute($parameters);
	}

	// packaged functions
	public function delete_table($table) {
		$this->q("DROP TABLE IF EXISTS $table");
	}
	public function empty_table($table) {
		$this->q("TRUNCATE $table");
		$this->q("ALTER TABLE $table AUTO_INCREMENT = 1");
	}
	public function create_table($name, $fields) {
		$sql = "CREATE TABLE IF NOT EXISTS $name (serial INT(32) NOT NULL AUTO_INCREMENT, PRIMARY KEY (serial),";
		$field_strings = array();
		foreach($fields as $key => $properties) {
			$field_strings[] = "$key $properties";
		}
		$sql .= implode(', ', $field_strings) . ')';
		$this->q($sql);
	}
	public function overwrite_table($name, $fields) {
		$this->delete_table($name);
		$this->create_table($name, $fields);
		$this->empty_table($name);
	}
	public function table_exists($table_name) {
		$result = $this->qf('SELECT database()');
		$db_name = $result['database()'];
		$result = $this->qf("SELECT * FROM information_schema.TABLES WHERE TABLE_SCHEMA = '$db_name' AND TABLE_NAME = '$table_name'");
		if($result !== false)
			$result = true;
			
		return $result;
	}
}

// factory
function connect_to_db($db_name = '') {
	global $__app;
	global $__db;
	
	if($db_name == '' && isset($__app['name']))
		$db_name = $__app['name'];
	
//	___($db_name);
	
	$db = false;
	if($db_name != '') {
/*		try {
			$db = new _DO("mysql:host=localhost;dbname=$db_name", $__db['user'], $__db['password'], array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES UTF8"));
		}
		catch (PDOException $e) {
			___('Could not connect to database: ' . $e->getMessage());
		}*/
		$db = new _DO("mysql:host=localhost;dbname=$db_name", $__db['user'], $__db['password'], array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES UTF8"));
	}
	return $db;
}
function make_db($db_name) { // deprecated
	return connect_to_db($db_name);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///// INITIALIZATIONS ///////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function create_db($db_name) {
	global $__db;
		
	$handler = false;
	try {
		$handler = new _DO("mysql:host=localhost", $__db['user'], $__db['password'], array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES UTF8"));
	}
	catch (PDOException $e) {
		___('Could not connect to mysql: ' . $e->getMessage());
	}
	
	$sql = "CREATE DATABASE $db_name DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;";
	$result = $handler->exec($sql);
	$handler = null;
	
	init_table_session_in_db($db_name);
	init_table_member_in_db($db_name);
}

function init_table_session_in_db($db_name) {
	$db = connect_to_db($db_name);
	
	$db->q('DROP TABLE IF EXISTS session');
	$sql = 'CREATE TABLE IF NOT EXISTS session (
		session_id VARCHAR(128) NOT NULL,
		access_time INT(16) NOT NULL,
		data TEXT NOT NULL,
		PRIMARY KEY (session_id));';
	$db->q($sql);
	$db = null;
}

function init_table_member_in_db($db_name) {
	$db = connect_to_db($db_name);
	
	$db->q('DROP TABLE IF EXISTS member');
	$sql = 'CREATE TABLE IF NOT EXISTS member (
		serial INT(16) NOT NULL AUTO_INCREMENT,
		id VARCHAR(256) NOT NULL,
		password VARCHAR(256) NOT NULL,
		permission VARCHAR(256) NOT NULL,
		last_name TEXT NOT NULL,
		first_name TEXT NOT NULL,
		first_name_first TINYINT(1) NOT NULL,
		email VARCHAR(256) NOT NULL,
		phone VARCHAR(256) NOT NULL,
		PRIMARY KEY (serial)) AUTO_INCREMENT = 1;';
	$db->q($sql);
	$db->q("INSERT INTO member(id, password, permission, last_name, first_name, first_name_first, email, phone) VALUES ('chihaoyo', 'ch', 'root', '游', '知澔', 0, 'chihaoyo@gmail.com', '+886912345678')");
	$db = null;
}

?>