inputInfo.$inject = ['$scope', 'IHttp', '$uibModalInstance', 'items', '$filter', '$timeout', 'dateFilter'];

module.exports = inputInfo;

function inputInfo($scope, IHttp, $uibModalInstance, items, $filter, $timeout, dateFilter) {
    var promise, returnParam = {
        url: 'searchIoeventGroupByDefIdList',
        param: { docId: items.docId, type: "I", subType: items.type },
        list: [],
        key: items.type == 1 ? 'transfusioninIoeventList' : 'bloodinIoeventList',
        canve: items.type == 1 ? 'sy' : 'sx'
    };
    $scope.lable = items.type == 1 ? '输液' : '输血';

    function initParam() {
        $scope.ioSelected = {};
        $scope.param = {
            startTime_: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm'),
            endTime_: $filter('date')(new Date().getTime() + 1800000, 'yyyy-MM-dd HH:mm'),
            docId: items.docId,
            inEventId: '',
            docType: 1,
        };
    }

    IHttp.post("basedata/getIoDefinationList", { type: "I", subType: items.type }).then(function(result) {
        $scope.getIoList = result.data.resultList;
    });
    IHttp.post('basedata/searchSysCodeByGroupId', { groupId: 'blood_type' }).then(function(result) {
        $scope.bloodList = result.data.resultList;
    });
    IHttp.post('operation/queryOperPersonListByDocId', { docId: items.docId, role: 'N' }).then(function(result) {
        $scope.xhhsList = result.data.resultList;
    });

    $scope.cancel = function() {
        ioWatch();
        $uibModalInstance.dismiss();
    };

    initData();

    function initData() {
        initParam();
        IHttp.post("operation/searchIoeventList", { docId: items.docId, type: 'I', subType: items.type }).then(function(result) {
            if (result.data.resultCode !== '1') return;
            $scope.list = result.data.resultList;
            for (var entity of $scope.list) {
                if (entity.startTime)
                    entity.startTime_ = dateFilter(new Date(entity.startTime), 'yyyy-MM-dd HH:mm');
                if (entity.endTime)
                    entity.endTime_ = dateFilter(new Date(entity.endTime), 'yyyy-MM-dd HH:mm');
            }
        });
    }

    $scope.save = function() {
        $scope.param.startTime = new Date($scope.param.startTime_);
        $scope.param.endTime = new Date($scope.param.endTime_);
        $scope.param.priceId = $scope.ioSelected.priceId;
        $scope.param.ioDefId = $scope.ioSelected.ioDefId;
        if (promise) {
            $timeout.cancel(promise);
        }
        promise = $timeout(function() {
            IHttp.post("operation/saveIoevent", $scope.param).then(function(result) {
                if (result.data.resultCode !== '1') return;
                initData();
                $scope.cancel = function() {
                    ioWatch();
                    returnParam.list = $scope.list;
                    $uibModalInstance.close(returnParam);
                };
            });
        }, 500);
    }

    $scope.edit = function(row) {
        $scope.param = angular.copy(row);
        $scope.ioSelected = {
            ioDefId: row.ioDefId,
            name: row.name,
            priceId: row.priceId,
            blood: row.blood ? 1 : 0,
            spec: row.spec,
            firm: row.firm
        }
    }

    var ioWatch = $scope.$watch('ioSelected', function(n) {
        if (angular.equals({}, n)) return;
        $scope.param.spec = n.spec;
        $scope.param.firm = n.firm;
    });

    $scope.delete = function(id) {
        IHttp.post("operation/deleteIoevent", { inEventId: id }).then(function(result) {
            if (result.data.resultCode !== '1') return;
            initData();
            $scope.cancel = function() {
                ioWatch();
                returnParam.list = $scope.list;
                $uibModalInstance.close(returnParam);
            };
        });
    }

    $scope.add = initParam;
}
