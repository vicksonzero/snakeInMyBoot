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
	function Head(){
		this.x = 0;
		this.y = 0;
		this.life = 1;
		this.dir = 0;
		this.map = null;

		this.newDir = 0;
		this.yellowCard = Config.yellowCards;

		this.onGameoverCallback = function(){};
	}

	//////////////////////////////
	// class functions / utility
	//////////////////////////////
	Head.instanceList = [];
	Head.get = function get(index) {
		return Head.instanceList[index];
	};
	Head.resetInstanceList = function resetInstanceList(){
		Head.instanceList = [];
	};
	Head.create = function create(x, y, life, dir, map){
		var newBody = new Head();
		newBody.x = x;
		newBody.y = y;
		newBody.life = life;
		newBody.dir = dir;
		newBody.map = map;

		// class stuff
		newBody.index = Head.instanceList.length;
		Head.instanceList.push(newBody);
		newBody.updateOnMap(map);

		return newBody;
	}

	//////////////////////////////
	// prototype functions / utility
	//////////////////////////////

	var p = Head.prototype;

	p.move = function move(gameMetrics) {
		this.dir = this.newDir;
		var delta = dir2delta[this.dir];
		if(this.canMoveThere(gameMetrics, this.map, delta)){
			// reset yellowcards
			this.yellowCard = Config.yellowCards;

			// lift from board
			this.removeFromMap(this.map);

			// create new body under
			var newB = Body.create(this.x, this.y, this.life, this.dir, this.map);

			// move
			this.x += delta.x;
			this.y += delta.y;

			// put back to board
			this.updateOnMap(this.map);

			return true;
		}else{
			this.yellowCard--;

			if(this.yellowCard < 0){
				this.onGameoverCallback();
			}

			return false;
		}


	};

	p.canMoveThere = function canMoveThere(gameMetrics, map2dArray, delta) {
		var newX = this.x + delta.x;
		var newY = this.y + delta.y;

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
		var xx = boxSize.x * this.x + padding;
		var yy = boxSize.y * this.y + padding;
		var ww = boxSize.x - padding - padding;
		var hh = boxSize.y - padding - padding;
		ctx.fillRect(xx,yy,ww,hh);
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


	return Head;
})();
