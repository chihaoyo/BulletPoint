
var serverAddress = 'http://50.18.115.212/bulletpoint/server/';
var getNodesFromServer = function() {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		console.log(xhr.readyState);
		if (xhr.readyState == 4) {
			var jsonRecordFromServer = JSON.parse(xhr.responseText);
			if (jsonRecordFromServer) {
				console.log(jsonRecordFromServer);
				//drawSVG();
				drawSVG(jsonRecordFromServer);
				/*
				jsonRecordFromServer.forEach(function(node) {
					console.log(node["user_id"] + "//" + node["url"] + "//" + node["comment"]);
					drawOneNode(nodeRecordToSVGNode(node));
					});
				//console.log(nodeRecordToSVGNode(jsonRecordFromServer[0]));
				//drawOneNode(nodeRecordToSVGNode(jsonRecordFromServer[0]));
				//console.log("byteCount test:" + byteCount("今天 天23氣真4好5@@"));
				*/
			}
		}
	};
	var getAllNodesURL = serverAddress + 'Nodes/all';
	xhr.open('GET', getAllNodesURL, true);
	xhr.send();
};

var byteCount = function(s) {
    return encodeURI(s).split(/%(?:u[0-9A-F]{2})?[0-9A-F]{2}|./).length - 1;
};
var shortString = function(longString, byteLimit) {
	var charCount = 0;
	for (; charCount < longString.length; charCount++) {
		if (byteCount(longString.substring(0,charCount)) > byteLimit) {
			break;
		}
	}
	var returnText = longString.substring(0,charCount);
	if(byteCount(longString) > byteLimit) {
		returnText += '\t...';
	}
	return returnText;
};