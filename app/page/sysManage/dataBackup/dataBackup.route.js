module.exports = angular.module('dataBackup', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('dataBackup', {
        parent: 'frame',
        url: '/dataBackup',
        template: require('./dataBackup.html'),
        less: require('./dataBackup.less'),
        controller: require('./dataBackup.controller')
    })
}