define(["../lib/Modernizr", "../lib/swipe", "lib/pubsub"], function() {
        
		var Panel = function(panel) {
			var self = this,
				panelElement = panel || null,
				panelMargin = parseInt(panelElement.css('margin-left').replace('px',''))*2,
				width = parseInt(panelElement.css('width').replace('px','')) + panelMargin,
				index = 0,
				xCoord = 0;

			function toggle(obj) {
				var direction = obj.direction,
					distance = (direction === 'left') ? (-1 * width) : width; 
				console.log(index);
				console.log(xCoord);
				panelElement
					.animate({
						'left': xCoord+distance
					}, 500, function(){
						xCoord += distance;

						if (xCoord < -(width*2)) {
							$.publish("/shuffle/append", panelElement);
						} else if (xCoord > (width*3)) {
							$.publish("/shuffle/prepend", panelElement);
						}
					});
			}

			function subscribe() {
				$.subscribe("/toggle/next", function(event) {
                    toggle({ direction: 'left' });
                });

                $.subscribe("/toggle/prev", function(event) {
                    toggle({ direction: 'right' });
                });

                $.subscribe("/toggle/direct", function(event, index) {
                    toggle({ step: index });
                });
			}

			function next() {
				$.publish("/toggle/next");
			}

			function prev() {
				$.publish("/toggle/prev");
			}

			function bindTouchEvents(element) {
				element
					.swipeEvents()
					.bind("swipeLeft",  next )
					.bind("swipeRight", prev );
			}

			function setXPosition(pos) {
				xCoord = pos;
				panelElement
					.css('left', pos);
			}

			function getIndex() {
				return index;
			}

			function init(config) {
				index = config.index;
				setXPosition(index*width);
				if(Modernizr.touch) {
					bindTouchEvents(panelElement);
				}
				subscribe();
			}

			return {
				init: init,
				element: panelElement,
				index: getIndex
			}
		}

		return Panel;
    }
);