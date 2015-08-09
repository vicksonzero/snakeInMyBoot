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
	var gameSpeed = 300;
	var map = [];

	var renderID = -1;
	var loopID = -1;

	function screenResizeHandler() {

		gameDivSize = screenSize(gameDiv, Config.boardRatio);

		gameDiv.width = gameDivSize.x;
		gameDiv.height = gameDivSize.y;

		screenSize(titleDiv, Config.boardRatio);
		$(titleDiv).css("font-size", 52/500*gameDivSize.x+"px");
	}

	// bind windows resize to screenSize.js
	$(window).resize(screenResizeHandler);

	// initial run
	screenResizeHandler();

	function newMap() {
		'use strict';
		var map = [];
		gameMetrics.x = 20;
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
		map = newMap();
	}
	// game set up
	function setUp(){
		gameReset();
		snakeHead = Head.create(5,10, 5, 0, map);
		snakeHead.onGameoverCallback = gameEnd;
	}

	function loop(){
		console.log("loop");
		loopID = setTimeout(loop, gameSpeed);
		if(snakeHead.move(gameMetrics)){

			Body.all(function(element){
				element.step();
			});
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
		map.forEach(function(element, index, array){
			element.forEach(function(element, index, array){
				if(element === -1) return;
				var body = Body.get(element);
				if(body == null) return;
				body.render(gameDiv, gameDivSize, boxSize, Config.padding);
			});
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

	function gameStart(){
		setUp();
		$(titleDiv).hide();
		loop();

	}
	window.gameStart = gameStart;

	function gameEnd(){
		clearTimeout(loopID);
		$(titleDiv).show();

	}

	// <main>
	//gameStart();

});

// </main>
