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
		yellowCards: 1
	};

})();
