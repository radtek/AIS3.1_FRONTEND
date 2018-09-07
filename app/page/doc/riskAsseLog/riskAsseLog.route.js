module.exports = angular.module('riskAsseLog', [])
    .config(route)
     .directive('riskAsseLogSybx', riskAsseLogSybx)
    .name;

route.$inject = ['$stateProvider'];

var opt_qnz = {
    parent: 'doc',
    template: require('./riskAsseLog.html'),
    less: require('./riskAsseLog.less'),
    controller: require('./riskAsseLog.controller'),
    controllerAs: 'vm'
}

function route($stateProvider) {
    $stateProvider.state('riskAsseLog_kycx_sybx', angular.merge({}, opt_qnz, {  // 科研查询 》查看````
         url: '/riskAsseLog_kycx_sybx/:regOptId',
        data: { readonly: true }
    })).state('riskAsseLog_sybx', angular.merge({}, opt_qnz, { // 术前访视(沈阳本溪版本)``````
         url: '/riskAsseLog_sybx/:regOptId',
          data: { readonly: false }
    })).state('midRiskAsseLog_sybx', angular.merge({}, opt_qnz, { // 术中巡视(沈阳本溪版本)```
         url: '/midRiskAsseLog_sybx/:regOptId',
        data: { readonly: false }
    })).state('riskAsseLog2_sybx', angular.merge({}, opt_qnz, {  // 术后访视(沈阳本溪版本)`````
        url: '/riskAsseLog2_sybx/:regOptId',
        data: { readonly: false }
    })).state('riskAsseLog_xxcx_sybx', angular.merge({}, opt_qnz, {  // 沈阳本溪 | 信息查询 》查看```
         url: '/riskAsseLog_xxcx_sybx/:regOptId',
        data: { readonly: true }
    }))
}

function riskAsseLogSybx() {
    return {
        template: require('./riskAsseLog.html'),
        less: require('./riskAsseLog.less'),
        controller: require('./riskAsseLog.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}