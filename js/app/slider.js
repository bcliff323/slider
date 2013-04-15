define(["../app/panel", "../app/button", "../app/nav", "lib/pubsub"], function(Panel, Button, Nav) {
        
        var Slider = function() {
        	var self = this,
                autoPlay = false,
                panelClass = '',
                panelSet = [],
                uniquePanels = 0,
                numPanels = 0,
                index = 0,
                panels = null,
                slideObj = null,
                nextObj = null,
                prevObj = null;

            function startTimer() {
                console.log(uniquePanels);
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
                    first = slider.find(panelClass).first().clone(),
                    second = slider.find(panelClass).first().next().clone(),
                    third = slider.find(panelClass).first().next().next().clone(),
                    fourth = null;

                if (numPanels === 3) {
                    slider
                        .append(first)
                        .prepend(third)
                        .prepend(second);
                } else if (numPanels === 4) {

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

                if (numPanels > 2 && numPanels < 5) {
                    clonePanels();
                }
                
                buildPanels();
                buildButtons();

                if (autoPlay) {
                    startTimer();
                }
            }

            return {
                init: init
            }
        }
        
		return Slider;
    }
);