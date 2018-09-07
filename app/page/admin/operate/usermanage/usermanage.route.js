module.exports = angular.module('usermanage', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('usermanage', {
    	parent: 'tabs',
        url: '/usermanage',
        template: require('./usermanage.html'),
        less: require('./usermanage.less'),
        controller: require('./usermanage.controller')
    });
}