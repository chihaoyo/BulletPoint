var serverAddress = 'http://50.18.115.212/bulletpoint/server/';

var commentBoxOriginalMessage = '';

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
		console.log('Chrome storage updated');
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
			var commentBox = document.getElementById('BulletPointComment');
			var status = (result == 'duplicate' ? 'warning' : 'ok');
			var statusMessage = 'Saved.';
			if(status == 'warning')
				statusMessage = 'Oops.';
			else if(status == 'error')
				statusMessage = 'Noooooo.';
			showStatusMessage(status, statusMessage); //, commentBox.value);
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
    				//if the comment exists, show it in the context box
    				var commentBox = document.getElementById('BulletPointComment');
    				commentBoxOriginalMessage = jsonRecordInServer["comment"];
					commentBox.value = commentBoxOriginalMessage;
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
};/*
var setDialogStatus = function(status) {
	var dialog = document.getElementById('BulletPointWrapper');
	if(dialog != null) {
		dialog.setAttribute('status', status);
	}
};*/

var showStatusMessage = function(status, statusMessage, timeOutLimit) {
	if(typeof timeOutLimit === 'undefined') {
		timeOutLimit = 1000;
	}

	var dialog = document.getElementById('BulletPointWrapper');
	if(dialog != null) {
		dialog.setAttribute('status', status);
	}

	var commentBox = document.getElementById('BulletPointComment');
	commentBox.classList.add('blurry');

	var statusMessageBox = document.getElementById('statusMessageBox');
	statusMessageBox.innerHTML = '<p class="fullWidth">' + statusMessage + '</p>';
	statusMessageBox.style.display = 'block';

	setTimeout(removeDialog, timeOutLimit);
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
	dialog.setAttribute('status', 'ready');
	dialog.setAttribute('id', 'BulletPointWrapper');
	var displayMessage = 'Type in your comment, # to tag, RETURN to save.';
	dialog.innerHTML = '<div class="padding"><textarea class="fullWidth row" id="BulletPointComment" placeholder="' 
						+ displayMessage 
						+ '"></textarea><p class="fullWidth row"  id="BulletPointID">' 
						+ BulletPointID 
						+ '</p><div id="statusMessageBox"></div></div>';
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
			if(commentBox.value != commentBoxOriginalMessage)
				postToServer(commentBox.value);
			else 
				showStatusMessage('ok', 'Same thing.');
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
	ready = (keyFlags[70] && keyFlags[74]) || (keyFlags[71] && keyFlags[72]) || (keyFlags[68] && keyFlags[75]); // FJ OR GH OR DK
});
document.addEventListener('keyup', function(event) {
	keyFlags[event.keyCode] = false;
	if(ready && ((!keyFlags[70] && !keyFlags[74]) || (!keyFlags[71] && !keyFlags[72]) || (!keyFlags[68] && !keyFlags[75]))) {
		event.stopImmediatePropagation();
		event.preventDefault();
		activate();
	}
});
window.addEventListener('load', function(event) {
	console.log('window loaded');
	var link = document.createElement('link');
	link.href = 'http://fonts.googleapis.com/css?family=Source+Code+Pro:400,700';
	link.rel = 'stylesheet';
	document.getElementsByTagName('head')[0].appendChild(link);
	console.log('CSS injected');
});

console.log('BulletPoint initiated');