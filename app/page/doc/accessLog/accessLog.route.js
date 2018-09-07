module.exports = angular.module('accessLog', [])
    .config(route)
      .directive('accessLogSybx', accessLogSybx)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('accessLog_sybx', {    // 术前访视(沈阳本溪版本)
        parent: 'doc',
        url: '/accessLog_sybx/:regOptId',
        template: require('./accessLog_sybx.html'),
        less: require('./accessLog.less'),
        controller: require('./accessLog_sybx.controller'),
        data: { readonly: false }
    }).state('accessLog_xxcx_sybx', {    // 沈阳本溪 | 信息查询 》 查看
        parent: 'doc',
        url: '/accessLog_xxcx_sybx/:regOptId',
        template: require('./accessLog_sybx.html'),
        less: require('./accessLog.less'),
        controller: require('./accessLog_sybx.controller'),
        data: { readonly: true }
    }).state('accessLog2_sybx', {    // 术后访视(沈阳本溪版本)
        parent: 'doc',
        url: '/accessLog2_sybx/:regOptId',
        template: require('./accessLog_sybx.html'),
        less: require('./accessLog.less'),
        controller: require('./accessLog_sybx.controller'),
        data: { readonly: false }
    }).state('accessLog_kycx_sybx', {    // 科研管理 》 查看
        parent: 'doc',
        url: '/accessLog_kycx_sybx/:regOptId',
        template: require('./accessLog_sybx.html'),
        less: require('./accessLog.less'),
        controller: require('./accessLog_sybx.controller'),
        data: { readonly: true }
    })
}

function accessLogSybx() {
    return {
        template: require('./accessLog_sybx.html'),
        less: require('./accessLog.less'),
        controller: require('./accessLog_sybx.controller'),
        restrict: 'E',
        replact: true,
        scope: {}
    }
}