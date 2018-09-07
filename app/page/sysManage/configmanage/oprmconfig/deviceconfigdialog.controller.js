deviceconfigdialog.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModalInstance', 'select', 'confirm', 'toastr', '$timeout'];

module.exports = deviceconfigdialog;

function deviceconfigdialog($rootScope, $scope, IHttp, $uibModalInstance, select, confirm, toastr, $timeout) {
    var promise;
    var operRoomId = $scope.operRoomId;
    $scope.lable = '设备配置';
    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };
    // if (operRoomId === 0) {
    //     $scope.lable = '新增手术室';
    // } else {
    //     $scope.lable = '编辑手术室';
    //     IHttp.post("basedata/queryRoomListById", { operRoomId: operRoomId }).then(function(data) {
    //         if (data.data.resultCode !== '1') return;
    //         $scope.operRoom = data.data.basOperroom;
    //         $scope.operRoom.enable = $scope.operRoom.enable + '';
    //     });
    // }
    // //点击科室的保存按钮
    // $scope.saveOperationRoom = function() {
    //     $scope.verify = verify();
    //     if (!$scope.verify) {
    //         return;
    //     }
    //     $rootScope.btnActive = false;
    //     promise = $timeout(function() {
    //         IHttp.post("basedata/saveOperroom", $scope.operRoom).then(function(rs) {
    //             $rootScope.btnActive = true;
    //             if (rs.data.resultCode === '1') {
    //                 $uibModalInstance.close();
    //                 toastr.success(rs.data.resultMessage);
    //             }
    //         });
    //     }, 500);
    // }

    // $scope.cancel = function() {
    //     $uibModalInstance.dismiss();
    // };

    // // 验证
    // function verify() {
    //     return $scope.operation.$valid && !!($scope.operRoom.name || $scope.operRoom.tableNum || $scope.operRoom.maxOperNum || $scope.operRoom.operLevel || $scope.operRoom.roomType || $scope.operRoom.enable)
    // }
    select.getDeviceConfigList().then(function(result) {
        if (result.data.resultCode !== '1') return;
        $scope.dcl = result.data.resultList;
        $scope.dcl.forEach(function(item) {
            item.interfaceTypeName = item.interfaceType == 1 ? '网口' : '串口';
            item.enable = item.enable + '';
        });
    });

    $scope.edit = function(row) {
        if (row.enable == 0) row.serialPort = '';
        $scope.row = row;
        if (row.interfaceType != 1) {
            IHttp.post("basedata/getUseSerialPortList").then(function(rs) {
                $scope.row.serialPort = row.serialPort;
                if (row.enable == 1)
                    rs.data.resultList.push(row.serialPort);
                $scope.serialPortList = rs.data.resultList;
            });
        }
        select.getDeviceMonitorConfigList(row.deviceId).then(function(result) {
            $scope.morList = result.data.resultList;
            $scope.morList.forEach(function(item) {
                item.checked = item.optional === 'M' || item.optional === 'O';
            });
        });
    }

    $scope.ok = function() {
        var list = $filter('filter')($scope.morList, function(item) {
            return item.checked
        });
        IHttp.post('operCtl/updDeviceConfig', {
            deviceMonitorConfigList: list,
            deviceConfig: $scope.row
        }).then(function(result) {
            if (result.data.resultCode === '1') {
                // $uibModalInstance.close();
                toastr.info(result.data.resultMessage);
            }
        });
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };
}
