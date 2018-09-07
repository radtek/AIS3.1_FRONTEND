module.exports = angular.module('preVisitLog', [])
    .config(route)
    .directive('preVisitQnzLog', preVisitQnzLog)
    .directive('preVisitLogSybx', preVisitLogSybx)
    .directive('preVisitLogSyzxyy', preVisitLogSyzxyy)
    .name;

route.$inject = ['$stateProvider'];

var opt_qnz = {
    parent: 'doc',
    template: require('./preVisitLog_qnz.html'),
    less: require('./preVisitLog.less'),
    controller: require('./preVisitLog_qnz.controller'),
    controllerAs: 'vm'
}
var opt_qnzzyyy = {
    parent: 'doc',
    template: require('./preVisitLog_qnzOutPatient.html'),
    less: require('./preVisitLog.less'),
    controller: require('./preVisitLog_qnzOutPatient.controller'),
    controllerAs: 'vm'
}
//邵阳市中心医院
var opt_syzxyy = {
    parent: 'doc',
    template: require('./preVisitLog_syzxyy.html'),
    less: require('./preVisitLog.less'),
    controller: require('./preVisitLog_syzxyy.controller'),
    controllerAs: 'vm'
}
var VisitLog_sybx = {
    parent: 'doc',
    template: require('./preVisitLog_sybx.html'),
    less: require('./preVisitLog.less'),
    controller: require('./preVisitLog_sybx.controller'),
    controllerAs: 'vm'
}

function route($stateProvider) { //麻醉前访视记录单
    $stateProvider.state('preVisitLog_qnz', angular.merge({}, opt_qnz, { // 黔南州 》术前
        url: '/preVisitLog_qnz/:regOptId'
    })).state('midVisitLog_qnz', angular.merge({}, opt_qnz, { // 黔南州 》术中
        url: '/midVisitLog_qnz/:regOptId'
    })).state('postPreVisitLog_qnz', angular.merge({}, opt_qnz, { // 黔南州 》术后
        url: '/postPreVisitLog_qnz/:regOptId'
    })).state('xxcxVisitLog_qnz', angular.merge({}, opt_qnz, { // 黔南州 》信息查询
        url: '/xxcxVisitLog_qnz/:regOptId',
        data: { readonly: true }
    })).state('kyglPreVisitLog_qnz', angular.merge({}, opt_qnz, { // 黔南州 》科研管理
        url: '/kyglPreVisitLog_qnz/:regOptId',
        data: { readonly: true }
    })).state('preVisitLog_syzxyy', angular.merge({}, opt_syzxyy, { // 邵阳市中心医院 》术前
        url: '/preVisitLog_syzxyy/:regOptId'
    })).state('midVisitLog_syzxyy', angular.merge({}, opt_syzxyy, { // 邵阳市中心医院 》术中
        url: '/midVisitLog_syzxyy/:regOptId'
    })).state('postVisitLog_syzxyy', angular.merge({}, opt_syzxyy, { // 邵阳市中心医院 》术后
        url: '/postVisitLog_syzxyy/:regOptId'
    })).state('preVisitLog_qnzzyyy', angular.merge({}, opt_qnzzyyy, { // 黔南州中医医院门诊
        url: '/preVisitLog_qnzzyyy/:regOptId'
    })).state('preVisitLog_sybx', angular.merge({}, VisitLog_sybx, { // 本溪术前访视
        url: '/preVisitLog_sybx/:regOptId'
    })).state('midVisitLog_sybx', angular.merge({}, VisitLog_sybx, { //  // 沈阳本溪 | 术中巡视
        url: '/midVisitLog_sybx/:regOptId'
    })).state('preVisitLog_xxcx_sybx', angular.merge({}, VisitLog_sybx, { // 沈阳本溪 | 信息查询 》查看
        url: '/preVisitLog_xxcx_sybx/:regOptId',
        data: { readonly: true }
    })).state('preVisitLog_kycx_sybx', angular.merge({}, VisitLog_sybx, { // 沈阳本溪 | 科研管理 》查看 
        url: '/preVisitLog_kycx_sybx/:regOptId',
        data: { readonly: true }
    })).state('preVisitLog3_sybx', angular.merge({}, VisitLog_sybx, { // 沈阳本溪 | 术后
        url: '/preVisitLog3_sybx/:regOptId'
    }))
}

function preVisitQnzLog() {
    return {
        template: require('./preVisitLog_qnz.html'),
        less: require('./preVisitLog.less'),
        controller: require('./preVisitLog_qnz.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}

function preVisitLogSyzxyy() {
    return {
        template: require('./preVisitLog_syzxyy.html'),
        less: require('./preVisitLog.less'),
        controller: require('./preVisitLog_syzxyy.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}

function preVisitLogSybx() {
    return {
        template: require('./preVisitLog_sybx.html'),
        controller: require('./preVisitLog_sybx.controller'),
        restrict: 'E',
        replact: true,
        scope: {}
    }
}
