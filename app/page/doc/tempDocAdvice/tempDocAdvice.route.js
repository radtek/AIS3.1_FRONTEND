module.exports = angular.module('tempDocAdvice', [])
    .config(route)
    .directive('tempDocAdvice', tempDocAdvice)
    .name;

route.$inject = ['$stateProvider'];

var opt_qnz = {
    parent: 'doc',
    template: require('./tempDocAdvice.html'),
    less: require('./tempDocAdvice.less'),
    controller: require('./tempDocAdvice.controller'),
    controllerAs: 'vm'
}

function route($stateProvider) {
    $stateProvider.state('midTempDocAdvice', angular.merge({}, opt_qnz, {
        url: '/midTempDocAdvice/:regOptId'
    }))
}

function tempDocAdvice() {
    return {
        template: require('./tempDocAdvice.html'),
        less: require('./tempDocAdvice.less'),
        controller: require('./tempDocAdvice.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}