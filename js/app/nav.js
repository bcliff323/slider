define(["lib/pubsub"], function() {
        
        /**
         * The Navigation element for the carousel.
         *
         * @constructor
         * @this { Nav }
         * @param { Object } element - The jquery object wrapping
         *      the nav container. 
         */
        var Nav = function(element) {
            var self = this;
            var items = element || null;

            /**
             * Binds the click event to the nav items. Publishes
             * message regarding which nav item was clicked.
             */
            function bindEvent() {
                items
                    .click(function(e){
                        e.preventDefault();

                        var index = $(this).attr('index');
                        $.publish("/toggle/direct", index);
                    });
            }

            /**
             * Initializes the Nav, binds jQuery event listeners.
             */
            function init() {
                bindEvent();
            }

            return {
                init: init
            }
        }

        return Nav;
    }
);