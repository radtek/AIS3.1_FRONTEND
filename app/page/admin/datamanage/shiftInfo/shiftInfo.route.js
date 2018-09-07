module.exports = angular.module('shiftInfo', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('shiftInfo', {
    	parent: 'tabs',
        url: '/shiftInfo',
        template: require('./shiftInfo.html'),
        less: require('./shiftInfo.less'),
        controller: require('./shiftInfo.controller')
    });
}
