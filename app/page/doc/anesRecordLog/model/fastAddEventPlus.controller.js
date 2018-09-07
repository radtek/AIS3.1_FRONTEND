fastAddEvent.$inject = ['$scope', 'IHttp', '$uibModalInstance', '$timeout', 'toastr', 'auth', '$filter'];

module.exports = fastAddEvent;

function fastAddEvent($scope, IHttp, $uibModalInstance, $timeout, toastr, auth, $filter) {
    var parm = $scope.parm;
    var promise;
    $scope.thicknessUnits = ['', '摩尔', '%', 'mg/ml', 'ng/ml', 'μg/ml'];
    $scope.flowUnits = ['', 'l/min', '滴/min', 'ml/h', 'μg/kg/min', 'mg/kg/min', 'μg/kg/h', 'mg/kg/h'];
    if (parm.isAdd == undefined) {
        var evObj = parm.transdata[parm.dataIndex].ev_list;
        var list = parm.transdata,
            evId;
        $scope.isAdd = false;
        $scope.isEdit = false;

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
            insertTime: $filter('date')(evObj.startTime, 'yyyy-MM-dd HH:mm:ss')
        };
        for (var i = 0; i < list.length; i++) {
            if (list[i].ev_list && list[i].ev_list.docId) {
                $scope.obj.docId = list[i].ev_list.docId;
                break;
            }
        }
        angular.merge($scope.obj, evObj);
    } else {
        $scope.obj = {
            name:parm.ev_list.name,
            docId:parm.ev_list.docId,
            medEventId:parm.ev_list.medEventId,
            insertTime: $filter('date')(parm.offsetXtimestamp, 'yyyy-MM-dd HH:mm:ss'),
            showFlowS:true
        };
    }

    // if (!$scope.isAdd) {
    //     list.forEach(function(item, key) {
    //         if (key == 0 || item.startTime == obj.name) {
    //             if (key > 0)
    //                 $scope.isEdit = true;
    //             evId = item.id;
    //             $scope.obj.thickness = item.thickness;
    //             $scope.obj.thicknessUnit = item.thicknessUnit;
    //             $scope.obj.showThick = item.showThick;
    //             $scope.obj.flow = item.flow;
    //             $scope.obj.flowUnit = item.flowUnit;
    //             $scope.obj.showFlow = item.showFlow;
    //         }
    //     })
    // }

    $scope.save = function() {
        var baseParam = {
                id: $scope.obj.id,
                docId: $scope.obj.docId,
                medEventId: evObj?evObj.medEventId:parm.ev_list.medEventId,
                flow: $scope.obj.flow,
                flowUnit: $scope.obj.flowUnit,
                showFlow: $scope.obj.showFlow,
                thickness: $scope.obj.thickness,
                thicknessUnit: $scope.obj.thicknessUnit,
                showThick: $scope.obj.showThick,
                insertTime: new Date($scope.obj.insertTime).getTime()
            }
            // 点击开始时间，保存时需要的参数  && !$scope.isEdit
        if (!$scope.isAdd) {
            baseParam.dosage = $scope.obj.dosage;
            baseParam.dosageUnit = $scope.obj.dosageUnit;
            baseParam.showOption = $scope.obj.showOption;
        }
        if (promise)
            $timeout.cancel(promise);
        promise = $timeout(function() {
            IHttp.post('operation/saveMedicalEventDetail', baseParam).then(function(rs) {
                if (rs.data.resultCode != '1') return;
                closeWin(rs.data);
            });
        }, 500);
    }

    // 删除流速、浓度点;
    $scope.delete = function() {
        IHttp.post("operation/deleteMedicalEventDetail", { id: evId }).then(function(rs) {
            if (rs.data.resultCode != '1') return;
            closeWin(rs.data);
        });
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    }

    function closeWin(dataArr) {
        $uibModalInstance.close({
            url: 'searchMedicaleventGroupByCodeList',
            param: { docId: $scope.parm.docId, type: '01',dataArr: dataArr,vm:parm.vm},
            key: 'treatMedEvtList',
            canve: 'zl'
        });
    }
}
