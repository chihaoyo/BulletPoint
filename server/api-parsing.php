<?php

function find_tags($str) {
	$special_chars = ',.()[]{}\'"“”‘’?!<>:;/\\|';
	$ending_chars = '\s\0\x0B' . preg_quote($special_chars, '/') . '，。、：；？！「」『』〈〉《》／｜＼';
	$pattern = '/#[^' . $ending_chars . ']+/iu'; // i: case-insensitive, u: support for UTF-8
	
	preg_match_all($pattern, $str, $matches);
	return $matches[0];
}

?>