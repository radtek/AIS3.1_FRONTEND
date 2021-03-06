editOperRoomConfig.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModalInstance', 'select', 'confirm', 'toastr', '$timeout','baseConfig'];

module.exports = editOperRoomConfig;

function editOperRoomConfig($rootScope, $scope, IHttp, $uibModalInstance, select, confirm, toastr, $timeout,baseConfig) {
    var promise;
    var id = $scope.id;
    if (id === 0) {
        $scope.lable = '新增床位';
    } else {
        $scope.lable = '编辑床位';
        IHttp.post("bas/queryRegionBedById", { id: id }).then(function(data) {
            if (data.data.resultCode !== '1') return;
            $scope.regionBed = data.data.regionBed;
        });
    }
    //baseconfig
    baseConfig.init().then(function(rs) {
        var rsList = rs.data.resultList;
        for (var a = 0; a < rsList.length; a++) {
            if (rsList[a].configureValue)
                rsList[a].configureValue = JSON.parse(rsList[a].configureValue);
            else
                rsList[a].configureValue = {};
            // 手术流程
            if (rsList[a].modularType == 1)
                $scope.surgProc = rsList[a];
            // 手术排程
            else if (rsList[a].modularType == 2)
                $scope.surgSchedule = rsList[a];
            // 数据同步
            else if (rsList[a].modularType == 3)
                $scope.DS = rsList[a];
            // 用药配置
            else if (rsList[a].modularType == 4)
                $scope.med = rsList[a];
            // 入量配置
            else if (rsList[a].modularType == 5)
                $scope.i = rsList[a];
            // 其它配置
            else if (rsList[a].modularType == 6)
                $scope.other = rsList[a];
        }
    });
    //




    //点击科室的保存按钮
    $scope.saveOperationRoom = function() {
        $scope.verify = verify();
        if (!$scope.verify) {
            return;
        }
        $rootScope.btnActive = false;
        promise = $timeout(function() {
            IHttp.post("bas/updateRegionBed", $scope.regionBed).then(function(rs) {
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
        return $scope.operation.$valid && !!($scope.regionBed.name )
    }
}
