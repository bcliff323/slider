define(["lib/pubsub"], function() {
        
		var Timer = function() {
			var speed = 0,
				panelId = '',
				timer = null;

			function stopTimer() {
				clearInterval(timer);
				timer = null;
			}

			function startTimer(s) {
				timer = setInterval(function(){
					$.publish("/" + panelId.replace('#','') + "/autoplay");
				}, s);
			}

			function init(config) {
				speed = config.duration;
				panelId = config.container;
				startTimer(config.duration);
			}

			return {
				init: init,
				start: startTimer,
				stop: stopTimer
			}
		}

		return Timer;
    }
);