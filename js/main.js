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

// </local functions>


// <main>

// done on document load
$(function () {

	////////////////////////
	// screensize problem //
	////////////////////////

	var titleDiv = $("#title").get()[0];
	var gameDiv = $("#game").get()[0];
	var gameDivSize = {x:0,y:0};
	var snakeHead = null;
	var gameMetrics = {x:0,y:0};
	var gameSpeedLevel = Math.floor(Config.speedLevels.length/2);
	var gameSpeed = Config.speedLevels[gameSpeedLevel];
	var map = [];

	var renderID = -1;
	var loopID = -1;

	function screenResizeHandler() {

		gameDivSize = screenSize(gameDiv, Config.boardRatio);

		gameDiv.width = gameDivSize.x;
		gameDiv.height = gameDivSize.y;

		screenSize(titleDiv, Config.boardRatio);
		$(titleDiv).css("font-size", 52/500*gameDivSize.x+"px");
		$("#title button").css("font-size", 22/500*gameDivSize.x+"px");
	}

	// bind windows resize to screenSize.js
	$(window).resize(screenResizeHandler);

	// initial run
	screenResizeHandler();

	function newMap() {
		'use strict';
		var map = [];
		gameMetrics.x = 16;
		gameMetrics.y = Math.floor(gameMetrics.x / Config.boardRatio);

		for (var i = 0; i < gameMetrics.y; i++) {
			var row = [];
			for (var j = 0; j < gameMetrics.x; j++) {
				row.push(-1);
			}
			map.push(row);
		}
		return map;

	}
	//console.log(map);
	function gameReset(){
		Head.resetInstanceList();
		Body.resetInstanceList();
		Food.resetInstanceList();
		map = newMap();
	}
	// game set up
	function setUp(){
		gameReset();
		snakeHead = Head.create(0,10, 5, 0, map);
		snakeHead.onGameoverCallback = gameEnd;

		var startLife = snakeHead.life;
		for (var i = 0; i < startLife; i++) {
			snakeHead.move(gameMetrics);
			// move body parts
			Body.all(function(element){
				element.step();
			});
		}

		var newFood = Food.create(0, 0, map);
		newFood.move(gameMetrics);
	}

	function loop(){
		console.log("loop");
		loopID = setTimeout(loop, gameSpeed);
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
		};

	}
	// render loop
	function render(){
		//console.log("HI");
		renderID = requestAnimationFrame(render);
		var ctx = gameDiv.getContext("2d");
		ctx.clearRect(0, 0, gameDiv.width, gameDiv.height);

		var boxSize = {x:0,y:0};
		boxSize.x = gameDivSize.x / gameMetrics.x;
		boxSize.y = gameDivSize.y / gameMetrics.y;
		Body.all(function(element){
			element.render(gameDiv, gameDivSize, boxSize, Config.padding);
		});

		Food.all(function(element){
			element.render(gameDiv, gameDivSize, boxSize, Config.padding);
		});
		if(snakeHead)snakeHead.render(gameDiv, gameDivSize, boxSize, Config.padding);
	}
	render();

	function clickHandler(mousePoint){
		//console.log(mousePoint);

		var boxSize = {x:0,y:0};
		boxSize.x = gameDivSize.x / gameMetrics.x;
		boxSize.y = gameDivSize.y / gameMetrics.y;

		var globalPos = snakeHead.getGlobalPosCenter(boxSize);
		var dir = snakeHead.dir;

		var newDir = 0;
		if(dir == 0 || dir == 2){
			if(globalPos.y - mousePoint.y > 1) newDir = 1;
			if(mousePoint.y - globalPos.y  > 1) newDir = 3;
		}
		if(dir == 1 || dir == 3){
			if(globalPos.x - mousePoint.x > 1) newDir = 2;
			if(mousePoint.x - globalPos.x  > 1) newDir = 0;
		}

		snakeHead.newDir = newDir;
	}
	// bind mouse event
	$(gameDiv).mousedown(function(evt){
		if(evt.which !== 1) return;
		var mouse = Util.getMouse(evt);
		clickHandler(mouse);
	});

	function randomPlace(gameWidth, gameHeight){
		return {
			x: Math.floor(Math.random()*gameWidth),
			y: Math.floor(Math.random()*gameHeight)
		}
	}

	function gameStart(){
		setUp();
		$(titleDiv).hide();
		loop();

	}

	function gameEnd(){
		clearTimeout(loopID);
		$("#titleLine").html("Game Over!");
		$("#title button").css("opacity",0.7);
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

	// <main>
	//gameStart();
	updateGameSpeedLevelLabel();
	window.gameStart = gameStart;
	window.changeDifficulty = changeDifficulty;

});

// </main>
