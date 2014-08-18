var serverAddress = 'http://50.18.115.212/bulletpoint/server/';

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

// get id from storage
getStorage('BulletPointID', function(result) {
	if(result.BulletPointID === undefined) {
		BulletPointID = '@' + makeRandomString(16);
		setID(BulletPointID);
	}
	else if(result.BulletPointID.indexOf('@') == -1) {
		BulletPointID = '@' + result.BulletPointID;
		setID(BulletPointID);
	}
	else
		BulletPointID = result.BulletPointID;
});

var postToServer = function(comment) {
	// get values ready
	var user_id = BulletPointID;
	var url = window.location.href;
	var title = document.title.trim();

	// create HTTP request and get it ready
	var xhr = new XMLHttpRequest();
	var postURL = serverAddress + 'Nodes';
	xhr.open('POST', postURL, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4) {
			var result = xhr.responseText;
			// feedback
			setDialogStatus(result == 'duplicate' ? 'warning' : 'ok');
			setTimeout(removeDialog, 1000);
		}
	};

	// create parameter string
	var parameters = 'user_id=' + user_id + '&url=' + url + '&title=' + title + '&comment=' + comment;
	console.log("POST: '" + parameters + "'");

	// send request
	xhr.send(parameters);
};

var getFromServer = function() {
	// get user information and the current url
	var user_id = BulletPointID;
	var url = window.location.href;

	// create HTTP request and get the comment information from the server, if it exists
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
    	if (xhr.readyState == 4) {
    		var dialog = document.getElementById('BulletPointWrapper');
    		var jsonRecordInServer = JSON.parse(xhr.responseText);
    		if (jsonRecordInServer) {
    			if(typeof jsonRecordInServer["comment"] !== 'undefined') {
    				var commentBox = document.getElementById('BulletPointComment');
					commentBox.value = jsonRecordInServer["comment"];
    			}
    		}
    	}
    }
    var getInfoURL = serverAddress + '/Nodes/' + user_id + '/' + md5(url);
    xhr.open('GET', getInfoURL, true);
	xhr.send(null);
};


var removeDialog = function() {
	var dialog = document.getElementById('BulletPointWrapper');
	if(dialog != null) {
		dialog.parentNode.removeChild(dialog);
	}
};
var setDialogStatus = function(status) {
	var dialog = document.getElementById('BulletPointWrapper');
	if(dialog != null) {
		dialog.setAttribute('status', status);
	}
};

var activate = function() {
	if(BulletPointID == '') {
		BulletPointID = '@' + makeRandomString(16);
		setID(BulletPointID);
	}
	console.log('BulletPointID: ' + BulletPointID);

	var body = document.getElementsByTagName('body')[0];

	// remove old dialog
	removeDialog();

	// create new dialog
	var dialog = document.createElement('div');
	dialog.setAttribute('id', 'BulletPointWrapper');
	var displayMessage = 'Type in comment, RETURN to submit.';
	dialog.innerHTML = '<div class="padding"><textarea class="row" id="BulletPointComment" placeholder="' 
						+ displayMessage 
						+ '"></textarea><p class="row"  id="BulletPointID">' 
						+ BulletPointID 
						+ '</p></div>';
	dialog.addEventListener('keydown', function(event) {
		//user press "escape"(27)
		//escape the tagging input without posting anything
		if(event.keyCode == 27)
			removeDialog();
	});

	// check if this page is already recorded in the server
	getFromServer();

	// append dialog to DOM
	body.appendChild(dialog);

	// initialize input box
	var commentBox = document.getElementById('BulletPointComment');
	commentBox.addEventListener('keypress', function(event) {
		//user press "enter/return"(13)
		//post the page info to the server along with the comment
		if(event.keyCode == 13) {
			postToServer(commentBox.value);
			event.preventDefault();
		}
	});

	// focus input box
	commentBox.focus();
//	commentBox.value = '';
//	commentBox.value = '#';
	// put cursor to the end of default value
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