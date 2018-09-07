module.exports = angular.module('laborAnalgesia', [])
    .config(route)
    .directive('laborAnalgesia', laborAnalgesia)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('laborAnalgesia', {
        parent: 'doc',
        url: '/laborAnalgesia/:regOptId',
        template: require('./laborAnalgesia.html'),
        less: require('./laborAnalgesia.less'),
        controller: require('./laborAnalgesia.controller'),
        controllerAs: 'vm'
    })
}

function laborAnalgesia() {
    return {
        template: require('./laborAnalgesia.html'),
        less: require('./laborAnalgesia.less'),
        controller: require('./laborAnalgesia.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}
