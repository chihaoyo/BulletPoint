<pre>
<?php

include_once('importer.php');

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

?>
</pre>