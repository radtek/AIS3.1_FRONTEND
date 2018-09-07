fastAddEvent.$inject = ['$scope', 'IHttp', '$uibModalInstance', '$timeout', 'toastr', 'auth', '$filter'];

module.exports = fastAddEvent;

function fastAddEvent($scope, IHttp, $uibModalInstance, $timeout, toastr, auth, $filter) {
    var promise,
        obj = $scope.parm.data,
        evObj = obj.data.evObj,
        list = evObj.medicalEvent.medDetailList,
        evId;

    $scope.isAdd = false;
    $scope.isEdit = false;
    $scope.thicknessUnits = ['', '摩尔', '%', 'mg/ml', 'ng/ml', 'μg/ml'];
    $scope.flowUnits = ['', 'l/min', '滴/min', 'ml/h', 'μg/kg/min', 'mg/kg/min', 'μg/kg/h', 'mg/kg/h'];
    $scope.obj = {
        name: evObj.name,
        durable: evObj.durable,
        dosage: evObj.dosage,
        dosageUnit: evObj.dosageUnit,
        thickness: '',
        thicknessUnit: '',
        showThick: 0,
        flow: '',
        flowUnit: '',
        showFlow: 0,
        showOption: evObj.showOption,
        insertTime: $filter('date')(obj.name, 'yyyy-MM-dd HH:mm:ss')
    };

    if (obj.data.symbol == 'rect') {
        if (typeof(obj.data.symbolSize) == 'number' && obj.data.symbolSize < 5)
            $scope.isAdd = true;
    }

    if (!$scope.isAdd) {
        list.forEach(function(item, key) {
            if (key == 0 || item.startTime == obj.name) {
                if (key > 0)
                    $scope.isEdit = true;
                evId = item.id;
                $scope.obj.thickness = item.thickness;
                $scope.obj.thicknessUnit = item.thicknessUnit;
                $scope.obj.showThick = item.showThick;
                $scope.obj.flow = item.flow;
                $scope.obj.flowUnit = item.flowUnit;
                $scope.obj.showFlow = item.showFlow;
            }
        })
    }

    $scope.save = function() {
        var baseParam = {
            id: evId,
            docId: $scope.parm.docId,
            medEventId: evObj.medicalEvent.medEventId,
            flow: $scope.obj.flow,
            flowUnit: $scope.obj.flowUnit,
            showFlow: $scope.obj.showFlow,
            thickness: $scope.obj.thickness,
            thicknessUnit: $scope.obj.thicknessUnit,
            showThick: $scope.obj.showThick,
            insertTime: new Date($scope.obj.insertTime).getTime()
        }
        // 点击开始时间，保存时需要的参数
        if(!$scope.isAdd && !$scope.isEdit) {
            baseParam.dosage = $scope.obj.dosage;
            baseParam.dosageUnit = $scope.obj.dosageUnit;
            baseParam.showOption = $scope.obj.showOption;
        }
        if (promise)
            $timeout.cancel(promise);
        promise = $timeout(function() {
            IHttp.post('operation/saveMedicalEventDetail', baseParam).then(function(rs) {
                if (rs.data.resultCode != '1') return;
                closeWin();
            });
        }, 500);
    }

    // 删除流速、浓度点;
    $scope.delete = function() {
        IHttp.post("operation/deleteMedicalEventDetail", { id: evId }).then(function(rs) {
            if (rs.data.resultCode != '1') return;
            closeWin();
        });
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    }

    function closeWin() {
        $uibModalInstance.close({
            url: 'searchMedicaleventGroupByCodeList',
            param: { docId: $scope.parm.docId, type: '01' },
            key: 'treatMedEvtList',
            canve: 'zl'
        });
    }
}