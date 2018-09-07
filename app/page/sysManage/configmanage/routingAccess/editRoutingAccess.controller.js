editRoutingAccess.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModalInstance', 'select', 'confirm', 'toastr', '$timeout','auth'];

module.exports = editRoutingAccess;

function editRoutingAccess($rootScope, $scope, IHttp, $uibModalInstance, select, confirm, toastr, $timeout,auth) {
    var promise;
    var vm = this;
    var user = auth.loginUser();
    $scope.doc ={'beid':user.beid};
    if ($scope.item != undefined) {
        $scope.lable = "编辑路由接口设置"; 

        $scope.doc = angular.copy($scope.item);

    } else {
        $scope.lable = "新增路由接口设置";
    }
     
    
    //点击科室的保存按钮
    $scope.saveOperationRoom = function() {
        $scope.verify = verify();
        if (!$scope.verify) {
            return;
        }      

        $rootScope.btnActive = false;
        promise = $timeout(function() {
            IHttp.post("basedata/saveBasRoutingAccess", $scope.doc).then(function(rs) {
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
        return !!($scope.doc.uri || $scope.doc.clazzUri)
    }
}
