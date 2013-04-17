requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js'
});

require(["lib/jquery", "app/slider"], function($, Slider) {

    var global = window;
    global.sliders = {};
    
    for (var i = 0, len = global.grandMarquee.length; i < len; i++) {
        global.sliders[i] = new Slider();
        global.sliders[i].init(global.grandMarquee[i]);
    }

});

