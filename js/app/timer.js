define(["lib/pubsub"], function() {
        
		var Timer = function() {
			var speed = 0,
				timer = null;

			function stopTimer() {
				clearInterval(timer);
				timer = null;
			}

			function startTimer(s) {
				timer = setInterval(function(){
					$.publish("/toggle/autoplay");
				}, s);
			}

			function init(duration) {
				speed = duration;
				startTimer(duration);
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