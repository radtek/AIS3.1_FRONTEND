modelERespire.$inject = ['$scope', 'IHttp', '$uibModalInstance', 'items', '$filter', '$timeout'];

module.exports = modelERespire;

function modelERespire($scope, IHttp, $uibModalInstance, items, $filter, $timeout) {
    var promise;

    IHttp.post("operation/searchCtlBreathCurrentState", { docId: items.docId }).then(function(result) {
        if (result.data.resultCode !== '1') return;
        $scope.type = result.data.ctlBreath.type + '';
    });

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };

    $scope.save = function() {
        if (promise) {
            $timeout.cancel(promise);
        }
        promise = $timeout(function() {
            IHttp.post("operation/saveCtlBreath", {
                docId: items.docId,
                startTime: new Date($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')),
                type: $scope.type
            }).then(function(result) {
                if (result.data.resultCode !== '1') return;
                $uibModalInstance.close();
            });
        }, 500);
    }

}
