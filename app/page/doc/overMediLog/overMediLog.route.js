module.exports = angular.module('overMediLog', [])
    .config(route)
    .directive('overMediLog', overMediLog)
     .directive('overMediLogSybx', overMediLogSybx)
    .name;

route.$inject = ['$stateProvider'];

var base = {
    parent: 'doc',
    template: require('./overMediLog.html'),
    less: require('./overMediLog.less'),
    controller: require('./overMediLog.controller'),
    controllerAs: 'vm'
}
var sybx={
    template: require('./overMediLog_sybx.html'),
    controller: require('./overMediLog_sybx.controller'),
}
function route($stateProvider) {
    $stateProvider.state('overMediLog', angular.merge({}, base, {  // 黔南州 》术前
        url: '/overMediLog/:regOptId'
    })).state('midOverMediLog', angular.merge({}, base, {  // 黔南州 》术后
        url: '/midOverMediLog/:regOptId'
    })).state('overMediLog2', angular.merge({}, base, {  // 黔南州 》术后
        url: '/overMediLog2/:regOptId'
    })).state('overMediLog_xxcx', angular.merge({}, base, {  // 黔南州 》信息查询
        url: '/overMediLog_xxcx/:regOptId',
        data: { readonly: true }
    })).state('overMediLog_kycx', angular.merge({}, base, {  // 黔南州 》科研管理
        url: '/overMediLog_kycx/:regOptId',
        data: { readonly: true }
    })).state('overMediLog_sybx', angular.merge({}, base,sybx,{  // 本溪 | 术前访视 》查看
        url: '/overMediLog_sybx/:regOptId',
    })).state('overMediLog_xxcx_sybx', angular.merge({}, base,sybx, {  // // 本溪 | 信息查询 》查看
        url: '/overMediLog_xxcx_sybx/:regOptId',
        data: { readonly: true }
    })).state('overMediLog_kycx_sybx', angular.merge({}, base,sybx, {  // 本溪 | 科研查询 》查看 
        url: '/overMediLog_kycx_sybx/:regOptId',
        data: { readonly: true }
    })).state('overMediLog2_sybx', angular.merge({}, base,sybx, {  //
        url: '/overMediLog2_sybx/:regOptId',
        data: { readonly: false }
    }))
}

function overMediLog() {
    return {
        template: require('./overMediLog.html'),
        less: require('./overMediLog.less'),
        controller: require('./overMediLog.controller'),
        restrict: 'E',
        replact: true,
        scope: {}
    }
}
function overMediLogSybx() {
    return {
        template: require('./overMediLog_sybx.html'),
        less: require('./overMediLog.less'),
        controller: require('./overMediLog_sybx.controller'),
        restrict: 'E',
        replact: true,
        scope: {}
    }
}