define(

    [
            "../app/panel", 
            "../app/button",  
            "../app/timer",
            "../app/querystring",
            "lib/pubsub"
    ], 

    /**
     * The main app module.
     *
     * @param { Object } Panel - The Panel Class.
     * @param { Object } Button - The Button Class.
     * @param { Object } Timer - The Timer Class.
     * @param { Object } QueryString - The QueryString method.
     */
    function(Panel, Button, Timer, QueryString) {
        
        /**
         * The main Slider constructor. Assembles the slider
         * carousel by instantiating panel objects, buttons,
         * and starting a timer.
         *
         * @constructor
         * @this { Slider }
         */ 
        var Slider = function() {
            var self = this;
            var urlParam = QueryString("slide") || 1;
            var autoPlay = false;
            var panelId = '';
            var panelClass = '';
            var panelSet = [];
            var urlParams = [];     // new url param code
            var paramIndex = 0;     // new url param code
            var uniquePanels = 0;
            var numPanels = 0;
            var index = 0;
            var panels = null;
            var slideObj = null;
            var nextObj = null;
            var prevObj = null;
            var timer = null;

            /**
             * Advances the slider by publishing a next event.
             * This is received by the panels, which toggle their
             * own positions.
             */
            function advance() {
                if (index < uniquePanels) {
                    $.publish("/" + panelId + "/next");
                    index++;
                } else {
                    timer.stop();
                    timer = null;
                }
            }

            /**
             * Instantiates a new timer and starts it, given an
             * interval, in milliseconds.
             *
             * @param { Number } speed - The speed of the timer.
             */
            function newTimer(speed) {
                timer = new Timer();
                timer.init(speed);
            }

            /**
             * Stops the slider timer.
             */
            function stopTimer() {
                if (timer !== null) {
                    timer.stop();
                }
            }

            /**
             * Subscribes to timer events, and image load events.
             * Adds image tags to the slideshow when all assets are
             * loaded.
             */
            function subscribe() {
                $.subscribe("/" + panelId + "/autoplay", function(event) {
                    advance();
                });

                $.subscribe("/" + panelId + "/stopTimer", function(event) {
                    stopTimer();
                });

                $.subscribe("/" + panelId + "/loaded", function(event, obj) {
                    var markup = '<img alt="" class="bg" src="' + obj.path + '" />';
                    $(obj.element).append(markup);

                    if (obj.skipFade) {
                        $(obj.element).addClass('active');
                    } else {
                        if (obj.loadIndex === numPanels) {
                            panels.fadeIn('fast');

                            if(autoPlay) {
                                newTimer({
                                    duration: autoPlay,
                                    container: panelId
                                });
                            }
                        }
                    }
                });
            }

            /**
             * Enables slider navigation by pressing right
             * and left arrow keys.
             */
            function enableKeyPress() {
                $(document).keydown(function(e){
                    stopTimer();
                    if (e.keyCode === 39) {
                        $.publish("/" + panelId + "/next");
                    } else if (e.keyCode === 37) {
                        $.publish("/" + panelId + "/prev");
                    }
                });
            }

            /**
             * Moves slider to specific position, triggered if
             * QueryString parameters are set.
             *
             * @param { Number } first - The index of the panel to load as 
             *      the hero slide.
             */
            function specificOrder(first) {
                index = first;
                $.publish("/" + panelId + "/direct", first);
                index = 0;
            }

            /**
             * Instantiates button objects, initializes them.
             */
            function buildButtons() {
                var nextBtn = new Button(nextObj);
                var prevBtn = new Button(prevObj);

                nextBtn.init({ dir: 'next', panels: panelClass, container: panelId });
                prevBtn.init({ dir: 'prev', panels: panelClass, container: panelId });
            }

            /**
             * Instantiates panel objects, initializes them.
             */
            function buildPanels() {
                var pnls = panels;
                var numP = numPanels;

                for (var i = -2, len = numPanels-2; i<len; i++) {
                    panelSet.push(
                            new Panel($(pnls[i+2]))
                    );
                    panelSet[i+2].init({ 
                        index: i,
                        container: panelId
                    });
                }
            }

            /**
             * In the event that there are fewer than 6 slides, clone 
             * the panels in order to allow infinite scroll.
             */
            function clonePanels() {
                var slider = slideObj;
                var clones = null;

                if (numPanels > 2 && numPanels < 6) {
                    clones = slider.find(panelClass).clone();
                } else {
                    clones = slider.find(panelClass);
                }

                // remove data attrs, the are no longer needed.
                clones
                    .removeAttr('data-slide-name');

                slider
                    .append(clones);

                if (paramIndex < 0) {
                    slider
                        .prepend($(clones)[clones.length-1])
                        .prepend($(clones)[clones.length-2]);
                }
                
                setPanels();
                panelId = panelId.replace('#', '');
            }

            /**
             * Sets references to the panel objects, number of 
             * unique panels, and number of total panels.
             */
            function setPanels() {
                panels = $(panelClass, panelId);
                uniquePanels = numPanels;
                numPanels = panels.length;
            }

            /**
             * Captures url parameters and determines which slide
             * to set in the Hero position.
             */
            function captureURLParams() {
                var params = urlParams;
                var data = panels.attr('data-name');

                slideObj
                    .find('div[data-slide-name]')
                    .map(function(){
                        urlParams
                            .push(
                                $(this).attr('data-slide-name')
                            );
                    });

                paramIndex = $.inArray(urlParam, urlParams);
            }

            /**
             * Initializes the slider object.
             *
             * @param { Object } config - The slider configuration
             */
            function init(config) {
                panelId = config.panelId;
                panelClass = config.panelClass;
                nextObj = $(config.nextClass, config.panelId);
                prevObj = $(config.prevClass, config.panelId);
                autoPlay = config.autoPlay || false;
                setPanels();
                slideObj = panels.parent();

                captureURLParams();
                clonePanels();
                
                buildPanels();
                buildButtons();
                enableKeyPress();
                subscribe();

                if (paramIndex > -1 && paramIndex <= uniquePanels) {
                    specificOrder(parseInt(paramIndex-1));
                } else {
                    $(panels[0], config.panelId).addClass('active');
                }
            }

            return {
                init: init
            }
        }
        
        return Slider;
    }
);