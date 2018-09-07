outIoevent.$inject = ['$scope', 'IHttp', '$uibModalInstance', 'items', '$filter', '$timeout'];

module.exports = outIoevent;

function outIoevent($scope, IHttp, $uibModalInstance, items, $filter, $timeout) {
    var promise, returnParam = {
        url: 'searchEgressGroupByDefIdList',
        param: { docId: items.docId, type: "O" },
        key: 'outIoeventList',
        canve: 'cl'
    };

    function initParam() {
        $scope.outSelected = {};
        $scope.param = {
            startTime_: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm'),
            docId: items.docId,
            egressId: '',
            docType: 1,
        };
    }

    IHttp.post('basedata/getIoDefinationList', { type: "O" }).then(function(result) {
        $scope.getOutList = result.data.resultList;
    });
    IHttp.post('operation/queryOperPersonListByDocId', { docId: items.docId, role: 'N' }).then(function(result) {
        $scope.xhhsList = result.data.resultList;
    });

    initData();

    function initData() {
        initParam();
        IHttp.post("operation/searchEgressList", { docId: items.docId }).then(function(result) {
            $scope.list = result.data.resultList;
        });
    }

    $scope.save = function() {
        $scope.param.startTime = new Date($scope.param.startTime_);
        $scope.param.ioDefId = $scope.outSelected.ioDefId;
        if (promise) {
            $timeout.cancel(promise);
        }
        promise = $timeout(function() {
            IHttp.post("operation/saveEgress", $scope.param).then(function(result) {
                if (result.data.resultCode !== '1') return;
                initData();
                $scope.cancel = function() {
                    $uibModalInstance.close(returnParam);
                };
            });
        }, 500);
    }

    $scope.edit = function(row) {
        $scope.param = angular.copy(row);
        $scope.param.startTime_ = $filter('date')(row.startTime, 'yyyy-MM-dd HH:mm')
        $scope.outSelected = {
            ioDefId: row.ioDefId,
            name: row.name,
            dosageUnit: row.dosageUnit
        }
    }

    var medWatch = $scope.$watch('outSelected', function(n) {
        if (angular.equals({}, n)) return;
        $scope.param.dosageUnit = n.dosageUnit;
    });
    $scope.delete = function(id) {
        IHttp.post("operation/deleteEgress", { egressId: id }).then(function(result) {
            if (result.data.resultCode !== '1') return;
            initData();
            $scope.cancel = function() {
                $uibModalInstance.close(returnParam);
            };
        });
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };

    $scope.add = initParam;

}
