modelHzTime.$inject = ['$scope', 'IHttp', '$uibModalInstance', 'items', 'toastr', '$timeout'];

module.exports = modelHzTime;

function modelHzTime($scope, IHttp, $uibModalInstance, items, toastr, $timeout) {
    var promise,
        freqList;
    $scope.freq = {};
    $scope.saveTimeSpan = [30];
    $scope.normalTimeSpan = [60, 120, 300, 600];

    IHttp.post("basedata/queryMonitorConfigFreqList", {}).then(function(result) {
        if (result.data.resultCode !== '1') return;
        freqList = result.data.resultList;
        for (var a = 0; a < freqList.length; a++) {
            if (freqList[a].type == 'normal')
                $scope.freq.normal = freqList[a].value - 0;
            else if (freqList[a].type == 'save')
                $scope.freq.save = freqList[a].value - 0;
        }
    });

    $scope.save = function() {
        if (promise) {
            $timeout.cancel(promise);
        }
        for(var a = 0; a < freqList.length; a++) {
            if(freqList[a].type == 'normal') {
                freqList[a].value = $scope.freq.normal;
                break;
            }
        }
        promise = $timeout(function() {
            IHttp.post("operCtl/updFreq", {
                regOptId: items.regOptId,
                time: new Date(),
                freqList: freqList
            }).then(function(result) {
                if (result.data.resultCode !== '1') return;
                $uibModalInstance.close();
            });
        }, 500);
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    }
}
