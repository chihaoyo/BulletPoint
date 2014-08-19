var serverAddress = 'http://50.18.115.212/bulletpoint/server/';
var isHome = function() {
	return (location.href.match(serverAddress) != null);
};

var commentBoxOriginalMessage = '';

var makeUserID = function() {
	return '@' + uuid.v4().toUpperCase();
};

var getCookie = function(name) {
	var regex = new RegExp(name + '=([^;]+)');
	var value = regex.exec(document.cookie);
	return ((value != null) ? unescape(value[1]) : null);
};
var setCookie = function(name, val, daysToExpire) {
	if(!isHome())
		return;

	if(daysToExpire === undefined)
		daysToExpire = 3650; // ten years
	console.log('Set ' + name + ' to ' + val + ' in cookie');

	var d = new Date();
	d.setTime(d.getTime() + daysToExpire*24*3600*1000);
	document.cookie = name + '=' + val + '; expires=' + d.toGMTString();
};

// chrome storage manipulation
var setStorage = function(pairs, callback) {
	chrome.storage.sync.set(pairs, callback);
};
var getStorage = function(key, callback) {
	chrome.storage.sync.get(key, callback);
};
var setStorageUserID = function(id) {
	console.log('Set UserID to ' + id + ' in storage')
	setStorage({BulletPointUserID: id}, function() {
		console.log('Chrome storage updated');
	});
};

// user id
var BulletPointUserID = '';
// init id
var initUserID = function() {
	getStorage('BulletPointUserID', function(result) { // get ID from storage
		var idCookie = getCookie('BulletPointUserID');
		var idStorage = result.BulletPointUserID;
		var id = null;

		if(idCookie != null) {
			id = idCookie;
			setStorageUserID(idCookie);
		}
		else {
			if(idStorage !== undefined) {
				setCookie('BulletPointUserID', idStorage);
				id = idStorage;
			}
			else {
				id = makeUserID();
				setStorageUserID(id);
				setCookie('BulletPointUserID', id);
			}
		}
		BulletPointUserID = id;
		console.log('BulletPointUserID is ' + BulletPointUserID);
	});
};
initUserID();

var postToServer = function(comment) {
	// get values ready
	var user_id = BulletPointUserID;
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
	var user_id = BulletPointUserID;
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
};

var showStatusMessage = function(status, statusMessage, timeOutLimit) {
	if(timeOutLimit === undefined) {
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
						+ '"></textarea><p class="fullWidth row"  id="BulletPointUserID">' 
						+ BulletPointUserID 
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