//var $ = require("jquery");
var Config = require("../config");
module.exports = (function () {
	var Util = {};

	/**
	 * modifies targetObj to fill in missing default values
	 * useful for function options
	 * usage:
	 * function foo(opts){
	 *   var defaultOpt = {x:0,y:0,size:100};
	 *   Util.mergeDefault(opts,defaultOpt);
	 *   // do something with opts
	 * }
	 * @param  {Value Object} targetObj  given options object
	 * @param  {Value Object} defaultObj object of expected values and their default values
	 */
	Util.mergeDefault = function mergeDefault(targetObj, defaultObj) {
		for (var attrname in defaultObj) {
			if (!targetObj.hasOwnProperty(attrname)) {
				targetObj[attrname] = defaultObj[attrname];
			}
		}
	};
	/**
	 * String stringReplace(str[,replacements...]);
	 * formats the strings, replaces placeholders like {1} with arguments
	 * {1} counts from 1
	 * @return {[type]} [description]
	 */
	Util.stringReplace = function stringReplace() {
		var args = arguments;
		return args[0].replace(/\{(\d+)\}/, function (match, number) {
			return typeof args[number] != 'undefined' ?
				args[number] : match;
		});
	};
	// use [].join(); instead

	Util.pointDistanceSq = function _pointDistanceSq(x1, y1, x2, y2) {
		return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
	};

	Util.pointDistance = function _pointDistance(x1, y1, x2, y2) {
		return Math.sqrt(Util.pointDistanceSq(x1, y1, x2, y2));
	};


	Util.getMouse = function getMouse(event) {
		var mx = event.pageX - event.target.offsetLeft;
		var my = event.pageY - event.target.offsetTop;
		return {
			x: mx,
			y: my
		};
	};

	return Util;
})();
