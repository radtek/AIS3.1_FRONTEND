CancelOperCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModalInstance', 'select', '$timeout', 'toastr', 'auth'];

module.exports = CancelOperCtrl;

function CancelOperCtrl($rootScope, $scope, IHttp, $uibModalInstance, select, $timeout, toastr, auth) {
    vm = this;
    $scope.docInfo = auth.loginUser();

    let beCode = $scope.docInfo.beCode;
    $scope.beCode = beCode;
    $scope.isNurse = $scope.docInfo.roleType === 'HEAD_NURSE' ? true : false;  //是否护士长;
    $scope.isAnaes = $scope.docInfo.roleType === 'ANAES_DIRECTOR' ? true : false;  //是否麻醉科主任;

    var parent = $scope.$parent.data;
    $scope.operatorName = parent.operatorName.replace(',' + parent.assistantName, '');

    select.operroom().then((rs) => {
        if (rs.data.resultCode != 1)
            return;
        $scope.operroom = rs.data.resultList;
    })

    select.sysCodeBy('pacType').then((rs) => {
        if (rs.data.resultCode != 1)
            return;
        $scope.pacList = rs.data.resultList;
    })

    vm.close = function() {
        $uibModalInstance.close('cancel');
    }

    vm.save = function() {
        var type = $scope.tabIndex,
            dispatchList = [],
            data = angular.copy($scope.data),
            roleType = auth.loginUser().roleType;

        if (typeof(data.operaDate) != 'string')
            data.operaDate = $filter('date')(data.operaDate, 'yyyy-MM-dd');
        if (typeof(data.startTime) != 'string')
            data.startTime = $filter('date')(data.startTime, 'HH:mm');

        if ((data.isLocalAnaes == '1' && type == 1) || (data.isLocalAnaes == '0' && type == 2))
            data.isHold = '0';

        dispatchList.push(data);

        if (dispatchList.length <= 0 && beCode !== 'syzxyy' && beCode != 'cshtyy') {
            if (type == 0)
                toastr.info('手术室不能为空');
            else if (type == 1)
                toastr.info('巡回护士不能为空');
            else if (type == 2)
                toastr.info('麻醉医生不能为空');
            return;
        }
        IHttp.post('basedata/dispatchOperation', { dispatchList: dispatchList, roleType: roleType, dispatchToHis: 1 }).then(function(rs) {
            toastr.info(rs.data.resultMessage);
            if (rs.data.resultCode != 1)
                return;
            $uibModalInstance.close('success');
        });
    }

}