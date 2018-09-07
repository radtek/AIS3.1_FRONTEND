editBackDataDict.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModal', '$uibModalInstance', 'confirm', 'toastr', '$timeout'];

module.exports = editBackDataDict;

function editBackDataDict($rootScope, $scope, IHttp, $uibModal, $uibModalInstance, confirm, toastr, $timeout) {
    var promise;
    //user group li
    $rootScope.siteTitle = '数据备份';
   
    // docNav.items = null;
    // breadcrumbs.items = [
    //     { name: '数据备份' }
    // ];
   
    var promise;

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };

    $scope.count = function(row) {
        $scope.verify = verify();
        if (!$scope.verify) {
            return;
        }
        $rootScope.btnActive = false;
        var data=[{bfsm:$scope.bfsm}];
        var scope = $rootScope.$new();
        $rootScope.btnActive = true;
        $uibModalInstance.close(data);
    }
    
    // 验证
    function verify() {
        return $scope.backDataDict.$valid && !!($scope.bfsm || $scope.backData.password)
    }
}
