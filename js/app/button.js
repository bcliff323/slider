define(["lib/pubsub"], function() {
        
		var Button = function(element) {
			var self = this,
				element = element || null,
				parent = null,
				direction = '';

			function setDirection(dir) {
				if (direction.length === 0) {
					direction = dir;
				} 
			}

			function subscribe() {
				$.subscribe("/rebindbutton", function(event, dir) {
                    direction = dir;
                    bindEvent();
                });
			}

			function bindEvent() {
				element
					.bind('click', function(){

						if (parent.is(':animated')) { return; }

						if (direction === 'next') {
							$.publish("/toggle/next");
						} else if (direction === 'prev') {
							$.publish("/toggle/prev");
						}
					});
			}

			function init(config) {
				parent = config.parent;
				direction = config.dir || '';
				bindEvent();
				subscribe();
			}

			return {
				setDirection: setDirection,
				init: init
			}
		}

		return Button;
    }
);