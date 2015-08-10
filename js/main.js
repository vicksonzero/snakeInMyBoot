// main.js
// main driver of the program. contains init and loading libraries.
//
// Content:
// -includes
// -local functions
// -main
//
// jump to <main> to see entry point

// <includes>

var $ = require("jquery");
var Config = require("./config");
	//screenResizeHandler = require("./system/screenSize"),
var Util = require("./util/util");
var screenSize = require('./util/screenSize');
var injectReqAnimFrame = require('./util/injectReqAnimFrame')();
var Head = require('./head');
var Body = require('./body');
var Food = require('./food');

// </includes>

// <local functions>

/**
 * Prompts for a string
 * @param {String} prompt question to be asked
 * @return the input result
 */
function _getString(prompt) {
	str = prompt(prompt);
	return str;
}

function isTouchSupported() {
	var msTouchEnabled = window.navigator.msMaxTouchPoints;
	var generalTouchEnabled = "ontouchstart" in document.createElement("div");

	if (msTouchEnabled || generalTouchEnabled) {
		return true;
	}
	return false;
}

// </local functions>


// <main>

// done on document load
$(function () {


	////////////////////
	// game variables //
	////////////////////

	// title DOM element
	var titleDiv = $("#title").get()[0];
	// game area (canvas)
	var gameDiv = $("#game").get()[0];

	// size of game area (pixels)
	var gameDivSize = {x:0,y:0};

	// pointer to snake head
	var snakeHead = null;

	// abstract game area
	var gameMetrics = {x:0,y:0};

	// speed level (index of gameSpeed)
	var gameSpeedLevel = Math.floor(Config.speedLevels.length/2);

	// actual game speed
	var gameSpeed = Config.speedLevels[gameSpeedLevel];

	// map 2d array. is populated later
	var map = [];

	// id for render loop. used to stop the loop if necessary
	var renderID = -1;

	// id for game loop. used to stop the loop if necessary
	var loopID = -1;

	////////////////////////
	// screensize problem //
	////////////////////////
	// is called whenever the screen resizes
	function screenResizeHandler() {

		// resize the div by css, returns the new size
		gameDivSize = screenSize(gameDiv, Config.boardRatio);

		// change canvas size by pixels
		gameDiv.width = gameDivSize.x;
		gameDiv.height = gameDivSize.y;

		// resize the title div by css
		screenSize(titleDiv, Config.boardRatio);

		// scale text
		$(titleDiv).css("font-size", 52/500*gameDivSize.x+"px");
		$("#title button").css("font-size", 22/500*gameDivSize.x+"px");
	}

	// bind windows resize to screenResizeHandler
	$(window).resize(screenResizeHandler);
	// initial run
	screenResizeHandler();

	// click and holding on title page hides the page
	$(titleDiv)
		.mousedown(function(evt){
			$(titleDiv).css("opacity",0);
		})
		.mouseup(function(){
			$(titleDiv).css("opacity",1);
		});
	// clicking on buttons won't
	$(titleDiv).find("button").mousedown(function(evt){
		evt.stopPropagation();
	})

	// creates a 2d array for the map
	function newMap() {
		'use strict';

		// resulting map
		var map = [];

		// number of rows and columns
		gameMetrics.x = 16;
		gameMetrics.y = Math.floor(gameMetrics.x / Config.boardRatio);

		// populate map with -1
		for (var i = 0; i < gameMetrics.y; i++) {
			var row = [];
			for (var j = 0; j < gameMetrics.x; j++) {
				row.push(-1);
			}
			map.push(row);
		}
		return map;

	}

	// reset all variable in map
	function gameReset(){

		// clear instances
		Head.resetInstanceList();
		Body.resetInstanceList();
		Food.resetInstanceList();

		// clear map
		map = newMap();
	}

	////////////////
	// life cycle //
	////////////////

	// game set up
	function setUp(){
		// reset game
		gameReset();

		// create player
		snakeHead = Head.create(0,10, Config.startingLife, 0, map);
		snakeHead.onGameoverCallback = gameEnd;

		// first few moves to create a working body
		var startLife = Config.startingLife;
		for (var i = 0; i < startLife; i++) {
			snakeHead.move(gameMetrics);
			// move body parts
			Body.all(function(element){
				element.step();
			});
		}

		// place food
		var newFood = Food.create(0, 0, map);
		// randomize food location
		newFood.move(gameMetrics);
	}

	function loop(){
		//console.log("loop");

		// schedule next loop
		loopID = setTimeout(loop, gameSpeed);

		// try to move. if the snake moved...
		if(snakeHead.move(gameMetrics)){

			// move body parts
			Body.all(function(element){
				element.step();
			});

			// check eating
			Food.all(function(element){
				// if eaten
				if(snakeHead.x == element.x && snakeHead.y == element.y){

					// increase life for Body and Head
					Body.all(function(element){
						element.life++;
					});
					snakeHead.life++;
					// teleport food to next place
					element.move(gameMetrics);
				}
			})
		};// else do not update the game state

	}
	// render loop
	function render(){
		//console.log("HI");

		// schedule for next frame
		renderID = requestAnimationFrame(render);

		// context for drawing
		var ctx = gameDiv.getContext("2d");

		// clear canvas
		ctx.clearRect(0, 0, gameDiv.width, gameDiv.height);

		// size for 1 snake body unit
		var boxSize = {x:0,y:0};
		boxSize.x = gameDivSize.x / gameMetrics.x;
		boxSize.y = gameDivSize.y / gameMetrics.y;

		// render all body
		Body.all(function(element){
			element.render(gameDiv, gameDivSize, boxSize, Config.padding);
		});

		// render all food
		Food.all(function(element){
			element.render(gameDiv, gameDivSize, boxSize, Config.padding);
		});

		// render snake head
		if(snakeHead)snakeHead.render(gameDiv, gameDivSize, boxSize, Config.padding);
	}
	// first call / start loop
	render();


	/////////////////
	// Interaction //
	/////////////////

	function clickHandler(mousePoint){
		//console.log(mousePoint);

		// size of a body unit
		var boxSize = {x:0,y:0};
		boxSize.x = gameDivSize.x / gameMetrics.x;
		boxSize.y = gameDivSize.y / gameMetrics.y;

		// position of head (center point)
		var globalPos = snakeHead.getGlobalPosCenter(boxSize);

		// direction the snake is facing
		var dir = snakeHead.dir;

		// calculate new direction based on current direction and input
		var newDir = 0;
		if(dir == 0 || dir == 2){
			if(globalPos.y - mousePoint.y > 1) newDir = 1;
			if(mousePoint.y - globalPos.y  > 1) newDir = 3;
		}
		if(dir == 1 || dir == 3){
			if(globalPos.x - mousePoint.x > 1) newDir = 2;
			if(mousePoint.x - globalPos.x  > 1) newDir = 0;
		}

		// record new direction. old direcion will be updated in the coming tick
		snakeHead.newDir = newDir;
	}

	// bind mouse event. use touchstart for fingers and mousedown for mouse
	if(isTouchSupported()){
		gameDiv.addEventListener("touchstart", function(evt){
			var mouse = Util.getMouse(evt.touches[0]);
			clickHandler(mouse);
		});
	}else{
		$(gameDiv).mousedown(function(evt){
			if(evt.which !== 1) return;
			var mouse = Util.getMouse(evt);
			clickHandler(mouse);
		});
	}

	// bind keyboard events
	$(window).keydown(function(evt){
		if(evt.which == Config.keys.space || evt.which == Config.keys.return){
			if($(titleDiv).is(":visible")){
				gameStart();
			}
			return;
		}
		// direction the snake is facing
		var dir = snakeHead.dir;
		// new direction
		var newdir = 0;
		switch (evt.which){
			case Config.keys.w:
			case Config.keys.up:
				if(dir == 0 || dir == 2) newDir = 1;
				break;
			case Config.keys.s:
			case Config.keys.down:
				if(dir == 0 || dir == 2) newDir = 3;
				break;
			case Config.keys.a:
			case Config.keys.left:
				if(dir == 1 || dir == 3) newDir = 2;
				break;
			case Config.keys.d:
			case Config.keys.right:
				if(dir == 1 || dir == 3) newDir = 0;
				break;
		}
		snakeHead.newDir = newDir;
	});

	// random place for food
	function randomPlace(gameWidth, gameHeight){
		return {
			x: Math.floor(Math.random()*gameWidth),
			y: Math.floor(Math.random()*gameHeight)
		}
	}

	//////////////////
	// Main control //
	//////////////////

	function gameStart(){
		setUp();
		$(titleDiv).hide();
		loop();

	}

	function gameEnd(){
		// stop game loop
		clearTimeout(loopID);
		// change title to game over
		//$("#titleLine").html("Game Over!");
		// show score
		$("#titleLine").html("Score: " + ((snakeHead.life - Config.startingLife) * (gameSpeedLevel+1)));

		$("#title button").prop('disabled', true);
		setTimeout(function(){
			$("#title button").prop('disabled', false);
		},1000);
		$(titleDiv).show();

	}

	function changeDifficulty(){
		gameSpeedLevel = (++gameSpeedLevel)%Config.speedLevels.length;
		gameSpeed = Config.speedLevels[gameSpeedLevel];
		updateGameSpeedLevelLabel();
	}
	function updateGameSpeedLevelLabel(){
		$("#gameSpeedLevel").html(gameSpeedLevel+1);
	}

	////////////
	// <game> //
	////////////
	//gameStart();
	updateGameSpeedLevelLabel();

	// expose main control to browser
	window.gameStart = gameStart;
	window.changeDifficulty = changeDifficulty;

});

// </main>
