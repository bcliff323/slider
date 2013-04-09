define(["lib/pubsub"], function() {
        
		var Nav = function(element) {
			var self = this,
				items = element || null;

			function bindEvent() {
				items
					.click(function(e){
						e.preventDefault();

						var index = $(this).attr('index');
						$.publish("/toggle/direct", index);
					});
			}

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