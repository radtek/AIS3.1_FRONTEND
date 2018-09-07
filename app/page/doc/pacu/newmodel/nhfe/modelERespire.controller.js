modelERespire.$inject = ['$scope', 'IHttp', '$uibModalInstance', 'items', 'toastr', '$filter', '$timeout', 'dateFilter'];

module.exports = modelERespire;

function modelERespire($scope, IHttp, $uibModalInstance, items, toastr, $filter, $timeout, dateFilter) {
    var promise,
        refresh = false;
    var ctlBreId = '';

    IHttp.post("operation/searchCtlBreathCurrentState", { docId: items.docId }).then(function(result) {
        if (result.data.resultCode !== '1') return;
        $scope.type = result.data.ctlBreath.type + '';
    });

    function initData() {
        IHttp.post("operation/searchCtlBreathList", { docId: items.docId} ).then(function(rs) {
            if (rs.data.resultCode !== '1') return;
            $scope.ersList = rs.data.resultList;
        });
    }
    initData();

    $scope.cancel = function() {
        $uibModalInstance.close({refresh: refresh});
    };

    $scope.save = function() {
        if (promise) {
            $timeout.cancel(promise);
        }
        refresh = true;
        var startTime = new Date($filter('date')(new Date($scope.time), 'yyyy-MM-dd HH:mm')).getTime();
        promise = $timeout(function() {
            IHttp.post("operation/saveCtlBreath", {
                ctlBreId: ctlBreId !== '' ? ctlBreId : undefined,
                docId: items.docId,
                startTime: startTime,
                type: $scope.type
            }).then(function(result) {
                if (result.data.resultCode !== '1') return;
                $uibModalInstance.close({refresh: refresh});
            });
        }, 500);
    }

    $scope.editInfo = function(item) {
        ctlBreId = item.ctlBreId;
        $scope.type = item.type;
        $scope.time = dateFilter(new Date(item.startTime), 'yyyy-MM-dd HH:mm');
    }

    $scope.delete = function(item) {
        refresh = true;
        IHttp.post("operation/deleteCtlBreath", { ctlBreId: item.ctlBreId }).then(function(rs) {
            if (rs.data.resultCode !== '1') return;
            initData();
        });
    }

    $scope.checkTime = function() {
        var currTime = new Date($filter('date')(new Date(), 'yyyy-MM-dd HH:mm')).getTime();
        var time = new Date($filter('date')(new Date($scope.time), 'yyyy-MM-dd HH:mm')).getTime();
        if (time > currTime) {
            toastr.warning("发生时间不能大于系统当前时间");
            $scope.time = dateFilter(new Date(), 'yyyy-MM-dd HH:mm');
        }
    }

}
