//var $ = require("jquery");

module.exports = (function () {
	console.log("config is run");
	return {
		debug: true,
		featureFlag: {
		},
		boardRatio: 4/3,
		padding: 1,
		speedLevels:[340, 270, 210, 160, 120, 90, 70, 60, 35],
		yellowCards: 1,
		startingLife:5,
		ui: {
			longPressTime: 300
		},
		keys:{
			"w": 87,
			"s": 83,
			"a": 65,
			"d": 68,
			"up": 38,
			"down": 40,
			"left": 37,
			"right": 39,
			"space": 32,
			"return": 13
		},
		readmeText:{
			"snake":           "Tap the side of the snake to steer. Do not touch the wall or the snake's body.",
			"clockwise":       "Tap the left/right screen to steer the snake clockwise/counterclockwise. Do not touch the wall or the snake's body.",
			"gestureDiscrete": "Tap the screen to steer the snake. Do not touch the wall or the snake's body.",
			"gestureContinue": "Tap the screen to steer the snake. Do not touch the wall or the snake's body."
		}
	};

})();
