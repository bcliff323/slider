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
                panelId = '',
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
                    $.publish("/" + panelId.replace('#','') + "/next");
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
                $.subscribe("/" + panelId.replace('#','') + "/autoplay", function(event) {
                    advance();
                });

                $.subscribe("/" + panelId.replace('#','') + "/stopTimer", function(event) {
                    stopTimer();
                });

                $.subscribe("/" + panelId.replace('#','') + "/loaded", function(event, obj) {
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

            function specificOrder(first) {
                index = first;
                stopTimer();
                $.publish("/" + panelId.replace('#','') + "/direct", first);
            }

            function buildButtons() {
                var nextBtn = new Button(nextObj),
                    prevBtn = new Button(prevObj);

                nextBtn.init({ dir: 'next', panels: panelClass, container: panelId });
                prevBtn.init({ dir: 'prev', panels: panelClass, container: panelId });
            }

            function buildPanels() {
                var pnls = panels,
                    numP = numPanels;

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
                panels = $(panelClass, panelId);
                uniquePanels = numPanels;
                numPanels = panels.length;
            }

            function init(config) {
                panelId = config.panelId;
                panelClass = config.panelClass;
                nextObj = $(config.nextClass, config.panelId);
                prevObj = $(config.prevClass, config.panelId);
                autoPlay = config.autoPlay || false;
                setPanels();
                slideObj = panels.parent();

                clonePanels();
                buildPanels();
                buildButtons();
                subscribe();

                if (urlParam > 1 && urlParam <= uniquePanels) {
                    specificOrder(parseInt(urlParam));
                    autoPlay = false;
                } else {
                    $(panels[2], config.panelId).addClass('active');
                }
            }

            return {
                init: init
            }
        }
        
		return Slider;
    }
);