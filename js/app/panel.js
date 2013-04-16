define(["../lib/Modernizr", "../lib/swipe", "lib/pubsub"], function() {
        
		var Panel = function(panel) {
			var self = this,
				panelElement = panel || null,
				panelMargin = parseInt(panelElement.css('margin-left').replace('px',''))*2,
				width = parseInt(panelElement.css('width').replace('px','')) + panelMargin,
				index = 0,
				xCoord = 0,
				position = 0;

			function toPosition(obj) {
				var position = obj.pos,
					distance = ((index+1) - position) * width;

				panelElement
					.css('left', distance);

				xCoord = distance;
			}

			function shuffle(obj) {
				if (obj.direction === 'append') {
					xCoord = width*(obj.pos+obj.n); 
				} else if (obj.direction === 'prepend') {
					xCoord = width*(-(obj.n - obj.pos)); 
				}
				
				panelElement
					.css('left', xCoord);
			}

			function toggle(obj) {
				var siblings = panelElement.parent().children().length,
					direction = obj.direction,
					distance = (direction === 'left') ? (-1 * width) : width; 

				panelElement
					.animate({
						'left': xCoord+distance
					}, 500, function(){
						xCoord += distance;
						position = xCoord/width;

						if (position < -2) {
							shuffle({ 
								pos: position, 
								n: siblings,
								direction: 'append'
							});
						} else if (position >= siblings-2) {
							shuffle({ 
								pos: position,
								n: siblings,
								direction: 'prepend' 
							});
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
				xCoord = index*width;
				setXPosition(xCoord);
				if(Modernizr.touch) {
					bindTouchEvents(panelElement);
				}
				subscribe();
			}

			return {
				init: init,
				element: panelElement,
				index: getIndex,
				toPosition: shuffle
			}
		}

		return Panel;
    }
);