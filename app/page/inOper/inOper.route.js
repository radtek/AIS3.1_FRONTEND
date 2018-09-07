module.exports = angular.module('inOper', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('inOper', {
        parent: 'frame',
        url: '/inOper',
        template: require('./inOper.html'),
        less: require('./inOper.less'),
        controller: require('./inOper.controller')
    })
}