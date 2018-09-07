rescueEvent.$inject = ['$scope', 'IHttp', '$uibModalInstance', 'items', '$filter', '$timeout'];

module.exports = rescueEvent;

function rescueEvent($scope, IHttp, $uibModalInstance, items, $filter, $timeout) {
    var promise;
    
    IHttp.post("operation/searchRescueeventCurrentState", { docId: items.docId }).then(function(result) {
        if (result.data.resultCode !== '1') return;
        $scope.model = result.data.rescueevent.model;
    });

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };

    $scope.save = function() {
        if (promise) {
            $timeout.cancel(promise);
        }
        promise = $timeout(function() {
            IHttp.post("operCtl/changeModel", {
                regOptId: items.regOptId,
                time: new Date(),
                rescueevent: {
                    docId: items.docId,
                    model: $scope.model
                }
            }).then(function(result) {
                if (result.data.resultCode !== '1') return;
                $uibModalInstance.close();
            });
        }, 500);
    }

}
