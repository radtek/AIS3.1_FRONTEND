cardScheduleCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$timeout', 'toastr', 'select', 'auth', '$uibModal', 'uiGridConstants', 'uiGridServe', 'confirm', 'baseConfig'];

module.exports = cardScheduleCtrl;

function cardScheduleCtrl($rootScope, $scope, IHttp, $timeout, toastr, select, auth, $uibModal, uiGridConstants, uiGridServe, confirm, baseConfig) {
    var beCode = auth.loginUser().beCode,
        basCfg = baseConfig.getSurgSchedule();

    $scope.back = false;
}