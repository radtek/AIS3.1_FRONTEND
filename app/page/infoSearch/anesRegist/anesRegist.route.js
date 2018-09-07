module.exports = angular.module('anesRegist', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('anesRegist', {
        parent: 'frame',
        url: '/anesRegist',
        template: require('./anesRegist.html'),
        less: require('./anesRegist.less'),
        controller: require('./anesRegist.controller')
    })
}