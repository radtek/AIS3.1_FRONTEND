module.exports = angular.module('safetyVerifLog', [])
    .config(route)
    .directive('safetyVerifLog', safetyVerifLog)
    .directive('safetyVerifLogSybx', safetyVerifLogSybx)
    .directive('safetyVerifLogSyzxyy', safetyVerifLogSyzxyy)
    .name;

route.$inject = ['$stateProvider'];
var opt_qnzzyyy={
    parent: 'doc',
    template: require('./safetyVerifLog_qnzzyyy.html'),
    less: require('./safetyVerifLog_qnzzyyy.less'),
    controller: require('./safetyVerifLog.controller'),
    controllerAs: 'vm'
}
var opt_syzxyy={
    parent: 'doc',
    template: require('./safetyVerifLog_syzxyy.html'),
    less: require('./safetyVerifLog_qnzzyyy.less'),
    controller: require('./safetyVerifLog_syzxyy.controller'),
    controllerAs: 'vm'
}
function route($stateProvider) {
    $stateProvider.state('safetyVerifLog_qnzzzyy', angular.merge({}, opt_qnzzyyy, {  // 黔南州 》术前
        url: '/safetyVerifLog_qnzzzyy/:regOptId',
    })).state('postsafetyVerifLog_qnzzyyy', angular.merge({}, opt_qnzzyyy, {  // 黔南州 》术后
        url: '/postsafetyVerifLog_qnzzyyy/:regOptId',
    })).state('xxcxSafetyVerifLog_qnzzyyy', angular.merge({}, opt_qnzzyyy, {  // 黔南州 》信息查询
        url: '/xxcxSafetyVerifLog_qnzzyyy/:regOptId',
        data: { readonly: true }
    })).state('kyglSafetyVerifLog_qnzzyyy', angular.merge({}, opt_qnzzyyy, {  // 黔南州 》科研管理
        url: '/kyglSafetyVerifLog_qnzzyyy/:regOptId',
        data: { readonly: true }
    })).state('insafetyVerifLog_qnzzzyy', angular.merge({}, opt_qnzzyyy, {  // 黔南州 》手术室
        url: '/insafetyVerifLog_qnzzzyy/:regOptId'
    })).state('preSafetyVerifLog_syzxyy', angular.merge({}, opt_syzxyy, {
        url: '/preSafetyVerifLog_syzxyy/:regOptId',
    })).state('midSafetyVerifLog_syzxyy', angular.merge({}, opt_syzxyy, {
        url: '/midSafetyVerifLog_syzxyy/:regOptId',
    })).state('postSafetyVerifLog_syzxyy', angular.merge({}, opt_syzxyy, {
        url: '/postSafetyVerifLog_syzxyy/:regOptId',
    })).state('xxcxSafetyVerifLog_syzxyy', angular.merge({}, opt_syzxyy, {
        url: '/xxcxSafetyVerifLog_syzxyy/:regOptId',
        data: { readonly: true }
    })).state('kyglSafetyVerifLog_syzxyy', angular.merge({}, opt_syzxyy, {
        url: '/kyglSafetyVerifLog_syzxyy/:regOptId',
        data: { readonly: true }
    })).state('safetyVerifLog_kycx_sybx', {       // 科研查询 》 查看(沈阳本溪版本)``
        parent: 'doc',
        url: '/safetyVerifLog_kycx_sybx/:regOptId',
        template: require('./safetyVerifLog_sybx.html'),
        less: require('./safetyVerifLog_sybx.less'),
        controller: require('./safetyVerifLog_sybx.controller'),
        data: { readonly: true }
    }).state('postSafetyVerifLog_sybx', {    // 术后访视(沈阳本溪版本)```
        parent: 'doc',
        url: '/postSafetyVerifLog_sybx/:regOptId',
        template: require('./safetyVerifLog_sybx.html'),
        less: require('./safetyVerifLog_sybx.less'),
        controller: require('./safetyVerifLog_sybx.controller'),
        data: { readonly: false }
    }).state('midSafetyVerifLog_sybx', {    // 术中巡视(沈阳本溪版本)``
        parent: 'doc',
        url: '/midSafetyVerifLog_sybx/:regOptId',
        template: require('./safetyVerifLog_sybx.html'),
        less: require('./safetyVerifLog_sybx.less'),
        controller: require('./safetyVerifLog_sybx.controller'),
        data: { readonly: false }
    })
}

function safetyVerifLog() {
    return {
        template: require('./safetyVerifLog_qnzzyyy.html'),
        less: require('./safetyVerifLog_qnzzyyy.less'),
        controller: require('./safetyVerifLog.controller'),
        restrict: 'E',
        replact: true,
        scope: {}
    }
}

function safetyVerifLogSyzxyy() {
    return {
        template: require('./safetyVerifLog_syzxyy.html'),
        less: require('./safetyVerifLog_qnzzyyy.less'),
        controller: require('./safetyVerifLog_syzxyy.controller'),
        restrict: 'E',
        replact: true,
        scope: {}
    }
}

function safetyVerifLogSybx() {
    return {
        template: require('./safetyVerifLog_sybx.html'),
        less: require('./safetyVerifLog_sybx.less'),
        controller: require('./safetyVerifLog_sybx.controller'),
        restrict: 'E',
        replact: true,
        scope: {}
    }
}