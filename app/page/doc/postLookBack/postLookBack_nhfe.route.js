module.exports = angular.module('postLookBack', [])
    .config(route)    
    .directive('postLookBackYxrm', postLookBackYxrm)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('postLookBack_yxrm', {      // 永兴人民 | 术后访视
        parent: 'doc',
        url: '/postLookBack_yxrm/:regOptId',
        template: require('./postLookBack_nhfe.html'),
        controller: require('./postLookBack_nhfe.controller'),
        less: require('./postLookBack_nhfe.less'),
        controllerAs: 'vm',
        data: {print: false}
    })
}

function postLookBackYxrm() {
    return {
        template: require('./postLookBack_nhfe.html'),
        controller: require('./postLookBack_nhfe.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {},
        data: {print: true}
    }
}