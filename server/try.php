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
	$segments = preg_split('/([#\s\0\xB]{1})/iu', $str, -1, PREG_SPLIT_DELIM_CAPTURE);
//	___($segments);
	
	$A = preg_quote(',()[]{}\'"“”‘’?!;/\\|', '/') . '，。、：；？！「」『』〈〉《》／｜＼';
	$B = preg_quote('.:<>', '/');
	
	$tags = array();
	
	for($i = 0; $i < count($segments); $i++) {
		if($segments[$i] == '#') {
			$text = $segments[$i + 1];
			if($text != '') {
				preg_match('/(.+)([' . $B . ']?([' . $A . ']|$))/Uiu', $text, $match);
//				___($match);
				
				$tags[] = $match[1];
			}
		}
	}
	
	___($tags);
}

try_find_tags('#Type in your comment, #tag, # RETURN to #save#a#b #z>b#a:b=c. GUI of BulletPoint uses #d3.js to visualize data.');
try_find_tags('没有#可口可乐(Coca-Cola)，也没有#麦当劳(McDonald’s)，但也没人忍饥#挨饿：「大企業#去死。」#z>b#利大於弊#a.b.c');

?>