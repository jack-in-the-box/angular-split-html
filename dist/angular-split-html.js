/*! 
 * angular-split-html v0.0.0
 * https://github.com/chieffancypants/angular-split-html/
 * Copyright (c) 2015 Aurélien Masfrand
 * License: MIT
 */
(function() {

	'use strict';

	angular.module('angularSplitHtml', [])
		.service('SplitHtml', SplitHtml);

	function SplitHtml() {
		var self = this;

		self.init = function() {
			return true;
		};

		self.init();
	}
})();