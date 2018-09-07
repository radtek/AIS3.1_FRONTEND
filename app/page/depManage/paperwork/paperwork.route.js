module.exports = angular.module('paperwork', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('paperwork', {
        parent: 'frame',
        url: '/paperwork',
        template: require('./paperwork.html'),
        less: require('./paperwork.less'),
        controller: require('./paperwork.controller')
    })
}