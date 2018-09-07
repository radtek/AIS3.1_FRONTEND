editMedreasonsDictionary.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModalInstance', 'confirm', 'toastr', '$timeout'];

module.exports = editMedreasonsDictionary;

function editMedreasonsDictionary($rootScope, $scope, IHttp, $uibModalInstance, confirm, toastr, $timeout) {
    var promise;
    var medTakeReasonId = $scope.medTakeReasonId;
    if (medTakeReasonId === 0) {
        $scope.lable = '新增用药理由';
    } else {
        $scope.lable = '编辑用药理由';
        IHttp.post("basedata/queryMedicalTakeReasonById", { 'medTakeReasonId': medTakeReasonId }).then(function(rs) {
            $scope.medTakeReason = rs.data.medicalTakeReason;
        });
    }

    //点击科室的保存按钮
    $scope.saveMedTakeReason = function() {
        $scope.verify = verify();
        if (!$scope.verify) {
            return;
        }
        $rootScope.btnActive = false;
        promise = $timeout(function() {
            IHttp.post("basedata/saveMedicalTakeReason", $scope.medTakeReason).then(function(rs) {
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
        return $scope.TakeReason.$valid && !!($scope.medTakeReason.reason)
    }
}
