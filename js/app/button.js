define(["lib/pubsub"], function() {
        
		var Button = function(element) {
			var self = this,
				element = element || null,
				panels = null,
				panelId = '',
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

						console.log('click');

						$.publish("/" + panelId.replace('#','') + "/stopTimer");

						if (direction === 'next') {
							$.publish("/" + panelId.replace('#','') + "/next");
						} else if (direction === 'prev') {
							$.publish("/" + panelId.replace('#','') + "/prev");
						}
					});
			}

			function init(config) {
				panels = $(config.panels, config.container);
				panelId = config.container;
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