editPerdefDictionary.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModalInstance', 'confirm', 'toastr', '$timeout'];

module.exports = editPerdefDictionary;

function editPerdefDictionary($rootScope, $scope, IHttp, $uibModalInstance, confirm, toastr, $timeout) {
    var promise;
    var operdefId = $scope.operdefId;
    if (operdefId === 0) {
        $scope.lable = '新增手术名称';
    } else {
        $scope.lable = '编辑手术名称';
        IHttp.post("basedata/queryOperdefById", { 'operdefId': operdefId }).then(function(rs) {
            $scope.operdef = rs.data.operdef;
        });
    }

    //点击手术名称的保存按钮
    $scope.saveOperdef = function() {
        $scope.verify = verify();
        if (!$scope.verify) {
            return;
        }
        $rootScope.btnActive = false;
        promise = $timeout(function() {
            IHttp.post("basedata/saveOperdef", $scope.operdef).then(function(rs) {
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
        return $scope.predef.$valid && !!($scope.operdef.name || $scope.operdef.enable)
    }
}
