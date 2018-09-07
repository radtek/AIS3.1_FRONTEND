editDeptDictionary.$inject = ['$scope', 'IHttp', '$uibModalInstance', '$timeout'];

module.exports = editDeptDictionary;

function editDeptDictionary($scope, IHttp, $uibModalInstance, $timeout) {
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
        if (promise) {
            $timeout.cancel(promise);
        }
        promise = $timeout(function() {
            IHttp.post("basedata/updateDept", $scope.dept).then(function(data) {
                if (data.data.resultCode === '1') {
                    $uibModalInstance.close();
                }
            });
        }, 500);
    }
    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };
}
