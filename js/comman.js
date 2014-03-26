$(document).ready(function(){
	$("nav").sticky({topSpacing:0});
	$('#source').quicksand( $('#destination li') );
	$(".portfolio a[rel^='prettyPhoto']").prettyPhoto({
    		theme:'light_square',
    		autoplay_slideshow: false,
    		overlay_gallery: false
	});
});