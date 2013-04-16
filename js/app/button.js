define(["lib/pubsub"], function() {
        
		var Button = function(element) {
			var self = this,
				element = element || null,
				panels = null,
				direction = '';

			function setDirection(dir) {
				if (direction.length === 0) {
					direction = dir;
				} 
			}

			function bindEvent() {
				element
					.bind('click', function(){
						if (panels.is(':animated')) { return; }

						$.publish("/toggle/stopTimer");

						if (direction === 'next') {
							$.publish("/toggle/next");
						} else if (direction === 'prev') {
							$.publish("/toggle/prev");
						}
					});
			}

			function init(config) {
				panels = $(config.panels);
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