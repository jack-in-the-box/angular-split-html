(function() {

    angular.module('SplitHtmlSample', ['angularSplitHtml'])
        .controller('SampleCtrl', ['$scope', 'SplitHtml', function ($scope, SplitHtml) {
            $scope.split = function() {
            	$scope.output = SplitHtml.divide($scope.input);
            }
        }]);
})();