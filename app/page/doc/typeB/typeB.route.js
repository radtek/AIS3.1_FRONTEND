module.exports = angular.module('typeB', [])
    .config(route)
    .directive('typeB', typeB)
    .name;

route.$inject = ['$stateProvider'];

var opt_qnz = {
    parent: 'doc',
    template: require('./typeB.html'),
    controller: require('./typeB.controller'),
    controllerAs: 'vm'
}

function route($stateProvider) {
    $stateProvider.state('preTypeB_qnz', angular.merge({}, opt_qnz, {  // 黔南州 》术前
        url: '/preTypeB_qnz/:regOptId'
    })).state('midTypeB_qnz', angular.merge({}, opt_qnz, {  // 黔南州 》术中巡视
        url: '/midTypeB_qnz/:regOptId',
        data: { readonly: true }
    })).state('postTypeB_qnz', angular.merge({}, opt_qnz, {  // 黔南州 》术后
        url: '/postTypeB_qnz/:regOptId'
    })).state('xxcxTypeB_qnz', angular.merge({}, opt_qnz, {  // 黔南州 》信息查询
        url: '/xxcxTypeB_qnz/:regOptId',
        data: { readonly: true }
    })).state('kyglTypeB_qnz', angular.merge({}, opt_qnz, {  // 黔南州 》科研管理
        url: '/kyglTypeB_qnz/:regOptId',
        data: { readonly: true }
    })).state('preTypeB_yxrm', angular.merge({}, opt_qnz, {  // 永兴人民 》术前
        url: '/preTypeB_yxrm/:regOptId'
    })).state('midTypeB_yxrm', angular.merge({}, opt_qnz, {  // 永兴人民 》 
        url: '/midTypeB_yxrm/:regOptId'
    })).state('postTypeB_yxrm', angular.merge({}, opt_qnz, {  // 永兴人民 》 
        url: '/postTypeB_yxrm/:regOptId'
    }))
}

function typeB() {
    return {
        template: require('./typeB.html'),
        controller: require('./typeB.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}