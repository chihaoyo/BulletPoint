<?php

function is_user_id($str) {
	$format = '/^@[0-9A-F]{8}-[0-9A-F]{4}-[1-5][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/';
	return (preg_match($format, $str) === 1);
}

function find_tags($str) {
	$segments = preg_split('/([#\s\0\xB]{1})/iu', $str, -1, PREG_SPLIT_DELIM_CAPTURE);
	
	$A = preg_quote(',()[]{}\'"“”‘’?!;/\\|', '/') . '，。、：；？！「」『』〈〉《》／｜＼';
	$B = preg_quote('.:<>', '/');
	
	$tags = array();
	for($i = 0; $i < count($segments); $i++) {
		if($segments[$i] == '#' && $i + 1 < count($segments)) {
			$text = $segments[$i + 1];
			if($text != '') {
				preg_match('/(.+)([' . $B . ']?([' . $A . ']|$))/Uiu', $text, $match);				
				$tags[] = '#' . $match[1];
			}
		}
	}
	
	return $tags;
}

?>