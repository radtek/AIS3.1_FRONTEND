module.exports = angular.module('userDefinedDoc', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('userDefinedDoc', {
        parent: 'tabs',
        url: '/userDefinedDoc',
        template: require('./userDefinedDoc.html'),
        less: require('./userDefinedDoc.less'),
        controller: require('./userDefinedDoc.controller'),
        controllerAs:"vm"
    });
}