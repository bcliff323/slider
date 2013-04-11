define(["../lib/Modernizr", "../lib/swipe", "lib/pubsub"], function() {
        
		var Swipe = function(panel) {
			var self = this,
				panelElement = panel || null,
				index = 0;

			function getIndex() {
				return index;
			}

			function next() {
				$.publish("/toggle/next");
			}

			function prev() {
				$.publish("/toggle/prev");
			}

			function bindTouchEvents(element) {
				element
					ç
					.bind("swipeLeft",  next )
					.bind("swipeRight", prev );
			}

			function init(config) {
				index = config.index;

				if(Modernizr.touch) {
					bindTouchEvents(panelElement);
				}
			}

			return {
				init: init,
				element: panelElement,
				index: getIndex
			}
		}

		return Swipe;
    }
);