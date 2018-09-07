editInOutVolumeDictionary.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModalInstance', 'confirm', 'toastr', '$timeout'];

module.exports = editInOutVolumeDictionary;

function editInOutVolumeDictionary($rootScope, $scope, IHttp, $uibModalInstance, confirm, toastr, $timeout) {
    var promise;
    //user group li
    $scope.editInoutVolumetype = ['出量','入量'];
    var ioDefId = $scope.ioDefId;
    if (ioDefId === 0) {
        $scope.lable = '新增出入量';
    } else {
        $scope.lable = '编辑出入量';
        IHttp.post("basedata/queryIoDefinationById", { 'ioDefId': ioDefId }).then(function(rs) {
            if (rs.data.resultCode !== '1') return;
            $scope.inoutVolume = rs.data.ioDefination;
            if ($scope.inoutVolume.type === 'I') {
                $scope.inoutVolume.typeStr = "入量";
            }else {
                $scope.inoutVolume.typeStr = "出量";
            }
        });
    }

    $scope.save = function() {
        $scope.verify = verify();
        if (!$scope.verify) {
            return;
        }
        $rootScope.btnActive = false;
        if($scope.inoutVolume.typeStr === "出量"){
            $scope.inoutVolume.type="O";
        }else{
            $scope.inoutVolume.type="I";
        }
        promise = $timeout(function() {
            IHttp.post("basedata/updateIoDefination", $scope.inoutVolume).then(function(rs) {
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
        if ($scope.inoutVolume.typeStr === '入量') {
            return $scope.inoutVolumeDict.$valid && !!($scope.inoutVolume.dosageUnit || $scope.inoutVolume.spec || $spec.inoutVolume.packageDosageAmount);
        }else {
            return $scope.inoutVolumeDict.$valid && !!($scope.inoutVolume.dosageUnit);
        }
    }
}
