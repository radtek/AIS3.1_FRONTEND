editMedwayDictionary.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModalInstance', 'confirm', 'toastr', '$timeout'];

module.exports = editMedwayDictionary;

function editMedwayDictionary($rootScope, $scope, IHttp, $uibModalInstance, confirm, toastr, $timeout) {
    var promise;
    var medTakeWayId = $scope.medTakeWayId;
    if (medTakeWayId === 0) {
        $scope.lable = '新增用药途径';
    } else {
        $scope.lable = '编辑用药途径';
        IHttp.post("basedata/queryMedicalTakeWayById", { 'medTakeWayId': medTakeWayId }).then(function(rs) {
            $scope.medTakeWay = rs.data.medicalTakeWay;
        });
    }

    //点击科室的保存按钮
    $scope.saveMedway = function() {
        $scope.verify = verify();
        if (!$scope.verify) {
            return;
        }
        $rootScope.btnActive = false;
        promise = $timeout(function() {
            IHttp.post("basedata/saveMedicalTakeWay", $scope.medTakeWay).then(function(rs) {
                if (rs.data.resultCode === '1') {
                    $uibModalInstance.close();
                    toastr.success(rs.data.resultMessage);
                }
                $rootScope.btnActive = true;
            });
        }, 500);
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };

    // 验证
    function verify() {
        return $scope.TakeWay.$valid && !!($scope.medTakeWay.code || $scope.medTakeWay.name || $scope.medTakeWay.category || $scope.medTakeWay.measureMode || $scope.medTakeWay.durable)
    }
}
