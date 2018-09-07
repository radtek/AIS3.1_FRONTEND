module.exports = repeatFinish;

repeatFinish.$inject = ['$timeout'];

function repeatFinish($timeout) {
    return {
        restrict: 'A',
        link: link
    }

    function link(scope, element, attrs) {
        if (scope.$last === true) {
            $timeout(function() {
                scope.$eval(attrs.repeatFinish);
            }, 500);
        }
    }
}
