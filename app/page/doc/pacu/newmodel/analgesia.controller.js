analgesia.$inject = ['$scope', 'IHttp', '$uibModalInstance', '$q', 'items', '$filter', '$timeout', 'select', 'auth'];

module.exports = analgesia;

function analgesia($scope, IHttp, $uibModalInstance, $q, items, $filter, $timeout, select, auth) {
    var promise,
        result = {},
        user = auth.loginUser();
        
    $scope.flowUnits = ['l/min', '滴/min', 'ml/h', 'μg/kg/min', 'mg/kg/min', 'μg/h', 'μg/kg/h', 'mg/h', 'mg/kg/h'];

    $scope.param = {
        anaRecordId: items.docId,
        regOptId: items.regOptId,
        analgesicMethod: items.analgesicMethod ? items.analgesicMethod : 0,
        flow1: items.flow1,
        flowUnit1: items.flowUnit1,
        flow2: items.flow2,
        flowUnit2: items.flowUnit2,
        state: items.state,
        docId: items.docId,
        type: '03',
        anaesLevel: items.anaesRecord.anaesLevel,
        asaLevelE: items.anaesRecord.asaLevelE,
        frontOperForbidTake: items.anaesRecord.frontOperForbidTake,
        frontOperSpecialCase: items.anaesRecord.frontOperSpecialCase,
        leaveTo: items.anaesRecord.leaveTo,
        medicineKeep: items.anaesRecord.medicineKeep,
        optBodys: items.anaesRecord.optBodys,
        patAnalgesia: items.anaesRecord.patAnalgesia,
        postOperState: items.anaesRecord.postOperState,
        state: items.anaesRecord.state,
        createuser: user.userName
    }

    IHttp.post("basedata/getMedicalTakeWayList", { type: '' }).then((rs) => {
        $scope.arr_medTakeWay = rs.data.resultList;
    });

    // select.getMedicineList().then((rs) => {
    //     $scope.getMedList = rs.data.resultList;
    // });

    $scope.getMedicineList = function(query) {
        var deferred = $q.defer();
        queryMedicineList(query, function(list) {
            $timeout(function() {
                deferred.resolve(list);
            }, 500);
        });
        return deferred.promise;
    }

    function queryMedicineList(query, callback) {
        IHttp.post("basedata/getMedicineList", { pinyin: query, pageNo: 1, pageSize: 200 }).then(function(result) {
            if (result.data.resultCode !== '1') return;
            callback(result.data.resultList);
        });
    }

    var med = $scope.$watch('medicine', (n) => {
        if (n == undefined) return;
        $scope.param.medicineId = n.medicineId;
        $scope.param.priceId = n.priceId;
        $scope.param.firm = n.firm;
        $scope.param.spec = n.spec;
    });

    $scope.changeMethod = function(state) {
        var url = 'document/updateAnaesRecord';
        if(state == 1)
            url = 'document/updateFlow';
        IHttp.post(url, $scope.param).then((rs) => {
            if (rs.data.resultCode != '1') {
                $scope.param.analgesicMethod = items.analgesicMethod ? items.analgesicMethod : 0;
                return;
            }
            result.analgesicMethod = $scope.param.analgesicMethod;
            result.flow1 = $scope.param.flow1;
            result.flowUnit1 = $scope.param.flowUnit1;
            result.flow2 = $scope.param.flow2;
            result.flowUnit2 = $scope.param.flowUnit2;
        });
    }

    init();

    $scope.save = function() {
        if (promise) {
            $timeout.cancel(promise);
        }
        promise = $timeout(function() {
            IHttp.post("operation/saveMedicalevent", $scope.param).then(function(rs) {
                if (rs.data.resultCode != '1') return;
                init();
                rest();
            });
        }, 500);
    }

    $scope.edit = function(row) {
        $scope.medicine = {
            name: row.name,
            medicineId: row.medicineId,
            priceId: row.priceId,
            firm: row.firm,
            spec: row.spec
        }
        $scope.param.dosage = row.dosage;
        $scope.param.medTakeWayId = row.medTakeWayId;
        $scope.param.medEventId = row.medEventId;
    }

    $scope.delete = function(id) {
        IHttp.post("operation/deleteMedicalevent", { medEventId: id }).then(function(rs) {
            if (rs.data.resultCode != '1') return;
            init();
            rest();
        });
    }

    $scope.cancel = function() {
        med();
        $uibModalInstance.close(result);
    };

    $scope.rest = rest;

    function init() {
        IHttp.post('operation/serarchMedicaleventList', { docId: items.docId, type: '03' }).then((rs) => {
            $scope.list = rs.data.resultList;
        });
    }

    function rest() {
        $scope.medicine = '';
        $scope.param.medEventId = '';
        $scope.param.dosage = '';
        $scope.param.medTakeWayId = '';
    }
}
