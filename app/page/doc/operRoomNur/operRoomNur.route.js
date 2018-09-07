module.exports = angular.module('operRoomNur', [])
    .config(route)
    .directive('operRoomNurNhfe', operRoomNurNhfe)
    .directive('operRoomNurYxrm', operRoomNurYxrm)
    .name;

route.$inject = ['$stateProvider'];

var opt_qnz = {
    parent: 'doc',
    template: require('./operRoomNur.html'),
    less: require('./operRoomNur.less'),
    controller: require('./operRoomNur.controller'),
    controllerAs: 'vm'
}

function route($stateProvider) {
    $stateProvider.state('preOperRoomNur_nhfe', angular.merge({}, opt_qnz, {  // 黔南州 》术前
        url: '/preOperRoomNur_nhfe/:regOptId'
    })).state('postOperRoomNur_nhfe', angular.merge({}, opt_qnz, {  // 黔南州 》术后
        url: '/postOperRoomNur_nhfe/:regOptId'
    })).state('xxcxOperRoomNur_nhfe', angular.merge({}, opt_qnz, {  // 黔南州 》信息查询
        url: '/xxcxOperRoomNur_nhfe/:regOptId',
        data: { readonly: true }
    })).state('kyglOperRoomNur_nhfe', angular.merge({}, opt_qnz, {  // 黔南州 》科研管理
        url: '/kyglOperRoomNur_nhfe/:regOptId',
        data: { readonly: true }
    })).state('preOperRoomNur_yxrm', angular.merge({}, opt_qnz, {  // 黔南州 》术后
        url: '/preOperRoomNur_yxrm/:regOptId'
    })).state('postOperRoomNur_yxrm', angular.merge({}, opt_qnz, {  // 黔南州 》术后
        url: '/postOperRoomNur_yxrm/:regOptId'
    }))
}

var dev={
    template: require('./operRoomNur.html'),
    less: require('./operRoomNur.less'),
    controller: require('./operRoomNur.controller'),
    controllerAs: 'vm',
    restrict: 'E',
    replact: true,
    scope: {}
}

function operRoomNurNhfe() {
    return dev
}

function operRoomNurYxrm() {
    return dev
}