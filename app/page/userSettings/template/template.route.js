module.exports = angular.module('template', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('template', {
        parent: 'frame',
        url: '/template',
        template: require('./template.html'),
        less: require('./template.less'),
        controller: require('./template.controller')
    })
}