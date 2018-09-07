EditSelfPayDictionary.$inject = ['$rootScope', '$scope', 'IHttp', 'auth', '$uibModalInstance', 'confirm', 'toastr', '$timeout'];

module.exports = EditSelfPayDictionary;

function EditSelfPayDictionary($rootScope, $scope, IHttp, auth, $uibModalInstance, confirm, toastr, $timeout) {
    var selfPayId = $scope.selfPayId;
    var promise;
    $scope.beCode = auth.loginUser().beCode;
    if (selfPayId === 0) {
        $scope.lable = '新增耗材信息';
    } else {
        $scope.lable = '编辑耗材信息';
        IHttp.post("basedata/querySelfPayInstrumentById", { 'id': selfPayId }).then(function(data) {
            $scope.selfPay = data.data.selfPayInstrument;
            $scope.selfPay.enable = $scope.selfPay.enable + '';
        });
    }

    $scope.saveSelfPay = function() {
        $scope.verify = verify();
        if (!$scope.verify) {
            return;
        }
        $rootScope.btnActive = false;
        promise = $timeout(function() {
            IHttp.post("basedata/updateSelfPayInstrument", $scope.selfPay).then(function(rs) {
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
        return $scope.selfPayform.$valid && !!($scope.selfPay.name || $scope.selfPay.price || $scope.selfPay.type || $scope.selfPay.enable)
    }
}
