editPromaterDictionary.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModalInstance', 'confirm', 'toastr', '$timeout'];

module.exports = editPromaterDictionary;

function editPromaterDictionary($rootScope, $scope, IHttp, $uibModalInstance, confirm, toastr, $timeout) {
    var promise;
    //user group li
    var chargeItemId = $scope.chargeItemId;
    if (chargeItemId === 0) {
        $scope.lable = '新增收费项目';
    } else {
        $scope.lable = '编辑收费项目';
        IHttp.post("basedata/queryChargeItemById", { 'chargeItemId': chargeItemId }).then(function(data) {
            if (data.data.resultCode !== '1') return;
            $scope.promaterDictionary = data.data.chargeItem;
        });
    }

    $scope.save = function() {
        $scope.verify = verify();
        if (!$scope.verify) {
            return;
        }
        $rootScope.btnActive = false;
        promise = $timeout(function() {
            IHttp.post("basedata/updateChargeItem", $scope.promaterDictionary).then(function(rs) {
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
        return $scope.promaterDict.$valid && !!($scope.promaterDictionary.chargeItemName || $scope.promaterDictionary.spec || $scope.promaterDictionary.price || $scope.promaterDictionary.type || $scope.promaterDictionary.unit || $scope.promaterDictionary.enable)
    }
}
