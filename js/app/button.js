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

			function publish() {
				if (direction === 'next') {
					$.publish("/" + panelId + "/next");
				} else if (direction === 'prev') {
					$.publish("/" + panelId + "/prev");
				}
			}

			function stopTimer() {
				$.publish("/" + panelId + "/stopTimer");
			}

			function sendToggleEvent() {
				if (panels.is(':animated')) { return; }

				stopTimer();
				publish();
			}

			function bindEvent() {
				element
					.bind('click', function(){
						sendToggleEvent();
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