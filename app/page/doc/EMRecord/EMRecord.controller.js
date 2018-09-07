module.exports = angular.module('EMRecord', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

var opt = {
    parent: 'doc',
    template: require('./EMRecord.html'),
    controller: EMRecordCtrl,
    controllerAs: 'vm'
}

function route($stateProvider) {
    $stateProvider.state('EMRecord', angular.merge({}, opt, {
        url: '/EMRecord/:regOptId'
    }))
}

EMRecordCtrl.$inject = ['$rootScope', 'select', 'toastr'];

function EMRecordCtrl($rootScope, select, toastr) {
    var vm = this,
        regOptId = $rootScope.$stateParams.regOptId;

    select.getRegOptInfo(regOptId).then(function(rs) {
        // syxh 0：挂号序号，1：住院号
        // xtlb 0：门诊，1：住院（默认）
        vm.syxh = rs.data.resultRegOpt.hid;
        vm.xtlb = rs.data.resultRegOpt.operSource || 1;
    });
}