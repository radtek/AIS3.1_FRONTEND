module.exports = angular.module('anaesBillLog', [])
    .config(route)
    .directive('anaesBillLogSyzxyy', anaesBillLogSyzxyy)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('midAnaesBill_syzxyy', {
        parent: 'doc',
        url: '/midAnaesBill_syzxyy/:regOptId',
        template: require('./anaesBillLog_syzxyy.html'),
        less: require('./anaesBillLog.less'),
        controller: require('./anaesBillLog_syzxyy.controller'),
        controllerAs: 'vm'
    }).state('postAnaesBill_syzxyy', {
        parent: 'doc',
        url: '/postAnaesBill_syzxyy/:regOptId',
        template: require('./anaesBillLog_syzxyy.html'),
        less: require('./anaesBillLog.less'),
        controller: require('./anaesBillLog_syzxyy.controller'),
        controllerAs: 'vm'
    }).state('postAnaesBill_llzyyy', {
        parent: 'doc',
        url: '/postAnaesBill_llzyyy/:regOptId',
        template: require('./anaesBillLog_syzxyy.html'),
        less: require('./anaesBillLog.less'),
        controller: require('./anaesBillLog_syzxyy.controller'),
        controllerAs: 'vm'
    }).state('pacuAnaesBill_syzxyy', {
        parent: 'doc',
        url: '/pacuAnaesBill_syzxyy/:regOptId',
        template: require('./anaesBillLog_syzxyy.html'),
        less: require('./anaesBillLog.less'),
        controller: require('./anaesBillLog_syzxyy.controller'),
        controllerAs: 'vm'
    }).state('kyglAnaesBill_syzxyy', {
        parent: 'doc',
        url: '/kyglAnaesBill_syzxyy/:regOptId',
        template: require('./anaesBillLog_syzxyy.html'),
        less: require('./anaesBillLog.less'),
        controller: require('./anaesBillLog_syzxyy.controller'),
        controllerAs: 'vm',
        data: { readonly: true }
    }).state('xxcxAnaesBill_syzxyy', {
        parent: 'doc',
        url: '/xxcxAnaesBill_syzxyy/:regOptId',
        template: require('./anaesBillLog_syzxyy.html'),
        less: require('./anaesBillLog.less'),
        controller: require('./anaesBillLog_syzxyy.controller'),
        controllerAs: 'vm',
        data: { readonly: true }
    })
}

function anaesBillLogSyzxyy() {
    return {
        template: require('./anaesBillLog_syzxyy.html'),
        less: require('./anaesBillLog.less'),
        controller: require('./anaesBillLog_syzxyy.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}
