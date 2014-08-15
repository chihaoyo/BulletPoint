var setCookie = function(key, val, exp) {
	if(val == '') {
		exp = -365; // last year
	}
	else if(exp === undefined) {
		exp = 365*1000; // 1,000 years // not 'Fri, 31 Dec 9999 23:59:59 GMT'
	}

	var d = new Date();
	d.setTime(d.getTime() + exp*24*60*60*1000);

	document.cookie = key + '=' + val + '; expires=' + d.toGMTString();
};
var getCookie = function(key) {
	key += '=';

	var val = '';
	var cookies = document.cookie.split(';');
	for(var i = 0; i < cookies.length; i++) {
		var pair = cookies[i].trim();
		if(pair.indexOf(key) >= 0) {
			val = pair.substring(key.length, pair.length);
			break;
		}
	}
	return val;
};
var BulletPointID = getCookie('BulletPointID');
if(BulletPointID == '')
	console.log('BulletPointID not available');
else
	console.log('BulletPointID: ' + BulletPointID);

var postToServer = function(tags) {
	// get values ready
	var user_id = 'master';
	var url = window.location.href;
	var title = document.title.trim();

	// create HTTP request and get it ready
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "http://chihaoyo.me/bulletpoint/server/add.php", true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onreadystatechange = function() {
		console.log(xhr.readyState);

		if(xhr.readyState == 4) {
			var result = xhr.responseText;
			console.log('success');
			console.log(result);
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
