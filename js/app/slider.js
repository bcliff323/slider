define(

    [
            "../app/panel", 
            "../app/button", 
            "../app/nav", 
            "../app/timer",
            "../app/querystring", 
            "lib/pubsub"
    ], 

    function(Panel, Button, Nav, Timer, QueryString) {
        
        var Slider = function() {
        	var self = this,
                urlParam = QueryString("slide") || 1,
                autoPlay = false,
                panelClass = '',
                panelSet = [],
                uniquePanels = 0,
                numPanels = 0,
                index = 0,
                panels = null,
                slideObj = null,
                nextObj = null,
                prevObj = null,
                timer = null;

            function advance() {
                if (index < uniquePanels) {
                    $.publish("/toggle/next");
                    index++;
                } else {
                    timer.stop();
                    timer = null;
                }
            }

            function newTimer(speed) {
                timer = new Timer();
                timer.init(speed);
            }

            function stopTimer() {
                if (timer !== null) {
                    timer.stop();
                }
            }

            function subscribe() {
                $.subscribe("/toggle/autoplay", function(event) {
                    advance();
                });

                $.subscribe("/toggle/stopTimer", function(event) {
                    stopTimer();
                });
            }

            function specificOrder(first) {
                index = first;
                stopTimer();
                $.publish("/toggle/direct", first);
            }

            function buildButtons() {
                var nextBtn = new Button(nextObj),
                    prevBtn = new Button(prevObj);

                nextBtn.init({ dir: 'next', panels: panelClass });
                prevBtn.init({ dir: 'prev', panels: panelClass });
            }

            function buildPanels() {
                var pnls = panels,
                    numP = numPanels;

                for (var i = -2, len = numPanels-2; i<len; i++) {
                    panelSet.push(
                            new Panel($(pnls[i+2]))
                    );
                    panelSet[i+2].init({ 
                        index: i
                    });
                }
            }

            function clonePanels() {
                var slider = slideObj,
                    clones = null;

                if (numPanels > 2 && numPanels < 6) {
                    clones = slider.find(panelClass).clone();
                } else {
                    clones = slider.find(panelClass);
                }

                slider
                    .append(clones);

                if (urlParam === '1' || urlParam === 1 || urlParam > uniquePanels) {
                    slider
                        .prepend($(clones)[clones.length-1])
                        .prepend($(clones)[clones.length-2]);
                }
                
                setPanels();
            }

            function setPanels() {
                panels = $(panelClass);
                uniquePanels = numPanels;
                numPanels = panels.length;
            }

            function init(config) {
                panelClass = config.panelClass;
                nextObj = $(config.nextClass);
                prevObj = $(config.prevClass);
                autoPlay = config.autoPlay || false;
                setPanels();
                slideObj = panels.parent();

                clonePanels();
                buildPanels();
                buildButtons();
                subscribe();

                if (urlParam > 1 && urlParam <= uniquePanels) {
                    specificOrder(parseInt(urlParam));
                }

                if (autoPlay) {
                    newTimer(autoPlay);
                }
            }

            return {
                init: init
            }
        }
        
		return Slider;
    }
);