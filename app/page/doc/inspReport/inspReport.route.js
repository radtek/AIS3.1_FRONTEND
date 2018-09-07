module.exports = angular.module('inspReport', [])
    .config(route)
    .directive('inspReport', inspReport)
    .name;

route.$inject = ['$stateProvider'];

var opt_qnz = {
    parent: 'doc',
    template: require('./inspReport.html'),
    less: require('./inspReport.less'),
    controller: require('./inspReport.controller'),
    controllerAs: 'vm'
}

function route($stateProvider) {
    $stateProvider.state('preInspReport_qnz', angular.merge({}, opt_qnz, {  // 黔南州 》术前
        url: '/preInspReport_qnz/:regOptId'
    })).state('midInspReport_qnz', angular.merge({}, opt_qnz, {  // 黔南州 》术中巡视
        url: '/midInspReport_qnz/:regOptId',
        data: { readonly: true }
    })).state('postInspReport_qnz', angular.merge({}, opt_qnz, {  // 黔南州 》术后
        url: '/postInspReport_qnz/:regOptId'
    })).state('xxcxInspReport_qnz', angular.merge({}, opt_qnz, {  // 黔南州 》信息查询
        url: '/xxcxInspReport_qnz/:regOptId',
        data: { readonly: true }
    })).state('kyglInspReport_qnz', angular.merge({}, opt_qnz, {  // 黔南州 》科研管理
        url: '/kyglInspReport_qnz/:regOptId',
        data: { readonly: true }
    })).state('preInspReport_yxrm', angular.merge({}, opt_qnz, {  // 永兴人民 》术前
        url: '/preInspReport_yxrm/:regOptId'
    })).state('midInspReport_yxrm', angular.merge({}, opt_qnz, {  // 永兴人民 》术前
        url: '/midInspReport_yxrm/:regOptId'
    })).state('postInspReport_yxrm', angular.merge({}, opt_qnz, {  // 永兴人民 》术前
        url: '/postInspReport_yxrm/:regOptId'
    }))
}

function inspReport() {
    return {
        template: require('./inspReport.html'),
        less: require('./inspReport.less'),
        controller: require('./inspReport.controller'),
        restrict: 'E',
        replact: true,
        scope: {}
    }
}