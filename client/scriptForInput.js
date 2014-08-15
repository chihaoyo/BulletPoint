// make random string
function makeRandomString(len) {
    var str = '';
    var charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for(var i = 0; i < len; i++)
        str += charSet.charAt(Math.floor(Math.random() * charSet.length));

    return str;
}

// chrome storage manipulation
var setStorage = function(pairs, callback) {
	chrome.storage.sync.set(pairs, callback);
};
var getStorage = function(key, callback) {
	chrome.storage.sync.get(key, callback);
};

// user id
var BulletPointID = '';
var setID = function(id) {
	setStorage({BulletPointID: id}, function() {
		console.log('Storage updated');
	});
};

getStorage('BulletPointID', function(result) {
	if(result.BulletPointID === undefined) {
		BulletPointID = makeRandomString(16);
		setID(BulletPointID);
	}
	else
		BulletPointID = result.BulletPointID;
});

var postToServer = function(tags) {
	// get values ready
	var user_id = BulletPointID;
	var url = window.location.href;
	var title = document.title.trim();

	// create HTTP request and get it ready
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "http://chihaoyo.me/bulletpoint/server/add.php", true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4) {
			var result = xhr.responseText;
			// feedback
			removeDialog();
		}
	};

	// create parameter string
	var parameters = 'user_id=' + user_id + '&url=' + url + '&title=' + title + '&tags=' + tags;
	console.log("POST: '" + parameters + "'");

	// send request
	xhr.send(parameters);
};
var removeDialog = function() {
	var dialog = document.getElementById('BulletPointWrapper');
	if(dialog != null) {
		dialog.parentNode.removeChild(dialog);
	}
};
var activate = function() {
	if(BulletPointID == '') {
		BulletPointID = makeRandomString(16);
		setID(BulletPointID);
	}
	console.log('BulletPointID: ' + BulletPointID);

	var body = document.getElementsByTagName('body')[0];

	// remove old dialog
	removeDialog();

	// create new dialog
	var dialog = document.createElement('div');
	dialog.setAttribute('id', 'BulletPointWrapper');
	dialog.innerHTML = '<div class="padding"><input type="text" id="BulletPointTags" placeholder="#" /></div>';
	dialog.addEventListener('keydown', function(event) {
		//user press "escape"(27)
		//escape the tagging input without posting anything
		if(event.keyCode == 27)
			removeDialog();
	});

	// append dialog to DOM
	body.appendChild(dialog);

	// initialize input box
	var inputBox = document.getElementById('BulletPointTags');
	inputBox.addEventListener('keypress', function(event) {
		//user press "enter/return"(13)
		//post the page info to the server along with the tags
		if(event.keyCode == 13) {
			postToServer(inputBox.value);
		}
	});

	// focus input box
	inputBox.focus();
	inputBox.value = '';
	inputBox.value = '#';
};

//Initiate the tagging dialog box
//by pressing key "F"(70) + "J"(74)
var keyFlags = {};
var ready = false;
document.addEventListener('keydown', function(event) {
	keyFlags[event.keyCode] = true;
	ready = keyFlags[70] && keyFlags[74];
}, false);
document.addEventListener('keyup', function(event) {
	keyFlags[event.keyCode] = false;
	if(ready && !keyFlags[70] && !keyFlags[74])
		activate();
}, false);

console.log('BulletPoint initiated');
