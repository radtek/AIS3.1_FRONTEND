modelAnaesthetic.$inject = ['$scope', 'IHttp', '$uibModalInstance', '$timeout', 'items', '$q', 'dateFilter', '$filter', 'auth'];

module.exports = modelAnaesthetic;

function modelAnaesthetic($scope, IHttp, $uibModalInstance, $timeout, items, $q, dateFilter, $filter, auth) {
    var promise, rowClick, returnParam = {
        url: 'searchMedicaleventGroupByCodeList',
        param: { docId: items.docId, type: items.type },
        key: items.type == '1' ? 'treatMedEvtList' : (items.type == '2' ? 'anaesMedEvtList' : 'analgesicMedEvtList'),
        canve: items.type == '1' ? 'zl' : 'mz'
    },
    user = auth.loginUser();
    $scope.beCode = user.beCode;
    $scope.lable = items.type == '2' ? '麻醉用药' : (items.type == '1' ? '治疗用药' : '药物维持');

    if(user.beCode == 'nhfe') {
        if(items.type == '1')
            $scope.lable = '治疗用药';
        else
            $scope.lable = '麻醉用药';
    }

    function initParam() {
        $scope.medicine = {};
        $scope.param = {
            startTime_: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm'),
            docType: 1,
            docId: items.docId,
            type: items.type,
            medEventId: '',
            durable: 0,
            durable_: false,
            medTakeWayId: '',
            showOption: 3
        };
    }
    initData();

    function initData() {
        initParam();
        IHttp.post('operation/serarchMedicaleventList', { docId: items.docId, type: items.type, docType: 1 }).then(function(rs) {
            if (rs.data.resultCode !== '1') return;
            $scope.dcl = rs.data.resultList;
            for(var entity of $scope.dcl) {
                if (entity.startTime)
                    entity.startTime_ = dateFilter(new Date(entity.startTime), 'yyyy-MM-dd HH:mm');
                if (entity.endTime)
                    entity.endTime_ = dateFilter(new Date(entity.endTime), 'yyyy-MM-dd HH:mm');
            }
        });
    }
    IHttp.post('basedata/queryMedicalTakeReasonList', {}).then(function(rs) {
        if (rs.data.resultCode !== '1') return;
        $scope.reasonList = rs.data.resultList;
    });
    IHttp.post('basedata/getMedicalTakeWayList', {}).then(function(rs) {
        if (rs.data.resultCode !== '1') return;
        $scope.medTakeWayList = rs.data.resultList;
    });
    IHttp.post('operation/queryOperPersonListByDocId', { docId: items.docId, role: 'A' }).then(function(rs) {
        if (rs.data.resultCode !== '1') return;
        $scope.operPersonList = rs.data.resultList;
    });
    var durWatch = $scope.$watch('param.durable_', function(val) {
        if (val !== undefined && val === true) {
            $scope.param.durable = 1;
            if (user.beCode != 'qnzzyyy')
                $scope.param.endTime_ = $scope.param.endTime_ ? $scope.param.endTime_ : $filter('date')(new Date($scope.param.startTime_).getTime() + 1800000, 'yyyy-MM-dd HH:mm');
        } else {
            $scope.param.durable = 0;
        }
    });
    $scope.getItem = function(query) {
        var deferred = $q.defer();
        queryItem(query, function(list) {
            $timeout(function() {
                deferred.resolve(list);
            }, 500);
        });
        return deferred.promise;
    }

    $scope.add = initParam;

    $scope.save = function() {
        $scope.param.endTime = ($scope.param.durable && $scope.param.endTime_) ? new Date($scope.param.endTime_) : '';
        $scope.param.startTime = new Date($scope.param.startTime_);
        if (promise) {
            $timeout.cancel(promise);
        }
        promise = $timeout(function() {
            IHttp.post("operation/saveMedicalevent", $scope.param).then(function(data) {
                if (data.data.resultCode === '1') {
                    initData();
                    $scope.cancel = function() {
                        medWatch();
                        durWatch();
                        $uibModalInstance.close(returnParam);
                    };
                }
            });
        }, 500);
    }

    $scope.edit = function(row) {
        rowClick = row
        $scope.param = angular.copy(row);
        if (row.medDetailList.length > 0) {
            $scope.param.flow = row.medDetailList[0].flow;
            $scope.param.flowUnit = row.medDetailList[0].flowUnit;
            $scope.param.thickness = row.medDetailList[0].thickness;
            $scope.param.thicknessUnit = row.medDetailList[0].thicknessUnit;
        }
        $scope.param.medTakeWayIdList = $scope.param.medTakeWayId.split(',');
        $scope.param.startTime_ = dateFilter(new Date(row.startTime), 'yyyy-MM-dd HH:mm');
        if (row.endTime)
            $scope.param.endTime_ = dateFilter(new Date(row.endTime), 'yyyy-MM-dd HH:mm');
        $scope.medicine = {
            name: row.name,
            priceId: row.priceId,
            medicineId: row.medicineId,
            spec: row.spec,
            dosageUnit: row.dosageUnit,
            firm: row.firm
        }
    }

    var medWatch = $scope.$watch('medicine', function(n) {
        if (angular.equals({}, n)) return;
        $scope.param.spec = n.spec;
        $scope.param.firm = n.firm;
        $scope.param.medicineId = n.medicineId;
        $scope.param.priceId = n.priceId;
    });

    $scope.delete = function(id) {
        IHttp.post("operation/deleteMedicalevent", { medEventId: id }).then(function(data) {
            if (data.data.resultCode === '1') {
                initData();
                $scope.cancel = function() {
                    medWatch();
                    durWatch();
                    $uibModalInstance.close(returnParam);
                };
            }
        });
    }

    $scope.cancel = function() {
        medWatch();
        durWatch();
        $uibModalInstance.dismiss();
    };

    function queryItem(query, callback) {
        IHttp.post("basedata/getMedicineList", { pinyin: query, pageNo: 1, pageSize: 200 }).then(function(result) {
            if (result.data.resultCode !== '1') return;
            callback(result.data.resultList);
        });
    }
}
