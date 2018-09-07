module.exports = angular.module('adminmonitorconfig', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('adminmonitorconfig', {
    	parent: 'tabs',
        url: '/adminmonitorconfig',
        template: require('./monitorconfig.html'),
        less: require('./monitorconfig.less'),
        controller: require('./monitorconfig.controller'),
        controllerAs: 'vm'
    });
}