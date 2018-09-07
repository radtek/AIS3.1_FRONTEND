editDictionarytwo.$inject = ['$rootScope', '$scope', 'IHttp', 'auth', '$uibModalInstance', '$timeout', 'confirm', 'toastr', 'items'];

module.exports = editDictionarytwo;

function editDictionarytwo($rootScope, $scope, IHttp, auth, $uibModalInstance, $timeout, confirm, toastr, items) {
    $scope.beCode = auth.loginUser().beCode;
    if (!items.row) {
        $scope.lable = '新增药品';
    } else {
        $scope.lable = '编辑药品';
        IHttp.post("basedata/queryMedicineById", { medicineId: items.row.medicineId }).then(function(rs) {
            $scope.editdictiontwo = rs.data.medicine;
        });
    }

    //修改保存
    $scope.savedictionary = function() {
        $scope.verify = verify();
        if (!$scope.verify) {
            return;
        }
        $rootScope.btnActive = false;
        IHttp.post('basedata/saveMedicine', $scope.editdictiontwo).then(function(rs) {
            if (rs.data.resultCode === '1') {
                $uibModalInstance.close();
                toastr.success(rs.data.resultMessage);
            }
            $rootScope.btnActive = true;
        });
    }
    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };

    // 验证
    function verify() {
        return $scope.dictionary.$valid && !!($scope.editdictiontwo.name || $scope.editdictiontwo.enable || $scope.editdictiontwo.dosageUnit || $scope.editdictiontwo.type)
    }
}
