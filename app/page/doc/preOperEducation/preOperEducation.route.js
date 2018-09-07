module.exports = angular.module('preOperEducation', [])
    .config(route)
    .directive('docPrePublicity', docPrePublicity)
    .name;

route.$inject = ['$stateProvider'];


var opt = {
        parent: 'doc',
        template: require('./preOperEducation.html'),
        less: require('./preOperEducation.less'),
        controller:require('./preOperEducation.controller'),
        controllerAs: 'vm'
    }

function route($stateProvider) { //临澧麻醉术前宣教
    $stateProvider.state('preOperEducation', angular.merge({}, opt, {
        url: '/preOperEducation/:regOptId',
    }))
}
function docPrePublicity() {
    return {
         template: require('./preOperEducation.html'),
        less: require('./preOperEducation.less'),
        controller:require('./preOperEducation.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {},
    }
}