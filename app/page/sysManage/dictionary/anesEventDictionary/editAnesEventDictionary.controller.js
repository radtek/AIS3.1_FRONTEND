editanaesEventDictionary.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModalInstance', 'confirm', 'toastr', '$timeout'];

module.exports = editanaesEventDictionary;

function editanaesEventDictionary($rootScope, $scope, IHttp, $uibModalInstance, confirm, toastr, $timeout) {
    var promise;
    if ($scope.id === 0) {
        $scope.lable = '新增麻醉事件';
        $scope.anaesEvent = {
            name: "",
            enable: "1"
        };
    } else {
        $scope.lable = '编辑麻醉事件';
        $scope.anaesEvent = {
            id: $scope.id,
            name: $scope.name,
            enable: $scope.enable == "启用" ? "1" : "0",
            docType: $scope.docType == "麻醉记录单事件" ? "1" : "2",
        }
    }

    $scope.save = function() {
        $scope.verify = verify();
        if (!$scope.verify) {
            return;
        }
        $rootScope.btnActive = false;
        promise = $timeout(function() {
            IHttp.post('basedata/updateAnaesEvent', $scope.anaesEvent).then(function(rs) {
                $rootScope.btnActive = true;
                if (rs.data.resultCode != 1) return;
                $uibModalInstance.close();
                toastr.success(rs.data.resultMessage);
            });
        }, 500);
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };

    // 验证
    function verify() {
        return $scope.anaesEventDict.$valid && !!($scope.anaesEvent.codeName || $scope.anaesEvent.enable)
    }
}