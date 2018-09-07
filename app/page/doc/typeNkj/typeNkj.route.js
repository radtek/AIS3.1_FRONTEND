module.exports = angular.module('typeNkj', [])
    .config(route)
    .directive('typeNkj', typeNkj)
    .name;

route.$inject = ['$stateProvider'];

var opt_qnz = {
    parent: 'doc',
    template: require('./typeNkj.html'),
    controller: require('./typeNkj.controller'),
    controllerAs: 'vm'
}

function route($stateProvider) {
    $stateProvider.state('preTypeNkj_qnz', angular.merge({}, opt_qnz, {  // 黔南州 》术前
        url: '/preTypeNkj_qnz/:regOptId'
    })).state('midTypeNkj_qnz', angular.merge({}, opt_qnz, {  // 黔南州 》术中巡视
        url: '/midTypeNkj_qnz/:regOptId',
        data: { readonly: true }
    })).state('postTypeNkj_qnz', angular.merge({}, opt_qnz, {  // 黔南州 》术后
        url: '/postTypeNkj_qnz/:regOptId'
    })).state('xxcxTypeNkj_qnz', angular.merge({}, opt_qnz, {  // 黔南州 》信息查询
        url: '/xxcxTypeNkj_qnz/:regOptId',
        data: { readonly: true }
    })).state('kyglTypeNkj_qnz', angular.merge({}, opt_qnz, {  // 黔南州 》科研管理
        url: '/kyglTypeNkj_qnz/:regOptId',
        data: { readonly: true }
    })).state('preTypeNkj_yxrm', angular.merge({}, opt_qnz, {  // 永兴人民 》 
        url: '/preTypeNkj_yxrm/:regOptId'
    })).state('midTypeNkj_yxrm', angular.merge({}, opt_qnz, {  // 永兴人民 》 
        url: '/midTypeNkj_yxrm/:regOptId'
    })).state('postTypeNkj_yxrm', angular.merge({}, opt_qnz, {  // 永兴人民 》 
        url: '/postTypeNkj_yxrm/:regOptId'
    }))
}

function typeNkj() {
    return {
        template: require('./typeNkj.html'),
        controller: require('./typeNkj.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}