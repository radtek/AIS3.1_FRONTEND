loadTemp.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModalInstance', '$timeout', 'items', 'toastr', 'auth', '$filter'];

module.exports = loadTemp;

function loadTemp($rootScope, $scope, IHttp, $uibModalInstance, $timeout, items, toastr, auth, $filter) {
    var promise,
        tempJson,
        vm = this,
        returnList = [];
    vm.isEdit = false;
    $scope.isApply = false;
    $scope.szPzx = [];
    $scope.szJcx = [];
    $scope.beCode = auth.loginUser().beCode;
    var beCode = auth.loginUser().beCode;
    $scope.params = {
        pageNo: 1,
        pageSize: 5
    };

    $scope.gridOptions = {
        paginationPageSizes: [5, 10],
        rowHeight: 40,
        paginationPageSize: $scope.params.pageSize,
        useExternalPagination: true,
        onRegisterApi: function(gridApi) {
            //分页
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                $scope.params.pageNo = newPage;
                $scope.params.pageSize = pageSize;
                $scope.sel();
            });
        },
        columnDefs: [{
            field: 'medTempName',
            displayName: '模板名称',
            cellTooltip: function(row, col) {
                return row.entity.medTempName;
            }
        }, {
            field: 'remark',
            displayName: '描述',
            cellTooltip: function(row, col) {
                return row.entity.remark;
            }
        }, {
            field: 'createName',
            displayName: '创建人',
            cellTooltip: function(row, col) {
                return row.entity.createName;
            },
            width: 100
        }, {
            field: 'createTime',
            displayName: '时间',
            cellTooltip: function(row, col) {
                return row.entity.createTime;
            }
        }, {
            field: 'typeName',
            displayName: '应用级别',
            cellTooltip: function(row, col) {
                return row.entity.typeName;
            },
            width: 100
        }, {
            field: 'id',
            width: 100,
            displayName: '操作',
            cellTemplate: '<div class="ui-grid-cell-contents"><a href="" ng-click=grid.appScope.apply(row)>应用</a>&nbsp;|&nbsp;<a href="" ng-click=grid.appScope.del(row)>删除</a></div>'
        }]
    };

    $scope.sel = function() {
        IHttp.post('basedata/queryAnaesDoctempList', {
            pageNo: $scope.params.pageNo,
            pageSize: $scope.params.pageSize,
            type: vm.lv ? Number(vm.lv) : '',
            createUser: auth.loginUser().userName,
            filters: [{
                field: "medTempName",
                value: vm.tempName ? vm.tempName : ''
            }]
        }).then(function(rs) {
            if (rs.data.resultCode !== '1') return;
            $scope.gridOptions.totalItems = rs.data.total;
            $scope.gridOptions.data = rs.data.resultList;
            $scope.gridOptions.data.forEach(function(item) {
                if (item.type == 1) {
                    item.typeName = '个人';
                } else if (item.type == 2) {
                    item.typeName = '科室';
                }
            });
        });
    }
    $scope.sel();

    $scope.save = function() {
        if (promise) {
            $timeout.cancel(promise);
        }
        promise = $timeout(function() {}, 500);
    }

    $scope.del = function(row) {
        if (auth.loginUser().roleType !== 'ANAES_DIRECTOR' && row.entity.type == 2) {
            toastr.warning("只有麻醉科主任或护士长能删除科室模板");
            return;
        }
        IHttp.post('basedata/delAnaesDoctemp', { id: row.entity.id }).then(function(result) {
            if (result.data.resultCode !== '1') return;
            $scope.sel();
        });
    }

    $scope.apply = function(row) {
        $scope.isApply = true;
        $scope.tabIndex = 0;
        tempJson = row.entity.tempJson;
    }

    $scope.tab = function(i) {
        var jsonObj = JSON.parse(tempJson);
        vm.isEdit = false;
        $scope.tabIndex = i;
    }

    $scope.edit = function(row) {
        vm.isEdit = true;
        if ($scope.tabIndex === 0) {
            $scope.medicine = {
                name: row.name,
                priceId: row.priceId,
                medicineId: row.medicineId
            }
            $scope.mz = angular.copy(row);
            $scope.mz.medTakeWayIdList = $scope.mz.medTakeWayId.split(',');
        } else {
            $scope.ioSelected = {
                ioDefId: row.ioDefId,
                name: row.name,
                priceId: row.priceId,
                blood: row.blood ? 1 : 0
            }
            if (row.type == '1')
                row.type_ = 'sy';
            else
                row.type_ = 'sx';
            $scope.sy = angular.copy(row);
        }
    }

    vm.update = function(entity, type, field) {
        var jsonObj = JSON.parse(tempJson);
        if (type == 'mz') {
            for(var obj of $scope.dcl) {
                var medTakeWayName = '';
                if (obj.medEventId == entity.medEventId) {
                    if (field == 'durable_') {
                        obj[field] = entity[field];
                        if (entity[field])
                            obj.durable = 1;
                        else
                            obj.durable = 0;
                    }
                    obj[field] = entity[field];
                    if (field == 'medTakeWayIdList') {
                        for(var medTakeWayId of entity[field]) {
                            for(var medTakeWay of $scope.medTakeWayList) {
                                if (medTakeWayId == medTakeWay.medTakeWayId) {
                                    medTakeWayName += (medTakeWayName != '' ? ',' : '') + medTakeWay.name;
                                }
                            }
                        }
                        obj.medTakeWayName = medTakeWayName;
                    }
                }
            }
            var mzObjList = jsonObj.mz;
            for(var mzObj of mzObjList) {
                for(var medicalEvent of mzObj.medicalEventList) {
                    if (medicalEvent.medEventId == entity.medEventId) {
                        medicalEvent[field] = entity[field];
                    }
                }
                mzObj[field] = entity[field];
            }
        }else {
            var ytObjList = [];
            if (type == 'sy') {
                ytObjList = jsonObj.sy;
            }else if(type == 'sy') {
                ytObjList = jsonObj.sx;
            }
            for(var obj of $scope.io) {
                if (obj.inEventId == entity.inEventId) {
                    obj[field] = entity[field];
                }
            }
            for(var ytObj of ytObjList) {
                if (ytObj.ioeventList) {
                    for(var ioEvent of ytObj.ioeventList) {
                        if (ioEvent.inEventId == entity.inEventId) {
                            ioEvent[field] = entity[field];
                        }
                    }
                }else {
                    ytObj[field] = entity[field];
                }
                ytObj[field] = entity[field];
            }
        }
        tempJson = JSON.stringify(jsonObj);
    }

    $scope.saveMZ = function() {
        var dcl = angular.copy($scope.dcl);
        dcl.forEach(function(item) {
            item.docId = items.docId;
            if (item.startTime)
                item.startTime = new Date(item.startTime).getTime();
            if (item.endTime)
                item.endTime = new Date(item.endTime).getTime();
            delete item.medEventId;
        });
        IHttp.post('operation/batchSaveMedicalevent', dcl).then(function(rs) {
            if (rs.data.resultCode !== '1') return;
            var fail = (rs.data.fail instanceof Array) && rs.data.fail.length > 0 ? rs.data.fail.toString() + '保存失败 ' : '';
            var success = (rs.data.success instanceof Array) && rs.data.success.length > 0 ? rs.data.success.toString() + '保存成功 ' : '';
            if (fail || success) {
                toastr.info(fail + success);
            }
            if (rs.data.success.length > 0) {
                returnList.push({
                    url: 'searchMedicaleventGroupByCodeList',
                    param: { docId: items.docId, type: 1 },
                    key: 'treatMedEvtList',
                    canve: 'zl'
                },{
                    url: 'searchMedicaleventGroupByCodeList',
                    param: { docId: items.docId, type: 2 },
                    key: 'anaesMedEvtList',
                    canve: 'mz'
                });
                returnList.push({
                    url: 'searchMedicaleventGroupByCodeList',
                    param: { docId: items.docId, type: 1 },
                    key: 'treatMedEvtList',
                    canve: 'szpzx',
                    result: $scope.szPzx
                });
                returnList.push({
                    url: 'searchMedicaleventGroupByCodeList',
                    param: { docId: items.docId, type: 2 },
                    key: 'anaesMedEvtList',
                    canve: 'szjcx',
                    result: $scope.szJcx
                });
                $scope.cancel = function() {
                    tabWatch();
                    durWatch();
                    $uibModalInstance.close(returnList);
                }
            }
        });
    }

    $scope.saveSY = function() {
        var io = angular.copy($scope.io);
        io.forEach(function(item) {
            item.docId = items.docId;
            if (item.startTime)
                item.startTime = new Date(item.startTime).getTime();
            if (item.endTime)
                item.endTime = new Date(item.endTime).getTime();
            delete item.ioeventId;
            delete item.inEventId;
        });
        IHttp.post('operation/batchSaveIoevent', io).then(function(rs) {
            if (rs.data.resultCode !== '1') return;
            var fail = (rs.data.fail instanceof Array) && rs.data.fail.length > 0 ? rs.data.fail.toString() + '保存失败 ' : '';
            var success = (rs.data.success instanceof Array) && rs.data.success.length > 0 ? rs.data.success.toString() + '保存成功 ' : '';
            if (fail || success) {
                toastr.info(fail + success);
            }
            if (rs.data.success.length > 0) {
                returnList.push({
                    url: 'searchIoeventGroupByDefIdList',
                    param: { docId: items.docId, type: "I", subType: beCode == 'syzxyy' || beCode == 'cshtyy'|| beCode == 'llzyyy' || beCode == 'qnzzyyy' || beCode=='yxyy'? '' : 1 },
                    key: beCode == 'syzxyy' || beCode == 'cshtyy'|| beCode == 'llzyyy' || beCode == 'qnzzyyy' || beCode=='yxyy'? 'inIoeventList' : 'transfusioninIoeventList',
                    canve: 'sy'
                }, {
                    url: 'searchIoeventGroupByDefIdList',
                    param: { docId: items.docId, type: "I", subType: beCode == 'syzxyy' || beCode == 'cshtyy'|| beCode == 'llzyyy' || beCode == 'qnzzyyy' || beCode=='yxyy' ? '' : 2 },
                    key: 'bloodinIoeventList',
                    canve: 'sx'
                });
                $scope.cancel = function() {
                    tabWatch();
                    durWatch();
                    $uibModalInstance.close(returnList);
                }
            }
        });
    }

    $scope.delete = function(index, key) {
        $scope[key].splice(index, 1);
    }

    var tabWatch = $scope.$watch('tabIndex', function(val) {
        if (!tempJson) return;
        try {
            var jsonObj = JSON.parse(tempJson);
            if (beCode == 'sybx') {
                savePzx(jsonObj.szpzx);
                saveJcx(jsonObj.szjcx);
            }
        } catch (e) {
            return;
        }
        var obj, res = [], dcl = [], io = [];
        for (a in jsonObj) {
            obj = jsonObj[a];
            if(!obj) continue;
            res = newList(obj, a);
            if(a == 'mz' || a == 'zl')
                dcl = dcl.concat(res);
            else
                io = io.concat(res);
        }
        for(var obj of dcl) {
            if (obj.durable == 1)
                obj.durable_ = true;
            else
                obj.durable_ = false;
        }
        $scope.dcl = dcl;
        $scope.io = io;
    });

    var durWatch = $scope.$watch('mz.durable_', function(val) {
        if (val !== undefined && val === true) {
            $scope.mz.durable = 1;
            $scope.mz.endTime = $scope.mz.endTime ? $scope.mz.endTime : $filter('date')(new Date($scope.mz.startTime).getTime() + 1800000, 'yyyy-MM-dd HH:mm');
        } else {
            if(!$scope.mz)
                $scope.mz = {};
            $scope.mz.durable = 0;
            $scope.mz.showOption = '3';
        }
    });

    function savePzx(list){
        for(var item of list) {
            item.regOptId = $rootScope.$stateParams.regOptId;
            item.isCheck = true;
        }
        $scope.szPzx = list;
        IHttp.post('operCtl/updMonitorConfig', {checkList:list,regOptId:$rootScope.$stateParams.regOptId}).then(function(rs) {
            if (rs.data.resultCode !== '1') return;
        });
    }

    function saveJcx(list){
        for(var item of list) {
            item.regOptId = $rootScope.$stateParams.regOptId;
            item.checked = true;
        }
        $scope.szJcx = list;
        IHttp.post('basedata/saveAnaesMonitorConfig', list).then(function(rs) {
            if (rs.data.resultCode !== '1') return;
        });
    }
    function newList(list, state) {
        var res = [], arr = [], type,
            nowDate = new Date().getTime(),
            interval = 0, startTime = 0, endTime = 0;
        list.forEach(function(item) {
            if(state == 'mz' || state == 'zl') {
                arr = item.medicalEventList;
                if (beCode == 'hbgzb') {
                    type = 1;
                }else {
                    type = state == 'zl' ? 1 : 2;
                }
            } else if(state == 'sy' || state == 'sx') {
                if (item.ioeventList) {
                    arr = item.ioeventList;
                }else {
                    arr.push(item);
                }
                type = state == 'sy' ? 1 : 2;
            } else
                arr = item.egressList;
            arr && arr.forEach(function(row){
                row.type = type;
                startTime = new Date(row.startTime).getTime();
                row.startTime = $filter('date')(nowDate, 'yyyy-MM-dd HH:mm');
                if ((beCode === 'qnzzyyy' || beCode === 'syzxyy' || beCode == 'cshtyy') && (state !== 'mz' && state !== 'zl')) {
                    row.endTime = '';
                } else {
                    if (row.endTime) {
                        endTime = new Date(row.endTime).getTime();
                        interval = startTime - endTime;
                        row.endTime = $filter('date')(new Date(nowDate).getTime() + 1800000, 'yyyy-MM-dd HH:mm');
                    }
                }
                res.push(row);
            })
            arr = [];
        });
        return res;
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

    $scope.cancel = function() {
        tabWatch();
        durWatch();
        $uibModalInstance.dismiss();
    }

    $scope.back = function() {
        $scope.isApply = false;
        $scope.tabIndex = -1;
    }
}