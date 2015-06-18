(function() {

    angular.module('SplitHtmlSample', ['angularSplitHtml'])
        .controller('SampleCtrl', ['$scope', function ($scope) {
            $scope.coucou = 'Hello';
        }]);
})();