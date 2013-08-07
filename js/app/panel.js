define(["../lib/Modernizr", "../lib/swipe", "lib/pubsub"], function() {
        
        /**
         * The Panel constructor.
         *
         * @constructor
         * @this { Panel }
         * @param { Object } panel - The jquery object wrapping
         *      the panel. 
         */
        var Panel = function(panel) {
            var self = this;
            var panelElement = panel || null;
            var panelMargin = parseInt(panelElement.css('margin-left').replace('px',''))*2;
            var width = parseInt(panelElement.css('width').replace('px','')) + panelMargin;
            var panelId = '';
            var index = 0;
            var xCoord = 0;
            var position = 0;
            var bgImage = '';

            /**
             * Calculates the number of panel elements.
             *
             * @return the number of panels in the slider.
             */
            function numSiblings() {
                return panelElement.parent().children().length;
            }

            /**
             * Loads background images from html `data-background`
             * attributes.
             */
            function loadBackground() {
                var imgPath = bgImage;
                var img = new Image();

                img.src = imgPath;

                $(img).load(function(){
                    $.publish("/" + panelId + "/loaded", { 
                        element: panelElement, 
                        path: bgImage, 
                        loadIndex: index+3,
                        skipFade: false
                    });
                });
            }

            /**
             * Shuffles panels to allow continuous scrolling. 
             *
             * @param { Object } obj - The object to be shuffled.
             */
            function shuffle(obj) {
                if (obj.direction === 'append') {
                    xCoord = width*(obj.pos+obj.n); 
                } else if (obj.direction === 'prepend') {
                    xCoord = width*(-(obj.n - obj.pos)); 
                }

                panelElement
                    .css('left', xCoord);

                position = (xCoord/width);
            }

            /**
             * Moves panel container to a specific xCoord. Triggers
             * Shuffle.
             *
             * @param { Object } obj - The config object, containing xCoord
             *      position. 
             */
            function toPosition(obj) {
                var siblings = numSiblings();
                var xDelta = obj.pos;
                var distance = ((xCoord/width) - (xDelta-1)) * width;

                panelElement
                    .css('left', distance);

                xCoord = distance;

                if ((xCoord/width) < -2) {
                    shuffle({ 
                        pos: (xCoord/width), 
                        n: siblings,
                        direction: 'append'
                    });
                } else if (xCoord/width > siblings-2) { // new url param code
                    shuffle({ 
                        pos: (xCoord/width), 
                        n: siblings,
                        direction: 'prepend'
                    });
                }

                if (xCoord === 0) {
                    panelElement
                        .addClass('active');
                }

            }

            /**
             * Toggles the panel objects left, or right. Shuffles when
             * necessary.
             *
             * @param { Object } obj - The toggle config object, containing
             *      the direction in which to toggle.
             */
            function toggle(obj) {
                var siblings = numSiblings();
                var direction = obj.direction;
                var distance = (direction === 'left') ? (-1 * width) : width; 

                panelElement
                    .animate({
                        'left': xCoord+distance
                    }, 500, function(){
                        xCoord += distance;
                        position = xCoord/width;

                        if (position < -2) {
                            shuffle({ 
                                pos: position, 
                                n: siblings,
                                direction: 'append'
                            });
                        } else if (position >= siblings-2) {
                            shuffle({ 
                                pos: position,
                                n: siblings,
                                direction: 'prepend' 
                            });
                        }
                    });
            }

            /**
             * Subscribes to panel toggle events.
             */
            function subscribe() {
                $.subscribe("/" + panelId + "/next", function(event) {
                    if(!panelElement.is(':animated')) {
                        toggle({ direction: 'left' });
                    }
                });

                $.subscribe("/" + panelId + "/prev", function(event) {
                    if(!panelElement.is(':animated')) {
                        toggle({ direction: 'right' });
                    }
                });

                $.subscribe("/" + panelId + "/direct", function(event, p) {
                    toPosition({ pos: p });
                });
            }

            /**
             * Publishes toggle to the next slide.
             */
            function next() {
                if (!panelElement.is(':animated')) {
                    $.publish("/" + panelId + "/stopTimer");
                    $.publish("/" + panelId + "/next");
                }
            }

            /**
             * Publishes toggle to the previous slide.
             */
            function prev() {
                if (!panelElement.is(':animated')) {
                    $.publish("/" + panelId + "/stopTimer");
                    $.publish("/" + panelId + "/prev");
                }
            }

            /**
             * Binds swipe events, if touch is enabled.
             */
            function bindTouchEvents(element) {
                element
                    .swipeEvents()
                    .bind("swipeLeft",  next )
                    .bind("swipeRight", prev );
            }

            /**
             * Sets X Position of panel container.
             *
             * @param { String } pos - The coord to animate to.
             */
            function setXPosition(pos) {
                xCoord = pos;
                position = xCoord/width;
                panelElement
                    .css('left', pos);
            }

            /**
             * Gets the index of the panel. Its position in the 
             * slider.
             */
            function getIndex() {
                return index;
            }

            /**
             * Initializes the panel object.
             *
             * @param { Object } config - Configuration object for
             *      the panel.
             */
            function init(config) {
                panelId = config.container;
                index = config.index;
                xCoord = index*width;
                bgImage = panelElement.attr('data-background');
                setXPosition(xCoord);
                if (Modernizr.touch) {
                    bindTouchEvents(panelElement);
                }
                subscribe();

                if (typeof bgImage !== 'undefined') {
                    loadBackground();
                }
            }

            return {
                init: init,
                element: panelElement,
                index: getIndex,
                toPosition: shuffle
            }
        }

        return Panel;
    }
);