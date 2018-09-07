inputInfo.$inject = ['$scope', 'IHttp', '$uibModalInstance', 'items', '$filter', 'dateFilter', '$timeout', 'auth'];

module.exports = inputInfo;

function inputInfo($scope, IHttp, $uibModalInstance, items, $filter, dateFilter, $timeout, auth) {
    var promise, returnParam = {
            url: 'searchIoeventGroupByDefIdList',
            param: { docId: items.docId, type: "I", subType: items.type },
            key: items.type == 1 ? 'inIoeventList' : 'bloodinIoeventList',
            canve: items.type == 1 ? 'sy' : 'sx'
        },
        user = auth.loginUser();
    $scope.beCode = user.beCode;
    $scope.lable = items.type == 1 ? '输液' : '输血';
    if (user.beCode == 'nhfe' || user.beCode == 'qnzzyyy' || user.beCode == 'xycdyy' || user.beCode == 'yxyy') {
        returnParam.key = 'inIoeventList';
    }

    function initParam() {
        $scope.ioSelected = {};
        $scope.param = {
            startTime_: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm'),
            endTime_: (user.beCode != 'qnzrmyy' && user.beCode != 'syzxyy' && user.beCode != 'cshtyy' && user.beCode != 'yxyy' && user.beCode != 'qnzzyyy') ? $filter('date')(new Date().getTime() + 1800000, 'yyyy-MM-dd HH:mm') : '',
            docId: items.docId,
            inEventId: '',
            docType: 1,
        };
    }

    var params = {
        type: "I"
    }

    IHttp.post("basedata/getIoDefinationList", params).then(function(result) {
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
        var params2 = {
            docId: items.docId,
            type: 'I'
        }
        IHttp.post("operation/searchIoeventList", params2).then(function(result) {
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
        $scope.param.startTime = $scope.param.startTime_ ? new Date($scope.param.startTime_) : '';
        $scope.param.endTime = $scope.param.endTime_ ? new Date($scope.param.endTime_) : '';
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
                    returnParam.param.subType = undefined;
                    $uibModalInstance.close(returnParam);
                };
            });
        }, 500);
    }

    $scope.edit = function(row) {
        $scope.param = angular.copy(row);
        if (row.startTime)
            $scope.param.startTime_ = dateFilter(new Date(row.startTime), 'yyyy-MM-dd HH:mm');
        if (row.endTime)
            $scope.param.endTime_ = dateFilter(new Date(row.endTime), 'yyyy-MM-dd HH:mm');
        if (!(user.beCode == 'nhfe' || user.beCode == 'qnzzyyy' || user.beCode == 'xycdyy' || user.beCode == 'yxyy')) {
            $scope.ioSelected = {
                ioDefId: row.ioDefId,
                name: row.name,
                priceId: row.priceId,
                blood: row.blood ? 1 : 0,
                spec: row.spec,
                firm: row.firm,
                dosageUnit: row.dosageUnit
            }
        }else {
            for (var entity of $scope.getIoList) {
                if (row.ioDefId == entity.ioDefId) {
                    $scope.ioSelected = entity;
                }
            }
        }
    }

    var ioWatch = $scope.$watch('ioSelected', function(n) {
        if (angular.equals({}, n)) return;
        $scope.param.spec = n.spec;
        $scope.param.firm = n.firm;
        $scope.param.dosageUnit = n.dosageUnit;
        if (!$scope.param.inEventId)
            $scope.param.dosageAmount = n.packageDosageAmount;
    });

    $scope.delete = function(id) {
        IHttp.post("operation/deleteIoevent", { inEventId: id }).then(function(result) {
            if (result.data.resultCode !== '1') return;
            initData();
            $scope.cancel = function() {
                ioWatch();
                returnParam.param.subType = undefined;
                $uibModalInstance.close(returnParam);
            };
        });
    }

    $scope.add = initParam;
}