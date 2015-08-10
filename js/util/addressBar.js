// addressBar.js

// breaks address into get parameters
//
// function AddressBar(getStirngs)
// public methods:
//     hasValueOrNot : function(key, trueVal, falseVal);
//     getValue      : function(key, defaultVal, allowUndefined);
//     getValues     : function(key, defaultVal);
// public field:
//     p.params      : {"key":[value],"key2":[value1,value2,value1]};

// usage:
// in the webpage:
// www.mycandymachine.com/index?debug&machineColor=red&candies=chocolate&candies=toffee
//
// var addressBar = new AddressBar(location.search);
//
// var doDebugOrNot = addressBar.hasValueOrNot("debug", true, false);
// var allowUndefined = false;
// machineColor = addressBar.getValue(
//     "machineColor",
//     "white",
//     allowUndefined
// );
// candies = addressBar.getValues(
//     "candies",
//     ["default1","default2"],
//     allowUndefined
// );




module.exports = (function() {

	function AddressBar(getStirngs) {
		this.params = parseURLParam(getStirngs);
	};
	var p = AddressBar.prototype;
	// public methods
	// p.hasValueOrNot = function(key, trueVal, falseVal);
	// p.getValue      = function(key, defaultVal, allowUndefined);
	// p.getValues     = function(key, defaultVal);

	p.hasValueOrNot = function(key, trueVal, falseVal) {
		if (trueVal === undefined) trueVal = true;
		if (falseVal === undefined) falseVal = false;

		if (this.params.hasOwnProperty(key)) {
			return trueVal;
		} else {
			return falseVal;
		}
	};
	p.getValue = function getValue(key, defaultVal, allowUndefined) {
		if (defaultVal === undefined) defaultVal = null;
		if (allowUndefined === undefined) allowUndefined = false;

		if (this.params.hasOwnProperty(key)) {
			if ( this.params[key][0] != "undefined" || allowUndefined ) {
				return this.params[key][0];
			} else {
				return defaultVal;
			}
		} else {
			return defaultVal;
		}
	};
	p.getValues = function(key, defaultVal) {
		if (defaultVal === undefined) defaultVal = null;

		if (this.params.hasOwnProperty(key)) {
			return this.params[key];
		} else {
			return defaultVal;
		}
	};
	p.toString = function(){
		return JSON.stringify(this.params);
	};



	return AddressBar;


	/**
	 * turns get-part of the URL (eg: after the ? sign) into tokens of GET parameters
	 * in the form of "key":["value","value"...]
	 * @param  {string}               getStirngs the part after ?
	 * @return {associative array[
	 *         					"key":["value","value"]
	 *         					]}    dictionary of processed GET parameters
	 */
	function parseURLParam(getStirngs) {
		var qd = {}
		var tmp;
		getStirngs
			.replace("?", "")
			.split("&")
			.forEach(function(item) {
				tmp = item.split("=");
				if (tmp[0] in qd) {
					qd[tmp[0]].push(decodeURIComponent(tmp[1]));
				} else {
					qd[tmp[0]] = [decodeURIComponent(tmp[1]), ];
				}
			});
		return qd;
	}

})();
