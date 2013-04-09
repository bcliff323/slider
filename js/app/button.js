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
			}

			return {
				setDirection: setDirection,
				init: init
			}
		}

		return Button;
    }
);