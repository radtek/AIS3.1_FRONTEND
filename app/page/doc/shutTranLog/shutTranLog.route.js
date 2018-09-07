module.exports = angular.module('shutTranLog', [])
    .config(route)
    .directive('shutTranLog', shutTranLog)
    .directive('shutTranLogSybx', shutTranLogSybx)
    .directive('shutTranLogSyzxyy', shutTranLogSyzxyy)
    .name;

route.$inject = ['$stateProvider'];

var opt_qnz = {
    parent: 'doc',
    template: require('./shutTranLog.html'),
    less: require('./shutTranLog.less'),
    controller: require('./shutTranLog.controller'),
    controllerAs: 'vm'
}

var opt_syzxyy = {
    parent: 'doc',
    template: require('./shutTranLog_syzxyy.html'),
    less: require('./shutTranLog.less'),
    controller: require('./shutTranLog_syzxyy.controller'),
    controllerAs: 'vm'
}

function route($stateProvider) {
    $stateProvider.state('shutTranLog', angular.merge({}, opt_qnz, {  // 黔南州 》术前
        url: '/shutTranLog/:regOptId'
    })).state('midShutTranLog', angular.merge({}, opt_qnz, {  // 黔南州 》术后
        url: '/midShutTranLog/:regOptId'
    })).state('shutTranLog_xxcx', angular.merge({}, opt_qnz, {  // 黔南州 》信息查询
        url: '/shutTranLog_xxcx/:regOptId',
        data: { readonly: true }
    })).state('shutTranLog_kycx', angular.merge({}, opt_qnz, {  // 黔南州 》科研管理
        url: '/shutTranLog_kycx/:regOptId',
        data: { readonly: true }
    })).state('preShutTranLog_syzxyy', angular.merge({}, opt_syzxyy, {
        url: '/preShutTranLog_syzxyy/:regOptId'
    })).state('postShutTranLog_syzxyy', angular.merge({}, opt_syzxyy, {
        url: '/postShutTranLog_syzxyy/:regOptId'
    })).state('xxcxShutTranLog_syzxyy', angular.merge({}, opt_syzxyy, {
        url: '/xxcxShutTranLog_syzxyy/:regOptId',
        data: { readonly: true }
    })).state('kyglShutTranLog_syzxyy', angular.merge({}, opt_syzxyy, {
        url: '/kyglShutTranLog_syzxyy/:regOptId',
        data: { readonly: true }
    })).state('shutTranLog_sybx', {    // 术前访视(沈阳本溪版本)
        parent: 'doc',
        url: '/shutTranLog_sybx/:regOptId',
        template: require('./shutTranLog_sybx.html'),
        less: require('./shutTranLog.less'),
        controller: require('./shutTranLog_sybx.controller')
    }).state('shutTranLog_xxcx_sybx', {      // 信息查询 》 查看
        parent: 'doc',
        url: '/shutTranLog_xxcx_sybx/:regOptId',
        template: require('./shutTranLog_sybx.html'),
        less: require('./shutTranLog.less'),
        controller: require('./shutTranLog_sybx.controller'),
        data: { readonly: true }
    }).state('shutTranLog2_sybx', {    // 术后访视(沈阳本溪版本)
        parent: 'doc',
        url: '/shutTranLog2_sybx/:regOptId',
        template: require('./shutTranLog_sybx.html'),
        less: require('./shutTranLog.less'),
        controller: require('./shutTranLog_sybx.controller')
    }).state('shutTranLog_kycx_sybx', {      // 科研查询 》 查看
        parent: 'doc',
        url: '/shutTranLog_kycx_sybx/:regOptId',
        template: require('./shutTranLog_sybx.html'),
        less: require('./shutTranLog.less'),
        controller: require('./shutTranLog_sybx.controller'),
        data: { readonly: true }
    }).state('midShutTranLog_sybx', {    // 术中巡视(沈阳本溪版本)
        parent: 'doc',
        url: '/midShutTranLog_sybx/:regOptId',
        template: require('./shutTranLog_sybx.html'),
        less: require('./shutTranLog.less'),
        controller: require('./shutTranLog_sybx.controller')
    })
}

function shutTranLog() {
    return {
        template: require('./shutTranLog.html'),
        less: require('./shutTranLog.less'),
        controller: require('./shutTranLog.controller'),
        restrict: 'E',
        replact: true,
        scope: {}
    }
}

function shutTranLogSyzxyy() {
    return {
        template: require('./shutTranLog_syzxyy.html'),
        less: require('./shutTranLog.less'),
        controller: require('./shutTranLog_syzxyy.controller'),
        restrict: 'E',
        replact: true,
        scope: {}
    }
}
function shutTranLogSybx() {
    return {
        template: require('./shutTranLog_sybx.html'),
        less: require('./shutTranLog.less'),
        controller: require('./shutTranLog_sybx.controller'),
        restrict: 'E',
        replact: true,
        scope: {}
    }
}