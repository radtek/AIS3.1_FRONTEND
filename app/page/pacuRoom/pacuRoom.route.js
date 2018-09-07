module.exports = angular.module('pacuroom', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('pacuroom', {
        parent: 'frame',
        url: '/pacuroom',
        template: require('./pacuRoom.html'),
        less: require('./pacuRoom.less'),
        controller: require('./pacuRoom.controller.js')
    })
}
