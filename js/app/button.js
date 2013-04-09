define(["lib/pubsub"], function() {
        
		var Button = function(element) {
			var self = this,
				element = element || null,
				direction = '';

			function setDirection(dir) {
				if (direction.length === 0) {
					direction = dir;
				} 
			}

			function bindEvent() {
				element
					.click(function(){
						if (direction === 'next') {
							$.publish("/toggle/next");
						} else if (direction === 'prev') {
							$.publish("/toggle/prev");
						}
					});
			}

			function init(dir) {
				direction = dir || '';
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