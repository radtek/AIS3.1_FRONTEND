module.exports = angular.module('operRoomConfig', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('operRoomConfig', {
        parent: 'frame',
        url: '/operRoomConfig',
        template: require('./operRoomConfig.html'),
        less: require('./operRoomConfig.less'),
        controller: require('./operRoomConfig.controller')
    })
}