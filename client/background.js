chrome.browserAction.onClicked.addListener(function(tab) {
/*	console.log('Add ' + tab.url + ' to BulletPoint.');	
	chrome.tabs.executeScript({
		code: 'document.body.style.backgroundColor="red"'
	});*/
	chrome.tabs.insertCSS({file: "script.css"});
	chrome.tabs.executeScript({file: "script.js"});
});