module.exports = angular.module('typePatly', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

var opt_qnz = {
    parent: 'doc',
    template: require('./typePatly.html'),
    controller: require('./typePatly.controller'),
    controllerAs: 'vm'
}

function route($stateProvider) {
    $stateProvider.state('midTypePatly_nhfe', angular.merge({}, opt_qnz, {
        url: '/midTypePatly_nhfe/:regOptId'
    })).state('midTypePatly_qnz', angular.merge({}, opt_qnz, {
        url: '/midTypePatly_qnz/:regOptId'
    }))
}