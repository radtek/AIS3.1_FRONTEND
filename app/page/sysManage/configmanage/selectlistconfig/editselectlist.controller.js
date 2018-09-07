editselectlist.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModalInstance', 'select', 'confirm', 'toastr', '$timeout','auth'];

module.exports = editselectlist;

function editselectlist($rootScope, $scope, IHttp, $uibModalInstance, select, confirm, toastr, $timeout,auth) {
    var promise;
    var vm = this;
    var user = auth.loginUser();
    $scope.doc ={'beid':user.beid};
    if ($scope.item != undefined) {
        $scope.lable = "编辑下拉框设置"; 
        $scope.doc = angular.copy($scope.item);
        $scope.doc.enable=$scope.item.enable_+"";
        $scope.doc.operationState=$scope.item.operationState_;
        $scope.doc.isOperShow=$scope.doc.isOperShow_+"";
        $scope.doc.isNeed=$scope.doc.isNeed_+"";
        $scope.doc.isEnterOperFinish=$scope.doc.isEnterOperFinish_+"";

        $scope.doc.enable_=undefined;
        $scope.doc.operationState_=undefined;
        $scope.doc.isOperShow_=undefined;
        $scope.doc.isNeed_=undefined;
        $scope.doc.isEnterOperFinish_=undefined;

    } else {
        $scope.lable = "新增下拉框设置";
    }
     
    
    //点击科室的保存按钮
    $scope.saveOperationRoom = function() {
        $scope.verify = verify();
        if (!$scope.verify) {
            return;
        }
        $scope.doc.enable= parseInt(0+$scope.doc.enable);        
        $scope.doc.isOperShow=parseInt(0+$scope.doc.isOperShow);
        $scope.doc.isNeed=parseInt(0+$scope.doc.isNeed);
        $scope.doc.isEnterOperFinish=parseInt(0+$scope.doc.isEnterOperFinish);

        $rootScope.btnActive = false;
        promise = $timeout(function() {
            IHttp.post("basedata/saveBasDocument", $scope.doc).then(function(rs) {
                $rootScope.btnActive = true;
                if (rs.data.resultCode === '1') {
                    $uibModalInstance.close();
                    toastr.success(rs.data.resultMessage);
                }
            });
        }, 500);
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };

    // 验证
    function verify() {
        return !!($scope.doc.name || $scope.doc.table)
    }
}
