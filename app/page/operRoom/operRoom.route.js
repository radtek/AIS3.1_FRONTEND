module.exports = angular.module('operroom', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('operroom', {
        parent: 'frame',
        url: '/operroom',
        template: require('./operRoom.html'),
        less: require('./operRoom.less'),
        controller: require('./operRoom.controller')
    })
}