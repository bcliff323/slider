define(["../app/panel", "../app/button", "../app/nav", "lib/pubsub"], function(Swipe, Button, Nav) {
        
        var Slider = function(slides) {
        	var self = this,
                slideClass = slides || '',
                navClass = '',
        		panelObj = null,
                panelSet = [],
                numPanels = 0,
                xCoord = 0,
                slideTravel = 0;

            function show() {
                panelObj
                    .css('display', 'block');
            }

            function toggle(obj) {
                var direction = obj.direction || '',
                    step = obj.step || '',
                    distance = xCoord;

                if (direction === 'left') {
                    distance -= slideTravel;
                } else if (direction === 'right') {
                    distance += slideTravel;
                } else if (direction.length < 1) {
                    distance = -(step*slideTravel);
                }
                
                panelObj
                    .animate({
                        'left' : distance + 'px'
                    }, 500, function(){
                        var cloneObj = null;

                        if (direction === 'left') {
                            moveObj = $(this).find('.panel').first();
                            $(this).append(moveObj);
                            xCoord = distance+slideTravel;
                            $(this).css('left', xCoord);
                        } else if (direction === 'right') {
                            moveObj = panelObj.find('.panel').last();
                            $(this).prepend(moveObj);
                            xCoord = distance-slideTravel;
                            $(this).css('left', xCoord);
                        }
                    });
                
            }

            function clonePanels() {
                var slider = panelObj,
                    first = slider.find('.panel').first().clone(),
                    second = slider.find('.panel').first().next().clone(),
                    last = slider.find('.panel').last().clone();

                slider.append(first);
                slider.append(second);
                slider.prepend(last);

                numPanels += 3;
            }

            function getNumPanels() {
                return numPanels;
            }

            function subscribe() {
                $.subscribe("/toggle/next", function(event) {
                    toggle({ direction: 'left' });
                });

                $.subscribe("/toggle/prev", function(event) {
                    toggle({ direction: 'right' });
                });

                $.subscribe("/toggle/direct", function(event, index) {
                    toggle({ step: index });
                });
            }

            function buildNav() {
                var nav = new Nav($(navClass));
                nav.init();
            }

            function buildButtons(obj) {
                var nextBtn = new Button($(obj.nextBtn)),
                    prevBtn = new Button($(obj.prevBtn));

                nextBtn.init({ dir: 'next', parent: panelObj });
                prevBtn.init({ dir: 'prev', parent: panelObj });
            }

            function buildPanels() {
                var len = numPanels,
                    set = panelSet;

                for (var i = 0; i < len; i++) {
                    set.push(
                        new Swipe($($(slideClass)[i]))
                    );
                    set[i].init({ index: i });
                }

                if(xCoord !== 0) {
                    panelObj
                        .css('left', xCoord);
                }
            }

            function setPanels(sClass) {
                panelObj = $($(sClass).parent());
                numPanels = panelObj.children().length;
            }

        	function init(obj) {
                if (slideClass.length < 1) { slideClass = obj.panelClass; }
                if (navClass.length < 1) { navClass = obj.navClass; }

        		slideTravel = parseInt($(slideClass).css('width').replace('px','')) + 30;
                xCoord = (obj.offset || 0) * slideTravel;
                setPanels(obj.panelClass);
                clonePanels();
                buildPanels();
                buildButtons(obj);
                buildNav();
                subscribe();
        	}

        	return {
        		init: init,
                numPanels: getNumPanels,
                toggle: toggle
        	}
        }
        
		return Slider;
    }
);