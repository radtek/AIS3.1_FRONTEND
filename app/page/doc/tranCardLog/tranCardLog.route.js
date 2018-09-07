module.exports = angular.module('tranCardLog', [])
    .config(route)
    .directive('tranCardLog', tranCardLog)
    .name;

route.$inject = ['$stateProvider'];

var opt_qnz = {
    parent: 'doc',
    template: require('./tranCardLog.html'),
    less: require('./tranCardLog.less'),
    controller: require('./tranCardLog.controller'),
    controllerAs: 'vm'
}

function route($stateProvider) {
    $stateProvider.state('preTranCardLog_nhfe', angular.merge({}, opt_qnz, {
        url: '/preTranCardLog_nhfe/:regOptId'
    }))
}

function tranCardLog() {
    return {
        template: require('./tranCardLog.html'),
        less: require('./tranCardLog.less'),
        controller: require('./tranCardLog.controller'),
        restrict: 'E',
        replact: true,
        scope: {}
    }
}