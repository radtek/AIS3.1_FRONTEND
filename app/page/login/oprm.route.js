module.exports = angular.module('login', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('login', {
        url: '/',
        template: require('./login.html'),
        less: require('./login.less'),
        controller: require('./login.controller'),
        data: 'oprm'
    })
}
