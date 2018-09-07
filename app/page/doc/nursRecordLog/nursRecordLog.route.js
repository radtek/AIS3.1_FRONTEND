module.exports = angular.module('nursRecordLog', [])
    .config(route)
    .directive('nursRecordLog', nursRecordLog)
    .directive('nursRecordLogSyzxyy', nursRecordLogSyzxyy)
    .directive('nursRecordLogYxrm', nursRecordLogYxrm)
    .directive('nursRecordLogLlzyyy', nursRecordLogYxrm)
    .name;

route.$inject = ['$stateProvider'];

var opt_qnz = {
    parent: 'doc',
    template: require('./nursRecordLog.html'),
    less: require('./nursRecordLog.less'),
    controller: require('./nursRecordLog.controller'),
    controllerAs: 'vm'
}

var opt_syzxyy = {
    parent: 'doc',
    template: require('./nursRecordLog_nhfe.html'),
    less: require('./nursRecordLog_nhfe.less'),
    controller: require('./nursRecordLog_nhfe.controller'),
    controllerAs: 'vm'
}

var opt_yxyy = {
    parent: 'doc',
    template: require('./nursRecordLog_yxrm.html'),
    less: require('./nursRecordLog_nhfe.less'),
    controller: require('./nursRecordLog_yxrm.controller'),
    controllerAs: 'vm'
}



function route($stateProvider) {
    $stateProvider.state('nursRecordLog', angular.merge({}, opt_qnz, {  // 黔南州 》术前
        url: '/nursRecordLog/:regOptId'
    })).state('nursRecordLog3', angular.merge({}, opt_qnz, {  // 黔南州 》术后
        url: '/nursRecordLog3/:regOptId'
    })).state('xxcxNursRecordLog_qnz', angular.merge({}, opt_qnz, {  // 黔南州 》信息查询
        url: '/xxcxNursRecordLog_qnz/:regOptId',
        data: { readonly: true }
    })).state('kyglNursRecordLog_qnz', angular.merge({}, opt_qnz, {  // 黔南州 》科研管理
        url: '/kyglNursRecordLog_qnz/:regOptId',
        data: { readonly: true }
    })).state('postNursRecordLog_qnz', angular.merge({}, opt_syzxyy, {  // 黔南州 》术后
        url: '/postNursRecordLog_qnz/:regOptId'
    })).state('midNursRecordLog_qnz', angular.merge({}, opt_syzxyy, {  // 黔南州 》术后
        url: '/midNursRecordLog_qnz/:regOptId'
    })).state('midNursRecordLog_syzxyy', angular.merge({}, opt_syzxyy, {  // 邵阳中心医院 》术中
        url: '/midNursRecordLog_syzxyy/:regOptId',
        template: require('./nursRecordLog_syzxyy.html')
    })).state('postNursRecordLog_syzxyy', angular.merge({}, opt_syzxyy, {  // 邵阳中心医院 》术后
        url: '/postNursRecordLog_syzxyy/:regOptId',
        template: require('./nursRecordLog_syzxyy.html'),
        less: require('./nursRecordLog_syzxyy.less')
    })).state('midNursRecordLog_yxrm', angular.merge({}, opt_yxyy, {  // 永兴人民医院 》术后
        url: '/midNursRecordLog_yxrm/:regOptId'
    })).state('postNursRecordLog_yxrm', angular.merge({}, opt_yxyy, {  // 永兴人民医院 》术后
        url: '/postNursRecordLog_yxrm/:regOptId'
    })).state('kyglNursRecordLog_syzxyy', angular.merge({}, opt_syzxyy, {
        url: '/kyglNursRecordLog_syzxyy/:regOptId',
        template: require('./nursRecordLog_syzxyy.html'),
        data: { readonly: true }
    })).state('postNursRecordLog_llzyyy', angular.merge({}, opt_yxyy, {  // 临澧 》术后
        url: '/postNursRecordLog_llzyyy/:regOptId'
    }))
}

function nursRecordLog() {
    return {
        template: require('./nursRecordLog_nhfe.html'),
        less: require('./nursRecordLog_nhfe.less'),
        controller: require('./nursRecordLog_nhfe.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}

function nursRecordLogSyzxyy() {
    return {
        template: require('./nursRecordPrintLog_syzxyy.html'),
        less: require('./nursRecordLog_syzxyy.less'),
        controller: require('./nursRecordLog_nhfe.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}

function nursRecordLogYxrm() {
    return {
        template: require('./nursRecordLog_yxrm.html'),
        less: require('./nursRecordLog_nhfe.less'),
        controller: require('./nursRecordLog_yxrm.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}