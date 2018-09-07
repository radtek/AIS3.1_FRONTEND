module.exports = angular.module('bloodApply', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

var opt_qnz = {
    parent: 'doc',
    template: require('./bloodApply.html'),
    less: require('./bloodApply.less'),
    controller: require('./bloodApply.controller'),
    controllerAs: 'vm'
}

function route($stateProvider) {
    $stateProvider.state('midBloodApply', angular.merge({}, opt_qnz, {
        url: '/midBloodApply/:regOptId'
    }))
}