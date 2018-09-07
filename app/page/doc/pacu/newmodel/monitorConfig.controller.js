monitorConfig.$inject = ['$scope', 'IHttp', '$uibModalInstance', 'items', 'toastr', '$timeout'];

module.exports = monitorConfig;

function monitorConfig($scope, IHttp, $uibModalInstance, items, toastr, $timeout) {
    var promise;
    IHttp.post("operCtl/queryAllMonitorConfig", { regOptId: items.regOptId }).then(function(result) {
        $scope.monConfigList = result.data.monitorConfigList;
    });

    $scope.count = function(item) {
        var checkList = $scope.monConfigList.filter(function(item) {
            return item.isCheck;
        });
        if (checkList.length > items.number) {
            item.isCheck = false;
            toastr.error('最多选择' + items.number + '个监测项');
        }
    }

    $scope.save = function() {
        var checkList = $scope.monConfigList.filter(function(item) {
            return item.isCheck;
        });
        checkList.forEach(function(item) {
            item.regOptId = items.regOptId;
        });
        if (promise) {
            $timeout.cancel(promise);
        }
        promise = $timeout(function() {
            IHttp.post("operCtl/updMonitorConfig", { regOptId: items.regOptId, checkList: checkList }).then(function(result) {
                if (result.data.resultCode !== '1') return;
                $uibModalInstance.close(result.data.monitorConfigList);
            });
        }, 500);
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    }
}