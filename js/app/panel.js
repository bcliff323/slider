define(["../lib/Modernizr", "../lib/swipe", "lib/pubsub"], function() {
        
		var Panel = function(panel) {
			var self = this,
				panelElement = panel || null,
				panelMargin = parseInt(panelElement.css('margin-left').replace('px',''))*2,
				width = parseInt(panelElement.css('width').replace('px','')) + panelMargin,
				index = 0,
				xCoord = 0;

			function toPosition(obj) {
				var position = obj.pos,
					distance = ((index+1) - position) * width;

				panelElement
					.css('left', distance);

				xCoord = distance;
			}

			function shuffle(dir) {
				if (dir === 'prepend') {
					panelElement
						.css('left', width * -2);
					xCoord = width * -2;
				} else if (dir === 'append') {
					panelElement
						.css('left', width * 3);
					xCoord = width * 3;
				}
			}

			function toggle(obj) {
				var direction = obj.direction,
					distance = (direction === 'left') ? (-1 * width) : width; 

				panelElement
					.animate({
						'left': xCoord+distance
					}, 500, function(){
						xCoord += distance;

						if (xCoord < -(width*2)) {
							shuffle('append');
						} else if (xCoord > (width*3)) {
							shuffle('prepend');
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

                $.subscribe("/toggle/direct", function(event, p) {
                    toPosition({ pos: p });
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