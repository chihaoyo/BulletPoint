var $window = $(window);
var $document = $(document);

var theUI = {}; // UI constants & parameters
var theCanvas = d3.select('div#canvas svg');
var theElements = null;

var init = function() {
	theUI.viewportW = $window.width();
	theUI.viewportH = $window.height();

	theUI.unitSize = 11.0;
	theUI.fontSize = this.unitSize;
	//theUI.letterW = Math.ceil(theUI.fontSize*0.62);
	theUI.lineH = Math.ceil(theUI.fontSize*1.25);
	theUI.textBoxW = Math.ceil(theUI.fontSize*16.1);
	theUI.textBoxH = Math.ceil(theUI.fontSize*2.31);

	theUI.docW = theUI.viewportW*2; // try
	theUI.docH = theUI.viewportH*2; // try

	theCanvas.attr('width', theUI.viewportW).attr('height', theUI.viewportH);

	theElements = new Collection('//resplendent-fire-8362.firebaseio.com/bulletpoint/Elements',
		// child_added
		function(snapshot) {
			var key = snapshot.name();
			var val = snapshot.val();
			console.log('child_added ' + key);

			this.items[key] = new Element(val);
			theForceField.push(key, val);
		},
		// child_changed
		function(snapshot) {
			var key = snapshot.name();
			var val = snapshot.val();
			console.log('child_changed ' + key);

			this.items[key] = new Element(val);
			theForceField.update(key, val);
		},
		// child_removed
		function(snapshot) {
			var key = snapshot.name();
			var val = snapshot.val();
			console.log('child_removed ' + key);

			delete this.items[key];
			theForceField.remove(key);
		}
	);
};
$window.load(init);