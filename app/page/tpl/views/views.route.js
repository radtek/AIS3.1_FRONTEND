module.exports = angular.module('view', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('view', {
        parent: 'frame',
        url: '/view',
        template: require('./views.html'),
        less: require('./views.less'),
        controller: require('./views.controller')
    })
}