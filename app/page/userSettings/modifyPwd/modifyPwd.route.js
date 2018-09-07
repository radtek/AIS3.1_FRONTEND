module.exports = angular.module('modifyPwd', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('modifyPwd', {
        parent: 'frame',
        url: '/modifyPwd',
        template: require('./modifyPwd.html'),
        less: require('./modifyPwd.less'),
        controller: require('./modifyPwd.controller'),
        controllerAs: 'vm'
    })
}