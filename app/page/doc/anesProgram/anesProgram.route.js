module.exports = angular.module('anesProgram', [])
    .config(route)
    .directive('anesProgram', anesProgram)
    .name;

route.$inject = ['$stateProvider'];

var opt_qnz = {
    parent: 'doc',
    template: require('./anesProgram.html'),
    less: require('./anesProgram.less'),
    controller: require('./anesProgram.controller'),
    controllerAs: 'vm'
}

function route($stateProvider) {
    $stateProvider.state('anesProgram', angular.merge({}, opt_qnz, {  // 黔南州 》术前
        url: '/anesProgram/:regOptId'
    })).state('anesProgram2', angular.merge({}, opt_qnz, {  // 黔南州 》术后
        url: '/anesProgram2/:regOptId'
    })).state('anesProgram3', angular.merge({}, opt_qnz, {  // 黔南州 》术后
        url: '/anesProgram3/:regOptId'
    })).state('anesProgram_xxcx', angular.merge({}, opt_qnz, {  // 黔南州 》信息查询
        url: '/anesProgram_xxcx/:regOptId',
        data: { readonly: true }
    })).state('anesProgram_kycx', angular.merge({}, opt_qnz, {  // 黔南州 》科研管理
        url: '/anesProgram_kycx/:regOptId',
        data: { readonly: true }
    }))
}

function anesProgram() {
    return {
        template: require('./anesProgram.html'),
        less: require('./anesProgram.less'),
        controller: require('./anesProgram.controller'),
        restrict: 'E',
        replact: true,
        scope: {}
    }
}
