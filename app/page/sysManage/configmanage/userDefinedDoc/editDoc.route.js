module.exports = angular.module('editDoc', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('editDoc', {
        parent: 'tabs',
        url: '/editDoc/:docThemeId',
        template: require('./editDoc.html'),
        less: require('./editDoc.less'),
        controller: require('./editDoc.controller')
    });
}