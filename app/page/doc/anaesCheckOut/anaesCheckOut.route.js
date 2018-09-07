module.exports = angular.module('anaesCheckOut', [])
    .config(route)
    .directive('anaesCheckOutNhfe', anaesCheckOutNhfe)
    .name;

route.$inject = ['$stateProvider'];

var opt_qnz = {
    parent: 'doc',
    template: require('./anaesCheckOut_nhfe.html'),
    less: require('./anaesCheckOut.less'),
    controller: require('./anaesCheckOut_nhfe.controller'),
    controllerAs: 'vm'
}

var opt_syzxyy = {
    parent: 'doc',
    template: require('./anaesCheckOut_syzxyy.html'),
    less: require('./anaesCheckOut.less'),
    controller: require('./anaesCheckOut_nhfe.controller'),
    controllerAs: 'vm'
}
function route($stateProvider) {
    $stateProvider.state('midSurgeryCheckout_qnz', angular.merge({}, opt_qnz, {  // 黔南州 》术前
        url: '/midSurgeryCheckout_qnz/:regOptId'
    })).state('postSurgeryCheckout_qnz', angular.merge({}, opt_qnz, {  // 黔南州 》术后
        url: '/postSurgeryCheckout_qnz/:regOptId'
    })).state('postSurgeryCheckout_llzyyy', angular.merge({}, opt_qnz, {  // 临澧 》术后
        url: '/postSurgeryCheckout_llzyyy/:regOptId'
    })).state('xxcxSurgeryCheckout_qnz', angular.merge({}, opt_qnz, {  // 黔南州 》信息查询
        url: '/xxcxSurgeryCheckout_qnz/:regOptId',
        data: { readonly: true }
    })).state('kyglSurgeryCheckout_qnz', angular.merge({}, opt_qnz, {  // 黔南州 》科研管理
        url: '/kyglSurgeryCheckout_qnz/:regOptId',
        data: { readonly: true }
    })).state('midSurgeryCheckout_syzxyy', angular.merge({}, opt_syzxyy, {
        url: '/midSurgeryCheckout_syzxyy/:regOptId'
    })).state('postSurgeryCheckout_syzxyy', angular.merge({}, opt_syzxyy, {
        url: '/postSurgeryCheckout_syzxyy/:regOptId'
    })).state('pacuSurgeryCheckout_syzxyy', angular.merge({}, opt_syzxyy, {
        url: '/pacuSurgeryCheckout_syzxyy/:regOptId'
    })).state('midSurgeryCheckout_yxrm', angular.merge({}, opt_qnz, { 
        url: '/midSurgeryCheckout_yxrm/:regOptId'
    })).state('kyglSurgeryCheckout_syzxyy', angular.merge({}, opt_syzxyy, {
        url: '/kyglSurgeryCheckout_syzxyy/:regOptId',
        data: { readonly: true }
    }))
}

function anaesCheckOutNhfe() {
    return {
        template: require('./anaesCheckOut_nhfe.html'),
        less: require('./anaesCheckOut.less'),
        controller: require('./anaesCheckOut_nhfe.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}
