module.exports = whenScrolled;

whenScrolled.$inject = ['$timeout', 'IHttp'];

function whenScrolled($timeout, IHttp) {
    return {
        restrict: 'EA',
        replace: true,
        controller: ['$scope', '$element', '$timeout', controller],
        link: link
    }

    function controller($scope, $element) {
        
    }

    function link(scope, element, attr) {
		var obj = element[0];
		element.bind('scroll', function() {
			if (obj.scrollTop + obj.offsetHeight >= obj.scrollHeight) {
				scope.$apply(attr.whenScrolled);
			}
		});
    }
}