module.exports = angular.module('kb', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('kb', {
        parent: 'frame',
        url: '/kb',
        template: require('./kb.html'),
        less: require('./kb.less'),
        controller: require('./kb.controller')
    })
}