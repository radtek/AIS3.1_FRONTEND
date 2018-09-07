editOperationpeopleDictionary.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModalInstance', 'confirm', 'toastr', '$timeout'];

module.exports = editOperationpeopleDictionary;

function editOperationpeopleDictionary($rootScope, $scope, IHttp, $uibModalInstance, confirm, toastr, $timeout) {
    var promise;
    //user group li
    var operatorId = $scope.operatorId;
    if (operatorId === 0) {
        $scope.lable = '新增手术医生';
    } else {
        $scope.lable = '编辑手术医生';
        IHttp.post("basedata/queryOperationPeopleById", { 'operatorId': operatorId }).then(function(data) {
            if (data.data.resultCode !== '1') return;
            $scope.operator = data.data.operationPeople;
        });
    }

    //点击科室的保存按钮
    $scope.saveOperator = function() {
        $scope.verify = verify();
        if (!$scope.verify) {
            return;
        }
        $rootScope.btnActive = false;
        promise = $timeout(function() {
            IHttp.post("basedata/saveOperationPeople", $scope.operator).then(function(rs) {
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
        return $scope.oppeople.$valid && !!($scope.operator.name || $scope.operator.enable)
    }
}
