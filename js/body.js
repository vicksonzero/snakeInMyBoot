// include

// main
module.exports = (function(){
	//////////////////////////////
	// class definition / utility
	//////////////////////////////
	function Body(){
		this.x = 0;
		this.y = 0;
		this.life = 1;
		this.dir = 0;

		this.index = -1; //
		this.map = null;
	}

	//////////////////////////////
	// class functions / utility
	//////////////////////////////
	Body.instanceList = [];
	Body.get = function get(index) {
		return Body.instanceList[index];
	};
	Body.resetInstanceList = function resetInstanceList(){
		Body.instanceList = [];
	};
	Body.create = function create(x, y, life, dir, map){
		var newBody = new Body();
		newBody.x = x;
		newBody.y = y;
		newBody.life = life;
		newBody.dir = dir;
		newBody.map = map;

		// class stuff
		newBody.index = Body.instanceList.length;
		Body.instanceList.push(newBody);
		newBody.updateOnMap(map);

		return newBody;
	};
	Body.all = function all(callback){
		Body.instanceList.forEach(function(element, index, array){
			if(element !== null){
				callback(element);
			}
		},{});
	};

	//////////////////////////////
	// prototype functions / utility
	//////////////////////////////

	var p = Body.prototype;

	p.updateOnMap = function updateOnMap(map2dArray) {
		if(map2dArray[this.y][this.x] == -1){
			map2dArray[this.y][this.x] = this.index;
		}else{
			throw ["map[", this.y, ",", this.x, "] is occupied"].join();
		}
	};
	p.removeFromMap = function removeFromMap(map2dArray) {
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
		ctx.fillStyle="#000000";
		var xx = boxSize.x * this.x + padding;
		var yy = boxSize.y * this.y + padding;
		var ww = boxSize.x - padding - padding;
		var hh = boxSize.y - padding - padding;

		switch(this.dir){
			case 0:
				ww += padding + padding + padding;
				break;
			case 1:
				hh += padding + padding + padding;
				yy -= padding + padding + padding;
				break;
			case 2:
				ww += padding + padding + padding;
				xx -= padding + padding + padding;
				break;
			case 3:
				hh += padding + padding + padding;
				break;
		}
		ctx.fillRect(xx,yy,ww,hh);
	};
	p.step = function step() {
		//console.log(this.life);
		this.life--;
		if(this.life <= 0){
			this.destroy();
		}
	};
	p.destroy = function destroy() {
		Body.instanceList[this.index] = null;
		this.map[this.y][this.x] = -1;
	};

	return Body;
})();
