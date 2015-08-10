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
		}
	};

})();
