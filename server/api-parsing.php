<?php

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
				$tags[] = $match[1];
			}
		}
	}
	
	return $tags;
}

?>