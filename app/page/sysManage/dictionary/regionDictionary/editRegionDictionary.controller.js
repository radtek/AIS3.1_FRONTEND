editRegionDictionary.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModalInstance', 'confirm', 'toastr', '$timeout'];

module.exports = editRegionDictionary;

function editRegionDictionary($rootScope, $scope, IHttp, $uibModalInstance, confirm, toastr, $timeout) {
    var regionId = $scope.regionId;
    var promise;
    if (regionId === 0) {
        $scope.lable = '新增病区信息';
    } else {
        $scope.lable = '编辑病区信息';
        IHttp.post("basedata/queryRegionById", { 'regionId': regionId }).then(function(data) {
            $scope.region = data.data.region;
            $scope.region.enable = $scope.region.enable + '';
        });
    }

    //点击科室的保存按钮
    $scope.saveRegion = function() {
        $scope.verify = verify();
        if (!$scope.verify) {
            return;
        }
        $rootScope.btnActive = false;
        promise = $timeout(function() {
            IHttp.post("basedata/updateRegion", $scope.region).then(function(rs) {
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
        return $scope.regionform.$valid && !!($scope.region.name || $scope.region.enable)
    }
}
