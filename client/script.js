var user_id = 'master';
var url = window.location.href;
var title = document.title.trim();
var xhr = new XMLHttpRequest();
xhr.open("POST", "http://50.18.115.212/bulletpoint/server/add.php", true);
xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
xhr.onreadystatechange = function() {
	if (xhr.readyState == 4) {
		
		var result = xhr.responseText;

		// display result
		// get body
		var body = document.getElementsByTagName('body')[0];

		// clear old bubble
		var bubble = document.getElementById('BulletPointBubble');
		if(bubble != null) {
			bubble.parentNode.removeChild(bubble);
		}

		// make new bubble
		bubble = document.createElement('div');
		bubble.setAttribute('id', 'BulletPointBubble');

		// check response text and style bubble accordingly
		if(result == 'duplicate') {
			bubble.classList.add('red');
			bubble.innerHTML = '<p class="small">Page exist</p><p class="propersition">in</p><p class="big">BulletPoint</p>';
		}
		else if(!isNaN(result)) {
			bubble.classList.add('blue');
			bubble.innerHTML = '<p class="small">Page added</p><p class="propersition">to</p><p class="big">BulletPoint</p>';
		}

		// add bubble to document
		body.appendChild(bubble);

		// set timeout for fade out
		setTimeout(function() {
			bubble.classList.add('hide');
			setTimeout(function() { body.removeChild(bubble); }, 1000);
		}, 2000);
	}
}

// send data to server
console.log('user_id: ' + user_id + ' url: ' + url);
xhr.send('user_id=' + user_id + '&url=' + url + '&title=' + title);