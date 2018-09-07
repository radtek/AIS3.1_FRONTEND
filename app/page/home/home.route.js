module.exports = angular.module('home', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('home', {
        parent: 'frame',
        url: '/home',
        template: require('./home.html'),
        less: require('./home.less'),
        controller: require('./home.controller')
    }).state('index', {
        parent: 'frame',
        url: '/index',
        template: require('./home2.html'),
        less: require('./home.less'),
        controller: require('./home2.controller')
    });
}
