var $ = require("jquery");
var config = require("../config");


/**
 * resizes div to fill the screen according to ratio
 * @param  {div}    div    the div to resize
 * @param  {number} ratio  width/height
 * @return {x,y}           resulting new div width and height
 */
module.exports = function resizeGameScreen(div,ratio){
	var win = {
		width: $(window).width(),
		height:$(window).height()
	};
	win.ratio = win.width/win.height;

	var newDimension = {x:0,y:0};
	// if window is fatter than target
	if (win.ratio >ratio) {
		newDimension.x = win.height*ratio;
		newDimension.y = win.height;
	}else {	// if window is taller than target
		newDimension.x = win.width;
		newDimension.y = win.width/ratio;
	}
	$(div)
		.width(newDimension.x)
		.height(newDimension.y);

	return newDimension;

};
