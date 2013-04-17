define(["../lib/Modernizr", "../lib/swipe", "lib/pubsub"], function() {
        
		var Panel = function(panel) {
			var self = this,
				panelElement = panel || null,
				panelMargin = parseInt(panelElement.css('margin-left').replace('px',''))*2,
				width = parseInt(panelElement.css('width').replace('px','')) + panelMargin,
				index = 0,
				xCoord = 0,
				position = 0,
				bgImage = '';

			function numSiblings() {
				return panelElement.parent().children().length;
			}

			function loadBackground() {
				var imgPath = bgImage,
					img = new Image();

				img.src = imgPath;

				if (panelElement.hasClass('active')) {
					$.publish("/image/loaded", { 
						element: panelElement, 
						path: bgImage, 
						loadIndex: index+3,
						skipFade: true
					});
				} else {
					$(img).load(function(){
						$.publish("/image/loaded", { 
							element: panelElement, 
							path: bgImage, 
							loadIndex: index+3,
							skipFade: false
						});
					});
				}
			}

			function shuffle(obj) {
				if (obj.direction === 'append') {
					xCoord = width*(obj.pos+obj.n); 
				} else if (obj.direction === 'prepend') {
					xCoord = width*(-(obj.n - obj.pos)); 
				}

				panelElement
					.css('left', xCoord);

				position = (xCoord/width);
			}

			function toPosition(obj) {
				var siblings = numSiblings(),
					xDelta = obj.pos,
					distance = ((xCoord/width) - (xDelta-1)) * width;

				panelElement
					.css('left', distance);

				xCoord = distance;

				if ((xCoord/width) < -2) {
					shuffle({ 
						pos: (xCoord/width), 
						n: siblings,
						direction: 'append'
					});
				}

				if (xCoord === 0) {
					panelElement
						.addClass('active');
				}

			}

			function toggle(obj) {
				var siblings = numSiblings(),
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
				if (!panelElement.is(':animated')) {
					$.publish("/toggle/stopTimer");
					$.publish("/toggle/next");
				}
			}

			function prev() {
				if (!panelElement.is(':animated')) {
					$.publish("/toggle/stopTimer");
					$.publish("/toggle/prev");
				}
			}

			function bindTouchEvents(element) {
				element
					.swipeEvents()
					.bind("swipeLeft",  next )
					.bind("swipeRight", prev );
			}

			function setXPosition(pos) {
				xCoord = pos;
				position = xCoord/width;
				panelElement
					.css('left', pos);
			}

			function getIndex() {
				return index;
			}

			function init(config) {
				index = config.index;
				xCoord = index*width;
				bgImage = panelElement.attr('data-background');
				setXPosition(xCoord);
				if (Modernizr.touch) {
					bindTouchEvents(panelElement);
				}
				subscribe();

				if (typeof bgImage !== 'undefined') {
					loadBackground();
				}
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