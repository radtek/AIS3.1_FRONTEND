 module.exports = angular.module('postVisitLog', [])
    .config(route)
    .directive('postVisitLog', postVisitLog)
    .directive('postVisitLogSyzxyy', postVisitLog_syzxyy)
    .directive('postVisitLogYxrm',postVisitLogYxrm)
    .directive('postVisitLogSybx', postVisitLogSybx)
    .directive('postVisitLogSyzxyySecond', postVisitLog_syzxyySecond)
    .directive('postVisitLogLlzyyy', postVisitLogLlzyyy)
    .name;

route.$inject = ['$stateProvider'];

var opt_qnz = {
    parent: 'doc',
    template: require('./postVisitLog_qnz.html'),
    less: require('./postVisitLog.less'),
    controller: require('./postVisitLog.controller'),
    controllerAs: 'vm'
}

var opt_syzxyy = {
    parent: 'doc',
    template: require('./postVisitLog_syzxyy.html'),
    less: require('./postVisitLog.less'),
    controller: require('./postVisitLog_syzxyy.controller'),
    controllerAs: 'vm'
}
var opt_syzxyySeconde = {
    parent: 'doc',
    template: require('./postVisitLogSecond_syzxyy.html'),
    less: require('./postVisitLog.less'),
    controller: require('./postVisitLogSecond_syzxyy.controller'),
    controllerAs: 'vm'
}

var opt_yxrmyy = {
    parent: 'doc',
    template: require('./postVisitLog_yxrm.html'),
    less: require('./postVisitLog.less'),
    controller: require('./postVisitLog_yxrm.controller'),
    controllerAs: 'vm'
}

function route($stateProvider) {
    $stateProvider.state('postVisitLog', angular.merge({}, opt_qnz, {  // 黔南州 》术前
        url: '/postVisitLog/:regOptId'
    })).state('postVisitLog_qnz', angular.merge({}, opt_qnz, {  // 黔南州 》术后
        url: '/postVisitLog_qnz/:regOptId'
    })).state('postPosVisitLog_syzxyy', angular.merge({}, opt_syzxyy, {  // 邵阳东院 》术后 麻醉医生
        url: '/postPosVisitLog_syzxyy/:regOptId'
    })).state('midPosVisitLogSecond_syzxyy', angular.merge({}, opt_syzxyySeconde, {  // 邵阳东院 》术后 护士 后面加的
        url: '/midPosVisitLogSecond_syzxyy/:regOptId'
    })).state('postPosVisitLogSecond_syzxyy', angular.merge({}, opt_syzxyySeconde, {  // 邵阳东院 》术后 护士 后面加的
        url: '/postVisitLogSecond_syzxyy/:regOptId'
    })).state('kyglPosVisitLogSecond_syzxyy', angular.merge({}, opt_syzxyySeconde, {  // 邵阳东院 》术后 护士 后面加的
        url: '/kyglVisitLogSecond_syzxyy/:regOptId',
        data: { readonly: true }
    })).state('xxcxPostVisitLog_qnz', angular.merge({}, opt_qnz, {  // 黔南州 》信息查询
        url: '/xxcxPostVisitLog_qnz/:regOptId',
        data: { readonly: true }
    })).state('kyglVisitLog_qnz', angular.merge({}, opt_qnz, {  // 黔南州 》科研管理
        url: '/kyglVisitLog_qnz/:regOptId',
        data: { readonly: true }
    })).state('midPVisitLog_qnz', angular.merge({}, opt_qnz, {  // 黔南州中医》术中
        url: '/midPVisitLog_qnz/:regOptId',
    })).state('postVisitLog_yxrm', angular.merge({}, opt_yxrmyy, {  // 永兴人民》术中
        url: '/postVisitLog_yxrm/:regOptId',
    })).state('postVisitLog_llzyyy', angular.merge({}, opt_yxrmyy, {  // 临澧》术中
        url: '/postVisitLog_llzyyy/:regOptId',
        controller: require('./postVisitLog_llzyyy.controller'),
        template: require('./postVisitLog_llzyyy.html')
    })).state('midVisitLog_yxrm', angular.merge({}, opt_yxrmyy, {  // 永兴人民》术中
        url: '/midVisitLog_yxrm/:regOptId',
    })).state('postVisitLog_kycx_sybx', {     // 沈阳本溪 | 科研查询 》查看
        parent: 'doc',
        url: '/postVisitLog_kycx_sybx/:regOptId',
        template: require('./postVisitLog_sybx.html'),
        less: require('./postVisitLog.less'),
        controller: require('./postVisitLog_sybx.controller'),
        data: { readonly: true }
    }).state('postVisitLog_sybx', { // 沈阳本溪 |术后访视  》查看 
        parent: 'doc',
        url: '/postVisitLog_sybx/:regOptId',
        template: require('./postVisitLog_sybx.html'),
        less: require('./postVisitLog.less'),
        controller: require('./postVisitLog_sybx.controller')
    }).state('midPostVisitLog_sybx', {
        parent: 'doc',
        url: '/midPostVisitLog_sybx/:regOptId',
        template: require('./postVisitLog_sybx.html'),
        less: require('./postVisitLog.less'),
        controller: require('./postVisitLog_sybx.controller')
    }).state('postVisitLog_xxcx_sybx', {     // 沈阳本溪 | 信息查询 》查看
        parent: 'doc',
        url: '/postVisitLog_xxcx_sybx/:regOptId',
        template: require('./postVisitLog_sybx.html'),
        less: require('./postVisitLog.less'),
        controller: require('./postVisitLog_sybx.controller'),
        data: { readonly: true }
    })
}

var dev={
    template: require('./postVisitLog_qnz.html'),
    less: require('./postVisitLog.less'),
    controller: require('./postVisitLog.controller'),
    restrict: 'E',
    replact: true,
    scope: {}
}
var devSyzxyy={
    template: require('./postVisitLog_syzxyy.html'),
    less: require('./postVisitLog.less'),
    controller: require('./postVisitLog_syzxyy.controller'),
    restrict: 'E',
    replact: true,
    scope: {}
}
var devyxyy={
    template: require('./postVisitLog_yxrm.html'),
    less: require('./postVisitLog.less'),
    controller: require('./postVisitLog_yxrm.controller'),
    restrict: 'E',
    replact: true,
    scope: {}
}
var devyxyySecond={
    template: require('./postVisitLogSecond_syzxyy.html'),
    less: require('./postVisitLog.less'),
    controller: require('./postVisitLogSecond_syzxyy.controller'),
    restrict: 'E',
    replact: true,
    scope: {}
}
function postVisitLogLlzyyy() {
    return {
        less: require('./postVisitLog.less'),
        controller: require('./postVisitLog_llzyyy.controller'),
        template: require('./postVisitLog_llzyyy.html'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}
function postVisitLog_syzxyy(){
 return devSyzxyy
}
function postVisitLog_syzxyySecond(){
 return devyxyySecond
}
function postVisitLog() {
    return dev
}

function postVisitLogYxrm() {
    return devyxyy
}

function postVisitLogSybx() {
    return {
        url: '/postVisitLog_sybx/:regOptId',
        template: require('./postVisitLog_sybx.html'),
        less: require('./postVisitLog.less'),
        controller: require('./postVisitLog_sybx.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}