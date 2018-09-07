fastAddEvent.$inject = ['$scope', 'IHttp', '$uibModalInstance', '$timeout', 'items', 'toastr', 'dateFilter', 'auth', '$filter'];

module.exports = fastAddEvent;

function fastAddEvent($scope, IHttp, $uibModalInstance, $timeout, items, toastr, dateFilter, auth, $filter) {
    var promise;
    var evObj = items.data.data.evObj,
        childList = [],
        curTime;
    var startTime_ = items.data.name;
    $scope.title = '快速追加用药';
    $scope.evObj = items.data.data.evObj;
    $scope.isDelete = false;
    $scope.showEndTime = false;

    if (items.data.data.symbol == "rect" && items.data.data.symbolSize > 3) {
        $scope.isDelete = true;
    }
    if (items.data.data.symbol == "triangle") {
        $scope.showEndTime = true;
    }
    var delParams = {
        id: ""
    }
    var medDetailList = evObj.childList;
    $scope.evObj.endTime = dateFilter(new Date($scope.evObj.endTime), 'yyyy-MM-dd HH:mm');
    for(var medDetail of medDetailList) {
        var newTime = new Date($filter('date')(new Date(items.data.name), 'yyyy-MM-dd HH:mm:ss')).getTime();
        var medDetailTime = medDetail.startTime;
        if (newTime == medDetailTime) {
            delParams.id = medDetail.id;
            $scope.evObj.flow = medDetail.flow;
            $scope.evObj.thickness = medDetail.thickness;
        }
    }

    $scope.evObj.startTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm');
    $scope.isDel = false;
    if (evObj.durable) {
        $scope.title = '快速编辑用药';
        curTime = new Date(items.data.name);
        var childList = $filter('filter')(evObj.childList, function(e, k) {
            return k > 0 && e.startTime === items.data.name;
        });
    } else
        curTime = new Date();
    if (!$scope.showEndTime) {
        $scope.evObj.startTime = $filter('date')(curTime, 'yyyy-MM-dd HH:mm');
    }else {
        $scope.evObj.startTime = dateFilter(new Date(evObj.medicalEvent.startTime), 'yyyy-MM-dd HH:mm');
    }

    $scope.save = function() {
        var baseParam = {},
            url = '',
            mtwIdList = [];
        for(var medTakeWay of evObj.medicalEvent.medTakeWayList) {
            mtwIdList.push(medTakeWay.medTakeWayId);
        }
        if (!$scope.showEndTime) {
            url = 'operation/saveMedicalEventDetail';
            baseParam = {
                id: childList[0] ? childList[0].id : '', //用药详情id   新增是无id，修改时有id
                docId: items.docId, //文书id
                medEventId: evObj.medicalEvent.medEventId, //用药id
                flow: (evObj.durable === 1 && evObj.showOption == '1') ? $scope.evObj.flow : undefined, //流速
                flowUnit: (evObj.durable === 1 && evObj.showOption == '1') ? evObj.flowUnit : undefined, //流速单位
                thickness: (evObj.durable === 1 && evObj.showOption == '2') ? $scope.evObj.thickness : undefined,
                thicknessUnit: (evObj.durable === 1 && evObj.showOption == '2') ? evObj.thicknessUnit : undefined,
                insertTime: startTime_ //插入流速时间  Date类型  修改时insertTime 不能修改
            }
        } else {
            url = 'operation/saveMedicalevent';
            baseParam = {
                medEventId: evObj.medicalEvent.medEventId,
                medicineId: evObj.medicalEvent.medicineId,
                priceId: evObj.medicalEvent.priceId,
                durable: evObj.medicalEvent.durable,
                docType: 1,
                showOption: evObj.showOption,
                spec: evObj.medicalEvent.spec,
                firm: evObj.medicalEvent.firm,
                dosage: $scope.evObj.dosage,
                thickness: $scope.evObj.thickness ? $scope.evObj.thickness : 0,
                thicknessUnit: evObj.medicalEvent.thicknessUnit,
                flow: $scope.evObj.flow ? $scope.evObj.flow : 0,
                flowUnit: evObj.medicalEvent.flowUnit,
                medTakeWayId: evObj.medicalEvent.medTakeWayId,
                medTakeWayIdList: mtwIdList,
                reason: evObj.medicalEvent.reason,
                startTime: new Date($filter('date')(new Date($scope.evObj.startTime), 'yyyy-MM-dd HH:mm')).getTime(),
                endTime: new Date($filter('date')(new Date($scope.evObj.endTime), 'yyyy-MM-dd HH:mm')).getTime(),
                docId: items.docId,
                type: 1,
                createUser: evObj.medicalEvent.createUser,
                createUserName: evObj.medicalEvent.createUserName
            };
        }
        IHttp.post(url, baseParam).then(function(rs) {
            if (rs.data.resultCode !== '1') return;
            closeWin();
        });
    }

    // 删除流速、浓度点;
    $scope.delete = function() {
        IHttp.post("operation/deleteMedicalEventDetail", delParams).then(function(rs) {
            if (rs.data.resultCode !== '1') return;
            closeWin();
        });
    }

    function closeWin() {
        $uibModalInstance.close({
            url: 'searchMedicaleventGroupByCodeList',
            param: { docId: items.docId, type: '01' },
            key: 'treatMedEvtList',
            canve: 'zl'
        });
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    }
}
