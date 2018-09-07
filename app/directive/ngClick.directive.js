module.exports = ngClick;

ngClick.$inject = ['$rootScope', '$timeout'];

function ngClick($rootScope, $timeout) {
    return {
        restrict: 'AE',
        scope: false,
        link: function(scope, iElement, iAttrs) {
            iElement.on('click', function() {
                $rootScope.iElement = iElement;
            });
        }
    }
}