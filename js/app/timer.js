define(["lib/pubsub"], function() {

        /**
         * Timer for the slider auto-advance. Manages starting
         * and stopping of the slider.
         *
         * @constructor
         * @this { Timer }
         */    
        var Timer = function() {
            var speed = 0;
            var panelId = '';
            var timer = null;

            /**
             * Stops the timer.
             */
            function stopTimer() {
                clearInterval(timer);
                timer = null;
            }

            /**
             * Starts the timer, publishes start event to timer
             * subscribers.
             *
             * @param { Number } s - Timer interval in Milliseconds.
             */
            function startTimer(s) {
                timer = setInterval(function(){
                    $.publish("/" + panelId + "/autoplay");
                }, s);
            }

            /**
             * Initializes and starts the timer.
             */
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