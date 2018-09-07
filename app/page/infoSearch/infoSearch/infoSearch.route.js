module.exports = angular.module('infoSearch', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('infoSearch', {
        parent: 'frame',
        url: '/infoSearch',
        template: require('./infoSearch.html'),
        less: require('./infoSearch.less'),
        controller: require('./infoSearch.controller')
    })
}