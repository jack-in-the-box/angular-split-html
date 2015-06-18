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