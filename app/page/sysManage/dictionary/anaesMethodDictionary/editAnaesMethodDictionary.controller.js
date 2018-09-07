editAnaesMethodDictionary.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModalInstance', 'confirm', 'toastr', '$timeout', 'select'];

module.exports = editAnaesMethodDictionary;

function editAnaesMethodDictionary($rootScope, $scope, IHttp, $uibModalInstance, confirm, toastr, $timeout, select) {

    var promise;
    if ($scope.anaMedId === 0) {
        $scope.lable = '新增麻醉方法';
    } else {
        $scope.lable = '编辑麻醉方法';
        initDate();
    }
    function initDate(){
        promise = $timeout(function() {
        IHttp.post("basedata/queryAnaesMethodById", { 'anaMedId': $scope.anaMedId }).then(function(rs) {
            $scope.AnaesMethod = rs.data.anaesMethod;
            $scope.AnaesMethod.anesType = $scope.AnaesMethod.anesType+"";
        });
        }, 500);
    }

    select.sysCodeBy('anesType').then(function(rs) {
        $scope.anesTypeList = rs.data.resultList;
    })
    
    //保存麻醉方法名称
    $scope.saveAnaesMethod = function() {
        $scope.verify = verify();
        if (!$scope.verify) {
            return;
        }
        $rootScope.btnActive = false;
        promise = $timeout(function() {
            IHttp.post("basedata/updateAnaesMethod", $scope.AnaesMethod).then(function(rs) {
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
        return $scope.anaesMethod.$valid && !!($scope.AnaesMethod.name || $scope.AnaesMethod.anesType || $scope.AnaesMethod.isValid)
    }
}
