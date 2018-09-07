module.exports = angular.module('hospital', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('hospital', {
    	parent: 'tabs',
        url: '/hospital',
        template: require('./hospital.html'),
        less: require('./hospital.less'),
        controller: require('./hospital.controller'),
        controllerAs: 'vm'
    });
}