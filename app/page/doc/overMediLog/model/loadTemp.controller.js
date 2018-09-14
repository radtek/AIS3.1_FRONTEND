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

    $scope.sel = function() { //查询所有模板
        IHttp.post('basedata/queryAnaesDoctempList', {
            pageNo: $scope.params.pageNo,
            pageSize: $scope.params.pageSize,
            type: vm.lv ? Number(vm.lv) : '',
            docType: 6,
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

    $scope.save = function(e) {
        if (promise) {
            $timeout.cancel(promise);
        }
        promise = $timeout(function() {
            switch(e+1){
                case 1:
                var arr = [].concat($scope.arr1);
                break;case 2:
                var arr = [].concat($scope.arr2);
                break;case 3:
                var arr = [].concat($scope.arr3);
                break;case 4:
                var arr = [].concat($scope.arr4);
                break;
            }
            for (let i = 0; i < arr.length; i++) {
                arr[i].time = new Date(arr[i].time).valueOf();
            }
            var params = {
                "docInsuredItemList": arr,
                "docInsuredPatAgree": items.insuredPatAgree
            }
            IHttp.post('document/batchSaveInsuredPatAgreeItem', params).then(function(rs) {
                if (rs.data.resultCode !== '1') return;
                for (let i = 0; i < arr.length; i++) {
                    arr[i].time = $filter('date')(arr[i].time, 'yyyy-MM-dd HH:mm');
                }
            });
        }, 500);
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

    $scope.apply = function(row) { //点击应用
        $scope.isApply = true;
        $scope.tabIndex = 0;
        tempJson = JSON.stringify(JSON.parse(row.entity.tempJson).insuredItemList);
    }

    $scope.tab = function(i) {
        var jsonObj = JSON.parse(tempJson);
        vm.isEdit = false;
        $scope.tabIndex = i;
    }

    $scope.edit = function(row) {
        vm.isEdit = true;
        $scope.medicine = {
            name: row.name,
            id: row.id,
            priceId: row.priceId,
            medicineId: row.medicineId
        }
        $scope.mz = angular.copy(row);
    }

    vm.update = function(entity, type, field) {
        var jsonObj = JSON.parse(tempJson);
        for (let i = 0; i < jsonObj.length; i++) {
            if (jsonObj[i].id == $scope.medicine.id) {
                jsonObj[i] = $scope.mz;
            }
        }

        tempJson = JSON.stringify(jsonObj);
        tabinit(tempJson)
    }
    $scope.delete = function(index, arr) {
        arr.splice(index, 1);
         var jsonObj = JSON.parse(tempJson);
        for (let i = 0; i < jsonObj.length; i++) {
            if (jsonObj[i].id == $scope.medicine.id) {
                jsonObj[i] = $scope.mz;
            }
        }

        tempJson = JSON.stringify(jsonObj);
        tabinit(tempJson)
    }

    var tabWatch = $scope.$watch('tabIndex', function(val) {
        tabinit(tempJson)
    });

    function tabinit(tempJson) {
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
        var obj, res = [],
            dcl = [],
            io = [],
            arr1 = [],
            arr2 = [],
            arr3 = [],
            arr4 = [];
        for (a in jsonObj) {
            obj = jsonObj[a];
            if (!obj) continue;
            res = newList(obj, a);
            if (obj.durable == 1)
                obj.durable_ = true;
            else
                obj.durable_ = false;
            obj.time = $filter('date')(obj.time, 'yyyy-MM-dd HH:mm');
            switch (obj.type) {
                case 1:
                    arr1.push(obj);
                    break;
                case 2:
                    arr2.push(obj);
                    break;
                case 3:
                    arr3.push(obj);
                    break;
                case 4:
                    arr4.push(obj);
                    break;
            }
        }
        $scope.arr1 = arr1;
        $scope.arr2 = arr2;
        $scope.arr3 = arr3;
        $scope.arr4 = arr4;
        // $scope.io = io;
    }
    var durWatch = $scope.$watch('mz.durable_', function(val) {
        if (val !== undefined && val === true) {
            $scope.mz.durable = 1;
            $scope.mz.endTime = $scope.mz.endTime ? $scope.mz.endTime : $filter('date')(new Date($scope.mz.startTime).getTime() + 1800000, 'yyyy-MM-dd HH:mm');
        } else {
            if (!$scope.mz)
                $scope.mz = {};
            $scope.mz.durable = 0;
            $scope.mz.showOption = '3';
        }
    });

    function savePzx(list) {
        // for(var item of list) {
        //     item.regOptId = $rootScope.$stateParams.regOptId;
        //     item.isCheck = true;
        // }
        // $scope.szPzx = list;
        // IHttp.post('operCtl/updMonitorConfig', {checkList:list,regOptId:$rootScope.$stateParams.regOptId}).then(function(rs) {
        //     if (rs.data.resultCode !== '1') return;
        // });
    }

    function saveJcx(list) {
        // for(var item of list) {
        //     item.regOptId = $rootScope.$stateParams.regOptId;
        //     item.checked = true;
        // }
        // $scope.szJcx = list;
        // IHttp.post('basedata/saveAnaesMonitorConfig', list).then(function(rs) {
        //     if (rs.data.resultCode !== '1') return;
        // });
    }

    function newList(list, state) {
        var res = [],
            arr = [],
            type,
            nowDate = new Date().getTime(),
            interval = 0,
            startTime = 0,
            endTime = 0;
        // list.forEach(function(item) {
        //     if(state == 'mz' || state == 'zl') {
        //         arr = item.medicalEventList;
        //         if (beCode == 'hbgzb') {
        //             type = 1;
        //         }else {
        //             type = state == 'zl' ? 1 : 2;
        //         }
        //     } else if(state == 'sy' || state == 'sx') {
        //         if (item.ioeventList) {
        //             arr = item.ioeventList;
        //         }else {
        //             arr.push(item);
        //         }
        //         type = state == 'sy' ? 1 : 2;
        //     } else
        //         arr = item.egressList;
        //     arr && arr.forEach(function(row){
        //         row.type = type;
        //         startTime = new Date(row.startTime).getTime();
        //         row.startTime = $filter('date')(nowDate, 'yyyy-MM-dd HH:mm');
        //         if ((beCode === 'qnzzyyy' || beCode === 'syzxyy' || beCode == 'cshtyy') && (state !== 'mz' && state !== 'zl')) {
        //             row.endTime = '';
        //         } else {
        //             if (row.endTime) {
        //                 endTime = new Date(row.endTime).getTime();
        //                 interval = startTime - endTime;
        //                 row.endTime = $filter('date')(new Date(nowDate).getTime() + 1800000, 'yyyy-MM-dd HH:mm');
        //             }
        //         }
        //         res.push(row);
        //     })
        //     arr = [];
        // });
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
        // durWatch();
        $uibModalInstance.dismiss();
    }

    $scope.back = function() {
        $scope.isApply = false;
        $scope.tabIndex = -1;
    }
}