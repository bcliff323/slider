define(["../app/panel", "../app/button", "../app/nav", "lib/pubsub"], function(Panel, Button, Nav) {
        
        var Slider = function() {
        	var self = this,
                panelClass = '',
                slideObj = null,
                numPanels = 0,
                panels = null,
                panelSet = [];

            function subscribe() {
                $.subscribe("/shuffle/append", function(event, obj) {
                    $('.veiwPort').append(obj);
                });

                $.subscribe("/shuffle/prepend", function(event, obj) {
                    console.log(obj);
                    $('.veiwPort').prepend(obj);
                });
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
                numPanels = panels.length;
            }

            function init(config) {
                panelClass = config.panelClass;
                setPanels();
                slideObj = panels.parent();

                if (numPanels > 2 && numPanels < 5) {
                    clonePanels();
                }
                
                buildPanels();
                subscribe();
            }

            return {
                init: init
            }
        }
        
		return Slider;
    }
);