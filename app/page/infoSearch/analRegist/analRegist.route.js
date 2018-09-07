module.exports = angular.module('analRegist', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('analRegist', {
        parent: 'frame',
        url: '/analRegist',
        template: require('./analRegist.html'),
        less: require('./analRegist.less'),
        controller: require('./analRegist.controller')
    })
}