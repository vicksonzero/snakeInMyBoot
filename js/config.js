//var $ = require("jquery");

module.exports = (function () {
	console.log("config is run");
	return {
		debug: true,
		featureFlag: {
		},
		ui: {
			longPressTime: 300
		},
		boardRatio: 4/3,
		padding: 1,
		yellowCards: 1,
		speedLevels:[340, 270, 210, 160, 120, 90, 70, 60, 35]
	};

})();
