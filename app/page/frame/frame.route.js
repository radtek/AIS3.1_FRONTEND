module.exports = angular.module('frame', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('frame', {
        template: require('./frame.html'),
        less: require('./frame.less'),
        controller: require('./frame.controller'),
        controllerAs: 'vm'
    });
}


