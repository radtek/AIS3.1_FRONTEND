inspectionEvent.$inject = ['$scope', 'IHttp', '$uibModalInstance', 'items', 'toastr', '$filter', '$timeout'];

module.exports = inspectionEvent;

function inspectionEvent($scope, IHttp, $uibModalInstance, items, toastr, $filter, $timeout) {
    var promise,
        occurTime_ = new Date();
    $scope.docId = items.docId;
    $scope.saved = true;
    $scope.btnActive = false;
    init();
    function init() {
        $scope.param = {};
        occurTime_ = new Date();
        IHttp.post('operation/searchCheckeventList', { docId: items.docId }).then(function(rs) {
            if (rs.data.resultCode !== '1') return;
            $scope.item = rs.data.resultList;
        });
        IHttp.post('basedata/searchAllCheckItem', { enable: 1 }).then(function(rs) {
            if (rs.data.resultCode !== '1') return;
            $scope.list = rs.data.resultList;
        });
    }

    $scope.edit = function(row) {
        $scope.param = angular.copy(row);
        $scope.param.occurTime_ = $filter('date')(new Date(row.occurTime), 'yyyy-MM-dd HH:mm');
        occurTime_ = row.occurTime;
        IHttp.post('operation/searchCheckeventItemList', { docId: items.docId, cheEventId: row.cheEventId }).then(function(rs) {
            if (rs.data.resultCode !== '1') return;
            $scope.list = rs.data.resultList;
        });
    }

    $scope.delete = function(id) {
        IHttp.post('operation/deleteCheckevent', { docId: items.docId, cheEventId: id }).then(function(rs) {
            if (rs.data.resultCode !== '1') return;
            init();
            $scope.cancel = function() {
                $uibModalInstance.close();
            }
        });
    }

    $scope.add = init;

    $scope.save = function() {
        var param = {
            evtCheckEvent: {
                cheEventId: $scope.param.cheEventId,
                cheEventName: $scope.param.cheEventName,
                docId: items.docId,
                occurTime: new Date($filter('date')(new Date($scope.param.occurTime_), 'yyyy-MM-dd HH:mm')).getTime(),
                resultSummary: $scope.param.resultSummary
            },
            checkeventItemRelationList: $scope.list
        }
        if (!param.evtCheckEvent.cheEventName || !param.evtCheckEvent.occurTime) {
            toastr.warning("名称或时间不能为空");
            return;
        }
        if (promise) {
            $timeout.cancel(promise);
        }
        $scope.saved = false;
        $scope.btnActive = true;
        promise = $timeout(function() {
            IHttp.post('operation/saveCheckevent', param).then(function(rs) {
                $scope.saved = true;
                $scope.btnActive = false;
                if (rs.data.resultCode !== '1') return;
                init();
                $scope.cancel = function() {
                    $uibModalInstance.close();
                }
            });
        }, 500);
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    }

}
