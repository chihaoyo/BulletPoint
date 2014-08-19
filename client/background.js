chrome.browserAction.onClicked.addListener(function(activeTab) {
    var url = 'http://50.18.115.212/bulletpoint/';
    chrome.tabs.create({url: url});
});
chrome.tabs.onUpdated.addListener(function(tabID, changeInfo, tab) {
	var link = document.createElement('link');
	link.href = 'http://fonts.googleapis.com/css?family=Source+Code+Pro:400,700';
	link.rel = 'stylesheet';
	document.getElementsByTagName('head')[0].appendChild(link);
});