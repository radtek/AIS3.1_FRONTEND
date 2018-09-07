module.exports = angular.module('menu', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('menu', {
    	parent: 'tabs',
        url: '/menu',
        template: require('./menu.html'),
        less: require('./menu.less'),
        controller: require('./menu.controller')
    });
}