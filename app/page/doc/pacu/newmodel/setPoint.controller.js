setPoint.$inject = ['$scope', 'IHttp', '$uibModalInstance', '$timeout', 'items', 'toastr', '$filter'];

module.exports = setPoint;

function setPoint($scope, IHttp, $uibModalInstance, $timeout, items, toastr, $filter) {
    var promise;

    $scope.series = angular.copy(items.data);
    $scope.series.time_ = $filter('date')($scope.series.time, 'yyyy-MM-dd HH:mm');
    $scope.series.docId = items.docId;
    $scope.series.observeName = items.series.name;

    $scope.save = function() {
        if (promise) {
            $timeout.cancel(promise);
        }
        promise = $timeout(function() {
            IHttp.post('operCtl/updobsdat', $scope.series).then(function(rs) {
                if (rs.data.resultCode !== '1') return;
                items.data.value = $scope.series.value;
                var temp = items.series.symbol.split('.');
                items.data.symbol = temp[0] + '-2.' + temp[1];
                items.data.itemStyle = { normal: { color: '#FF0000' } };
                $uibModalInstance.dismiss();
            });
        }, 500);
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    }
}
