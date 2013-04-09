requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js'
});

require(["lib/jquery", "app/slider"], function(jQuery, Slider) {
    
    var swipe = new Slider();
    swipe.init({ 
    	panelClass: '.panel',
    	nextBtn: '.nextBtn',
    	prevBtn: '.prevBtn',
    	navClass: '.step' 
    });
    
    window.swipe = swipe;
});

