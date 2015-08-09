// include
var Body = require('./body');
var Config = require("./config");


var dir2delta = [
	{x:1,y:0},
	{x:0,y:-1},
	{x:-1,y:0},
	{x:0,y:1}
];
// main
module.exports = (function(){
	//////////////////////////////
	// class definition / utility
	//////////////////////////////
	function Food(){
		this.x = 0;
		this.y = 0;
		this.map = null;

		this.newDir = 0;
		this.yellowCard = Config.yellowCards;

		this.onGameoverCallback = function(){};
	}

	//////////////////////////////
	// class functions / utility
	//////////////////////////////
	Food.instanceList = [];
	Food.get = function get(index) {
		return Food.instanceList[index];
	};
	Food.resetInstanceList = function resetInstanceList(){
		Food.instanceList = [];
	};
	Food.create = function create(x, y, map){
		var newBody = new Food();
		newBody.x = x;
		newBody.y = y;
		newBody.map = map;

		// class stuff
		newBody.index = Food.instanceList.length;
		Food.instanceList.push(newBody);

		return newBody;
	}
	Food.all = function all(callback){
		Food.instanceList.forEach(function(element, index, array){
			if(element !== null){
				callback(element);
			}
		},{});
	};

	//////////////////////////////
	// prototype functions / utility
	//////////////////////////////

	var p = Food.prototype;

	p.move = function move(gameMetrics) {
		var randomFoodPlace;
		do{
			randomFoodPlace = randomPlace(gameMetrics);

		}while(!this.canMoveThere(gameMetrics, this.map, randomFoodPlace.x, randomFoodPlace.y));
		this.x = randomFoodPlace.x;
		this.y = randomFoodPlace.y;

	};

	p.canMoveThere = function canMoveThere(gameMetrics, map2dArray, newX, newY) {

		return (
			newX >=0 &&
			newX < gameMetrics.x &&
			newY >=0 &&
			newY < gameMetrics.y &&
			(map2dArray[newY][newX] === -1)
		);

	};

	p.updateOnMap = function updateOnMap(map2dArray) {
		if(map2dArray[this.y][this.x] == -1){
			map2dArray[this.y][this.x] = this.index;
		}else{
			throw ["map[", this.y, ",", this.x, "] is occupied"].join();
		}
	};

	p.removeFromMap = function updateOnMap(map2dArray) {
		map2dArray[this.y][this.x] = -1;
	};

	/**
	 * render the snake body on canvas
	 * @param  {canvas} canvas     canvas to draw on
	 * @param  {x,y} screenSize    screen size on x and y axis
	 * @param  {x,y} boxSize       size of the snake before padding
	 * @param  {number} padding    amount of padding
	 */
	p.render = function render(canvas, screenSize, boxSize, padding) {
		var ctx = canvas.getContext("2d");
		ctx.fillStyle= (this.yellowCard < Config.yellowCards? "#FF0000": "#000000");
		var xx = boxSize.x * this.x;
		var yy = boxSize.y * this.y;
		var ww = boxSize.x;
		var hh = boxSize.y;

		var dots = [];

		dots.push({
			xx: xx + ww/3 * 1 + padding,
			yy: yy + hh/3 * 0 + padding,
			ww: ww/3 - padding - padding,
			hh: hh/3 - padding - padding
		});

		dots.push({
			xx: xx + ww/3 * 0 + padding,
			yy: yy + hh/3 * 1 + padding,
			ww: ww/3 - padding - padding,
			hh: hh/3 - padding - padding
		});

		dots.push({
			xx: xx + ww/3 * 1 + padding,
			yy: yy + hh/3 * 2 + padding,
			ww: ww/3 - padding - padding,
			hh: hh/3 - padding - padding
		});

		dots.push({
			xx: xx + ww/3 * 2 + padding,
			yy: yy + hh/3 * 1 + padding,
			ww: ww/3 - padding - padding,
			hh: hh/3 - padding - padding
		});

		dots.forEach(function(element, index, array){
			ctx.fillRect(element.xx,element.yy,element.ww,element.hh);
		},{});
	};
	p.getGlobalPosCenter = function getGlobalPosCenter(boxSize) {
		var xx = boxSize.x * this.x;
		var yy = boxSize.y * this.y;
		var ww = boxSize.x;
		var hh = boxSize.y;
		return {
			x: xx + ww/2,
			y: yy + hh/2
		};
	};


	function randomPlace(gameMetrics){
		return {
			x: Math.floor(Math.random()*gameMetrics.x),
			y: Math.floor(Math.random()*gameMetrics.y)
		}
	}


	return Food;
})();
