module.exports = angular.module('anaesMedicine', [])
    .config(route)
    .directive('anaesMedicineQnz', anaesMedicineQnz)
    .name;

route.$inject = ['$stateProvider'];

var opt_qnz = {
    parent: 'doc',
    template: require('./anaesMedicine_qnz.html'),
    less: require('./anaesMedicine.less'),
    controller: require('./anaesMedicine_qnz.controller'),
    controllerAs: 'vm'
}

function route($stateProvider) {
    $stateProvider.state('preAnaesMedicine_qnz', angular.merge({}, opt_qnz, {  // 黔南州 》术前
        url: '/anaesMedicine_qnz/:regOptId'
    })).state('postAnaesMedicine_qnz', angular.merge({}, opt_qnz, {  // 黔南州 》术后
        url: '/postAnaesMedicine_qnz/:regOptId'
    })).state('xxcxAnaesMedicine_qnz', angular.merge({}, opt_qnz, {  // 黔南州 》信息查询
        url: '/xxcxAnaesMedicine_qnz/:regOptId',
        data: { readonly: true }
    })).state('kyglAnaesMedicine_qnz', angular.merge({}, opt_qnz, {  // 黔南州 》科研管理
        url: '/kyglAnaesMedicine_qnz/:regOptId',
        data: { readonly: true }
    }))
}

function anaesMedicineQnz() {
    return {
        template: require('./anaesMedicine_qnz.html'),
        less: require('./anaesMedicine.less'),
        controller: require('./anaesMedicine_qnz.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}