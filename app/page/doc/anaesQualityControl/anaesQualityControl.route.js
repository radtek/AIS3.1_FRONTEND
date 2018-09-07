module.exports = angular.module('anaesQualityControl', [])
    .config(route)
    .directive('anaesQualityControl', anaesQualityControl)
    .name;

route.$inject = ['$stateProvider'];

var opt_syzxyy = {
    parent: 'doc',
    template: require('./anaesQualityControl.html'),
    less: require('./anaesQualityControl.less'),
    controller: require('./anaesQualityControl.controller'),
    controllerAs: 'vm'
}

function route($stateProvider) {
    $stateProvider.state('anaesQualityControl', angular.merge({}, opt_syzxyy, {
        url: '/anaesQualityControl/:regOptId'
    }))
}

function anaesQualityControl() {
    return {
        template: require('./anaesQualityControl.html'),
        less: require('./anaesQualityControl.less'),
        controller: require('./anaesQualityControl.controller'),
        restrict: 'E',
        replact: true,
        scope: {}
    }
}