module.exports = angular.module('transfusionCheck', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

var opt_qnz = {
    parent: 'doc',
    template: require('./metachysis.html'),
    less: require('./transfusionCheck.less'),
    controller: require('./metachysis.controller'),
    controllerAs: 'vm'
}

function route($stateProvider) {
    $stateProvider.state('metachysis_qnz', angular.merge({}, opt_qnz, {
        url: '/metachysis/:regOptId'
    }))
}