editDiagnosisDictionary.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModalInstance', 'confirm', 'toastr', '$timeout'];

module.exports = editDiagnosisDictionary;

function editDiagnosisDictionary($rootScope, $scope, IHttp, $uibModalInstance, confirm, toastr, $timeout) {

    var diagDefId = $scope.diagDefId;
    var promise;
    if (diagDefId === 0) {
        $scope.lable = '新增诊断名';
    } else {
        $scope.lable = '编辑诊断名';
        IHttp.post("basedata/queryDiagnosedefById", { 'diagDefId': diagDefId }).then(function(data) {
            $scope.diagDef = data.data.diagnosedef;
            $scope.diagDef.enable = $scope.diagDef.enable + '';
        });
    }

    $scope.saveDiagDef = function() {
        $scope.verify = verify();
        if (!$scope.verify) {
            return;
        }
        $rootScope.btnActive = false;
        promise = $timeout(function() {
            IHttp.post("basedata/updateDiagnosedef", $scope.diagDef).then(function(rs) {
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
        return $scope.diagnosis.$valid && !!($scope.diagDef.name || $scope.diagDef.enable)
    }
}
