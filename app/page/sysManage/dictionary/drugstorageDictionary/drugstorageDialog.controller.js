drugstorageDialog.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModalInstance', 'confirm', 'toastr', '$timeout'];

module.exports = drugstorageDialog;

function drugstorageDialog($rootScope, $scope, IHttp, $uibModalInstance, confirm, toastr, $timeout) {
    var priceId = $scope.priceId;
    var code = $scope.code,
        medicineId = $scope.medicineId;
    $scope.price = {};
    var promise;
    if (!code)
        code = medicineId;
    if (priceId === 0) {
        $scope.lable = '新增药品厂家';
        $scope.price.code = code;
    } else {
        $scope.lable = '编辑药品厂家';
        IHttp.post("basedata/queryPriceByPriceId", { priceId: priceId }).then(function(rs) {
            $scope.price = rs.data.BasPrice;
        });
    }

    $scope.savePrice = function() {
        $scope.verify = verify();
        if (!$scope.verify) {
            return;
        }
        $rootScope.btnActive = false;
        promise = $timeout(function() {
            IHttp.post("basedata/savePrice", $scope.price).then(function(rs) {
                if (rs.data.resultCode === '1') {
                    $uibModalInstance.close();
                    toastr.success(rs.data.resultMessage);
                }
                $rootScope.btnActive = true;
            });
        }, 500)
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };

    // 验证
    function verify() {
        return $scope.drug.$valid && !!($scope.price.minPackageUnit || $scope.price.enable)
    }
}
