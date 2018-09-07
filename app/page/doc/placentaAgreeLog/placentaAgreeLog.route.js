module.exports = angular.module('placentaAgreeLog', [])
    .config(route)
    .directive('placentaAgreeLog', placentaAgreeLog)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('prePlacentaAgreeLog_sybx', {    // 术前访视(沈阳本溪版本)
        parent: 'doc',
        url: '/prePlacentaAgreeLog_sybx/:regOptId',
        template: require('./placentaAgreeLog.html'),
        less: require('./placentaAgreeLog.less'),
        controller: require('./placentaAgreeLog.controller'),
        controllerAs: 'vm'
    }).state('postPlacentaAgreeLog_sybx', {    // 术后访视(沈阳本溪版本)
        parent: 'doc',
        url: '/postPlacentaAgreeLog_sybx/:regOptId',
        template: require('./placentaAgreeLog.html'),
        less: require('./placentaAgreeLog.less'),
        controller: require('./placentaAgreeLog.controller'),
        controllerAs: 'vm'
    }).state('placentaAgreeLog_kycx_sybx', {    // 沈阳本溪 | 科研管理
        parent: 'doc',
        url: '/placentaAgreeLog_kycx_sybx/:regOptId',
        template: require('./placentaAgreeLog.html'),
        less: require('./placentaAgreeLog.less'),
        controller: require('./placentaAgreeLog.controller'),
        controllerAs: 'vm',
        data: { readonly : true }
    }).state('placentaAgreeLog_xxcx_sybx', {    // 沈阳本溪 | 信息查询
        parent: 'doc',
        url: '/placentaAgreeLog_xxcx_sybx/:regOptId',
        template: require('./placentaAgreeLog.html'),
        less: require('./placentaAgreeLog.less'),
        controller: require('./placentaAgreeLog.controller'),
        controllerAs: 'vm',
        data: { readonly : true }
    })
}

function placentaAgreeLog() {
    return {
        template: require('./placentaAgreeLog.html'),
        less: require('./placentaAgreeLog.less'),
        controller: require('./placentaAgreeLog.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}
