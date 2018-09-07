module.exports = angular.module('veinAccede', [])
    .config(route)
    .directive('veinAccede', veinAccede)
    .name;

route.$inject = ['$stateProvider'];

var opt_qnz = {
    parent: 'doc',
    template: require('./veinAccede.html'),
    less: require('./veinAccede.less'),
    controller: require('./veinAccede.controller'),
    controllerAs: 'vm'
}

function route($stateProvider) {
    $stateProvider.state('preVeinAccede', angular.merge({}, opt_qnz, {  // 黔南州 》术前
        url: '/preVeinAccede/:regOptId'
    })).state('midVeinAccede', angular.merge({}, opt_qnz, {  // 黔南州 》术后
        url: '/midVeinAccede/:regOptId'
    })).state('postVeinAccede', angular.merge({}, opt_qnz, {  // 黔南州 》术后
        url: '/postVeinAccede/:regOptId'
    })).state('xxcxVeinAccede', angular.merge({}, opt_qnz, {  // 黔南州 》信息查询
        url: '/xxcxVeinAccede/:regOptId',
        data: { readonly: true }
    })).state('kyglVeinAccede', angular.merge({}, opt_qnz, {  // 黔南州 》科研管理
        url: '/kyglVeinAccede/:regOptId',
        data: { readonly: true }
    }))
}

function veinAccede() {
    return {
        template: require('./veinAccede.html'),
        less: require('./veinAccede.less'),
        controller: require('./veinAccede.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}