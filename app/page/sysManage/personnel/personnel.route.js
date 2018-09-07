module.exports = angular.module('personnel', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('personnel', {
        parent: 'tabs',
        url: '/personnel',
        template: require('./personnel.html'),
        less: require('./personnel.less'),
        controller: require('./personnel.controller')
    }).state('userGroupMgt', {
    	parent: 'tabs',
        url: '/userGroupMgt',
        template: require('./userGroupMgt.html'),
        less: require('./personnel.less'),
        controller: require('./userGroupMgt.controller')
    });
}