editOperRoomConfig.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModalInstance', 'select', 'confirm', 'toastr', '$timeout'];

module.exports = editOperRoomConfig;

function editOperRoomConfig($rootScope, $scope, IHttp, $uibModalInstance, select, confirm, toastr, $timeout) {
    var promise;
    var operRoomId = $scope.operRoomId;
    if (operRoomId === 0) {
        $scope.lable = '新增手术室';
    } else {
        $scope.lable = '编辑手术室';
        IHttp.post("basedata/queryRoomListById", { operRoomId: operRoomId }).then(function(data) {
            if (data.data.resultCode !== '1') return;
            $scope.operRoom = data.data.basOperroom;
            $scope.operRoom.enable = $scope.operRoom.enable + '';
        });
    }
    //点击科室的保存按钮
    $scope.saveOperationRoom = function() {
        $scope.verify = verify();
        if (!$scope.verify) {
            return;
        }
        $rootScope.btnActive = false;
        promise = $timeout(function() {
            IHttp.post("basedata/saveOperroom", $scope.operRoom).then(function(rs) {
                $rootScope.btnActive = true;
                if (rs.data.resultCode === '1') {
                    $uibModalInstance.close();
                    toastr.success(rs.data.resultMessage);
                }
            });
        }, 500);
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };

    // 验证
    function verify() {
        return $scope.operation.$valid && !!($scope.operRoom.name || $scope.operRoom.tableNum || $scope.operRoom.maxOperNum || $scope.operRoom.operLevel || $scope.operRoom.roomType || $scope.operRoom.enable)
    }
}
