module.exports = angular.module('rolemanage', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('rolemanage', {
    	parent: 'tabs',
        url: '/rolemanage',
        template: require('./rolemanage.html'),
        less: require('./rolemanage.less'),
        controller: require('./rolemanage.controller')
    });
}