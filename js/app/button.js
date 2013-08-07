define(["lib/pubsub"], function() {
        
        /**
         * The Forward/Back button for the carousel.
         *
         * @constructor
         * @this { Button }
         * @param { Object } element - The jquery object wrapping
         *      the button. 
         */
        var Button = function(element) {
            var self = this;
            var element = element || null;
            var panels = null;
            var panelId = '';
            var direction = '';

            /**
             * Fades in the element after initialization/asset
             * loading is complete.
             */
            function showElement() {
                element
                    .show('fast');
            }

            /**
             * Publishes forward and backward navigation to 
             * subscribing elements.
             */
            function publish() {
                if (direction === 'next') {
                    $.publish("/" + panelId + "/next");
                } else if (direction === 'prev') {
                    $.publish("/" + panelId + "/prev");
                }
            }

            /**
             * Publishes a `stopTimer` event, telling the 
             * timer object to stop itself.
             */
            function stopTimer() {
                $.publish("/" + panelId + "/stopTimer");
            }

            /**
             * Triggers the stopTimer event, publishes slide 
             * toggle event. Called on button click.
             */
            function sendToggleEvent() {
                if (panels.is(':animated')) { return; }

                stopTimer();
                publish();
            }

            /**
             * Binds the button click event.
             */
            function bindEvent() {
                element
                    .bind('click', function(){
                        sendToggleEvent();
                    });
            }

            /**
             * Initializes the button object.
             *
             * @param { Object } config - The configuration object
             *      for the button.
             */
            function init(config) {
                panels = $(config.panels, config.container);
                panelId = config.container;
                direction = config.dir || '';
                bindEvent();
                showElement();
            }

            return {
                init: init
            }
        }

        return Button;
    }
);