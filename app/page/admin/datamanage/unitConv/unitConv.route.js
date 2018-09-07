module.exports = angular.module('unitConv', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('unitConv', {
    	parent: 'tabs',
        url: '/unitConv',
        template: require('../doctorType/doctorType.html'),
        controller: require('./unitConv.controller')
    });
}
