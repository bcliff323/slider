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

            function toggle(obj) {
                var direction = obj.direction || '',
                    step = obj.step || '',
                    distance = xCoord;

                if (direction === 'right' && distance === 0) { return; }
                if (direction === 'left' && distance <= -((numPanels-1)*slideTravel)) { return; }
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
                    }, 500);

                xCoord = distance;
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

                nextBtn.init('next');
                prevBtn.init('prev');
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
            }

            function setPanels(sClass) {
                panelObj = $($(sClass).parent());
                numPanels = panelObj.children().length;
            }

        	function init(obj) {
                if (slideClass.length < 1) { slideClass = obj.panelClass; }
                if (navClass.length < 1) { navClass = obj.navClass; }
        		slideTravel = parseInt($(slideClass).css('width').replace('px','')) + 30;
                setPanels(obj.panelClass);
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