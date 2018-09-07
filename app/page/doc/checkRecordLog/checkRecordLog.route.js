module.exports = angular.module('checkRecordLog', [])
    .config(route)
    .directive('checkRecordLog', checkRecordLog)
    .directive('checkRecordLogSybx', checkRecordLogSybx)
    .directive('checkRecordLogSyzxyy', checkRecordLogSyzxyy)
    .directive('checkRecordLogYxrm',checkRecordLogYxrm)
    .directive('checkRecordLogLlzyyy',checkRecordLogYxrm)
    .name;

route.$inject = ['$stateProvider'];

var opt_qnzzyyy = {
    parent: 'doc',
    template: require('./checkRecordLog_qnz.html'),
    less: require('./checkRecordLog_qnz.less'),
    controller: require('./checkRecordLog_qnz.controller'),
    controllerAs: 'vm'
}

var opt_syzxyy = {
    parent: 'doc',
    template: require('./checkRecordLog_syzxyy.html'),
    less: require('./checkRecordLog_qnz.less'),
    controller: require('./checkRecordLog_qnz.controller'),
    controllerAs: 'vm'
}

var opt_yxrmyy = {
    parent: 'doc',
    template: require('./checkRecordLog_yxrm.html'),
    less: require('./checkRecordLog_nhfe.less'),
    controller: require('./checkRecordLog_qnz.controller'),
    controllerAs: 'vm'
}
function route($stateProvider) {
    $stateProvider.state('xxcxCheckRecordLog_qnz', angular.merge({}, opt_qnzzyyy, { //黔南州中医》信息查询
        url: '/xxcxCheckRecordLog_qnz/:regOptId',
        data: { readonly: true }
    })).state('kyglCheckRecordLog_qnz', angular.merge({}, opt_qnzzyyy, { // 黔南州中医 科研管理
        url: '/kyglCheckRecordLog_qnz/:regOptId',
        data: { readonly: true }
    })).state('postCheckRecordLog_qnz', angular.merge({}, opt_qnzzyyy, {// 黔南州中医 术后 
        url: '/postCheckRecordLog_qnz/:regOptId'
    })).state('midCheckRecordLog_qnz', angular.merge({}, opt_qnzzyyy, { //黔南州中医 术中
        url: '/midCheckRecordLog_qnz/:regOptId'
    })).state('midCheckRecordLog_syzxyy', angular.merge({}, opt_syzxyy, {
        url: '/midCheckRecordLog_syzxyy/:regOptId'
    })).state('postCheckRecordLog_syzxyy', angular.merge({}, opt_syzxyy, {
        url: '/postCheckRecordLog_syzxyy/:regOptId'
    })).state('midCheckRecordLog_yxrm', angular.merge({}, opt_yxrmyy, {
        url: '/midCheckRecordLog_yxrm/:regOptId'
    })).state('postCheckRecordLog_yxrm', angular.merge({}, opt_yxrmyy, {// 永兴人民 | 术后 | 器械清点单
        url: '/postCheckRecordLog_yxrm/:regOptId'
    })).state('postCheckRecordLog_llzyyy', angular.merge({}, opt_yxrmyy, {// 临澧| 器械清点单
        template: require('./checkRecordLog_llzyyy.html'),
        url: '/postCheckRecordLog_llzyyy/:regOptId'
    })).state('kyglCheckRecordLog_syzxyy', angular.merge({}, opt_syzxyy, {
        url: '/kyglCheckRecordLog_syzxyy/:regOptId',
        data: { readonly: true }
    })).state('checkRecordLog_kycx_sybx', { //沈阳本溪 科研查询 》查看``
        parent: 'doc',
        url: '/checkRecordLog_kycx_sybx/:regOptId',
        template: require('./checkRecordLog_sybx.html'),
        less: require('./checkRecordLog_sybx.less'),
        controller: require('./checkRecordLog_sybx.controller'),
        controllerAs: 'vm',
        data: { readonly: true }
    }).state('checkRecordLog_sybx', {    // 术后访视(沈阳本溪版本)``
        parent: 'doc',
        url: '/checkRecordLog_sybx/:regOptId',
        template: require('./checkRecordLog_sybx.html'),
        less: require('./checkRecordLog_sybx.less'),
        controller: require('./checkRecordLog_sybx.controller'),
        controllerAs: 'vm',
        data: { readonly: false }
    }).state('midCheckRecordLog_sybx', {    // 术中巡视(沈阳本溪版本)``
        parent: 'doc',
        url: '/midCheckRecordLog_sybx/:regOptId',
        template: require('./checkRecordLog_sybx.html'),
        less: require('./checkRecordLog_sybx.less'),
        controller: require('./checkRecordLog_sybx.controller'),
        controllerAs: 'vm',
        data: { readonly: false }
    }).state('checkRecordLog_xxcx_sybx', { // 沈阳本溪 | 信息查询 》查看``
        parent: 'doc',
        url: '/checkRecordLog_xxcx_sybx/:regOptId',
        template: require('./checkRecordLog_sybx.html'),
        less: require('./checkRecordLog_sybx.less'),
        controller: require('./checkRecordLog_sybx.controller'),
        controllerAs: 'vm',
        data: { readonly: true }
    })
}

function checkRecordLog() {
    return {
        template: require('./checkRecordLog_qnz.html'),
        less: require('./checkRecordLog_qnz.less'),
        controller: require('./checkRecordLog_qnz.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        scope: {}
    }
}

function checkRecordLogSyzxyy() {
    return {
        template: require('./checkRecordLog_syzxyy.html'),
        less: require('./checkRecordLog_qnz.less'),
        controller: require('./checkRecordLog_qnz.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        scope: {}
    }
}

function checkRecordLogYxrm() {
    return {
        template: require('./checkRecordLog_yxrm.html'),
        less: require('./checkRecordLog_nhfe.less'),
        controller: require('./checkRecordLog_qnz.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}
function checkRecordLogSybx() {
    return {
        template: require('./checkRecordLogPrint_sybx.html'),
        less: require('./checkRecordLog_sybx.less'),
        controller: require('./checkRecordLog_sybx.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}