chrome.browserAction.onClicked.addListener(function(activeTab) {
    var url = 'http://50.18.115.212/bulletpoint/';
    chrome.tabs.create({url: url});
});