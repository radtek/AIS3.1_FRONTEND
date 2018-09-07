editDeptDictionary.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModalInstance', 'confirm', 'toastr', '$timeout'];

module.exports = editDeptDictionary;

function editDeptDictionary($rootScope, $scope, IHttp, $uibModalInstance, confirm, toastr, $timeout) {
    var deptId = $scope.deptId;
    var promise;
    if (deptId === 0) {
        $scope.lable = '新增科室信息';
    } else {
        $scope.lable = '编辑科室信息';
        IHttp.post("basedata/queryDeptById", { 'deptId': deptId }).then(function(data) {
            $scope.dept = data.data.resultDept;
            $scope.dept.enable = $scope.dept.enable + '';
        });
    }

    //点击科室的保存按钮
    $scope.saveDept = function() {
        $scope.verify = verify();
        if (!$scope.verify) {
            return;
        }
        $rootScope.btnActive = false;
        promise = $timeout(function() {
            IHttp.post("basedata/updateDept", $scope.dept).then(function(rs) {
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
        return $scope.deptform.$valid && !!($scope.dept.name || $scope.dept.enable)
    }
}
