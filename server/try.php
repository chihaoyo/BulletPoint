<?php

include_once('importer.php');

function try_http_request() {
	$url = 'http://chihaoyo.me/bulletpoint/server/Nodes';
	$cols = array(
		'user_id' => '@A3OuwpjHocqPD2zC', 
		'url' => 'http://www.w3c.org/', 
		'title' => 'W3C', 
		'comment' => '#standardization of the web is here'
	);
	$q = http_build_query($cols);
	
	$c = curl_init();
	curl_setopt($c, CURLOPT_URL, $url);
	curl_setopt($c, CURLOPT_POST, count($cols));
	curl_setopt($c, CURLOPT_POSTFIELDS, $q);
	
	$r = curl_exec($c);
	___($r);
	
	curl_close($c);
}

function try_find_tags($str) {
	___($str);
	$special_chars = ',.()[]{}\'"“”‘’?!<>:;/\\';
	$ending_chars = '\s\0\x0B' . preg_quote($special_chars, '/') . '，。：；？！「」『』〈〉《》';
//	$pattern = '/[' . $ending_chars . ']+/iu';
//	___($pattern);
//	___(preg_split($pattern, $str));
	
	$pattern = '/#[^' . $ending_chars . ']+/iu'; // i: case-insensitive, u: support for UTF-8
	___($pattern);
	preg_match_all($pattern, $str, $matches);
	___($matches[0]);
}

try_find_tags('Type in your comment, #tag, RETURN to #save. 這句話用的是 #中文。');
try_find_tags('没有#可口可乐(Coca-Cola)，也没有#麦当劳(McDonald’s)，但也没人忍饥#挨饿：「大企業#去死」');

?>