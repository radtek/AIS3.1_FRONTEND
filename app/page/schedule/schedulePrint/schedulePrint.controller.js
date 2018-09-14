SchedulePrintCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'uiGridConstants', '$uibModal', '$timeout', 'toastr', 'auth', '$filter', 'uiGridServe', 'select', 'baseConfig'];

module.exports = SchedulePrintCtrl;

function SchedulePrintCtrl($rootScope, $scope, IHttp, uiGridConstants, $uibModal, $timeout, toastr, auth, $filter, uiGridServe, select, baseConfig) {
    var promise;
    var beCode = auth.loginUser().beCode,
        basCfg = baseConfig.getSurgSchedule();;
    $scope.docInfo = auth.loginUser();
    $scope.isNurse = $scope.docInfo.roleType === 'HEAD_NURSE' ? true : false; //是否护士长;
    $scope.isAnaes = $scope.docInfo.roleType === 'ANAES_DIRECTOR' ? true : false; //是否麻醉科主任;
    $scope.docUrl = auth.loginUser().titlePath;
    $scope.operDate = $filter('date')(new Date(), 'yyyy-MM-dd');
    $scope.queryObj.operDate = $scope.operDate;
    var tempHtml = '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.cancelItem(row.entity, 1)">取消排班</a></div>';
    // 相同手術間的记录，排了一个麻醉医生后其他的默认同步选上;
    var dispatchList = [], // 记录被修改过的数据
        sourceData,
        tempData;
    select.dept().then((rs) => {
        if (rs.data.resultCode != 1)
            return;
        $scope.dept = rs.data.resultList;
    });
    //手术室列表
    select.operroom().then((rs) => {
            if (rs.data.resultCode != 1)
                return;
            $scope.operroom = rs.data.resultList;
            var colDefs = $scope.gridOptions.columnDefs;
            var col;
            for (var i=0; i<colDefs.length; i++) {
                col = colDefs[i];
                if (col.field == 'operRoomId') {
                    col.editDropdownOptionsArray = rs.data.resultList;
                }
            }
        })
        // 手术台次
    select.sysCodeBy('pacType').then((rs) => {
        if (rs.data.resultCode != 1)
            return;
        $scope.pacList = rs.data.resultList;
        var colDefs = $scope.gridOptions.columnDefs;
        var col;
        for (var i=0; i<colDefs.length; i++) {
            col = colDefs[i];
            if (col.field == 'pcs') {
                col.editDropdownOptionsArray = rs.data.resultList;
            }
        }
    })

    select.getNurses().then((rs) => {
        if (rs.data.resultCode != 1)
            return;
        $scope.nurseList = rs.data.userItem;
    });

    select.getOptBody().then((rs) => {
        if (rs.data.resultCode != 1)
            return;
        $scope.optBodyList = rs.data.resultList;
    })
    select.getNurses().then((rs) => { //护士
        if (rs.data.resultCode != 1)
            return;
        $scope.nurseList = rs.data.userItem;
        var colDefs = $scope.gridOptions.columnDefs;
        var col;
        for (var i=0; i<colDefs.length; i++) {
            col = colDefs[i];
            if (col.field == 'circunurseId1')
                col.editDropdownOptionsArray = rs.data.userItem;
             if (col.field == 'circunurseId2')
                col.editDropdownOptionsArray = rs.data.userItem;
             if (col.field == 'instrnurseId1')
                col.editDropdownOptionsArray = rs.data.userItem;
             if (col.field == 'instrnurseId2')
                col.editDropdownOptionsArray = rs.data.userItem;
        }
    })
    select.getAnaesthetists().then((rs) => {
        if (rs.data.resultCode != 1)
            return;
        $scope.anaesthetistList = rs.data.userItem;
        var colDefs = $scope.gridOptions.columnDefs;
        var col;
        for (var i=0; i<colDefs.length; i++) {
            col = colDefs[i];
            if (col.field == 'anesthetistId')
                col.editDropdownOptionsArray = rs.data.userItem;
            if (col.field == 'circuAnesthetistId')
                col.editDropdownOptionsArray = rs.data.userItem;
        }
    })
    $scope.gridOptions = uiGridServe.option({
        enableFiltering: false,
        paginationState: 0,
        columnDefs: [{
            field: 'operRoomName',
            name: '手术室',
            width: 100
        }, {
            field: 'pcs',
            name: '台次',
            width: 60
        }, {
            field: 'deptName',
            name: '科室',
            cellTooltip: function(row, col) {
                return row.entity.deptName;
            },
            minWidth: 100
        }, {
            field: $scope.docInfo.beCode === 'sybx'?'hid':'bed',
            name: $scope.docInfo.beCode === 'sybx'?'住院号':'床号',
            width: 70
        }, {
            field: 'sex',
            name: '性别',
            width: 55
        }, {
            field: 'age',
            name: '年龄',
            width: 55
        }, {
            field: 'regOptName',
            name: '姓名',
            width: 90
        }, {
            field: 'designedOptName',
            name: '手术名称',
            cellTooltip: function(row, col) {
                return row.entity.designedOptName;
            },
            minWidth: 100
        }, {
            field: 'operatorName',
            name: '手术医生',
            width: 100
        }, {
            field: 'designedAnaesMethodName',
            name: '麻醉方法',
            minWidth: 150,
            cellTooltip: function(row, col) {
                return row.entity.designedAnaesMethodName;
            }
        }, {
            field: 'anesthetistName',
            name: '麻醉医生',
            width: 100
        }, {
            field: 'circunurseName1',
            name: '巡回护士',
            width: 100,
            visible: (($scope.docInfo.beCode === 'syzxyy' || $scope.docInfo.beCode == 'cshtyy') && ($scope.docInfo.roleType === 'ANAES_DIRECTOR' || $scope.docInfo.roleType === 'ANAES_DOCTOR')) ? false : true
        },{
            field: 'circunurseName2',
            name: '巡回护士2',
            width: 100,
            visible: false
        }, {
            field: 'instrnurseName1',
            name: '洗手护士',
            width: 100,
            visible: (($scope.docInfo.beCode === 'syzxyy' || $scope.docInfo.beCode == 'cshtyy') && ($scope.docInfo.roleType === 'ANAES_DIRECTOR' || $scope.docInfo.roleType === 'ANAES_DOCTOR')) ? false : true
        }, {
            field: 'instrnurseName2',
            name: '洗手护士2',
            width: 100,
            visible: false
        }, {
            field: 'optLevel',
            name: '手术等级',
            width: 100,
            visible: ($scope.docInfo.beCode === 'sybx'?true:false)
        }, {
            field: 'cutLevelName',
            name: '切口等级',
            width: 100,
            visible:($scope.docInfo.beCode === 'sybx'?true:false)
        }, {
            name: '操作',
            enableSorting: false,
            enableFiltering: false,
            cellTemplate: tempHtml,
            width: 90,
            visible: beCode !== 'syzxyy' && beCode != 'cshtyy'
        }],
          rowTemplate: '<div ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell ng-dblclick="grid.appScope.test()"></div>'
    });

    $scope.gridExporterOptions = {
        enableFiltering: false, //  表格过滤栏
        enableGridMenu: true, //表格配置按钮
        paginationPageSizes: [ 15, 30, 50],
        rowHeight: 40,
        // paginationPageSize: 15,
        useExternalFiltering: false, // 过滤的搜索
        useExternalPagination: false, // 分页
        useExternalSorting: true,
        exporterOlderExcelCompatibility: true,
        exporterCsvFilename: '手术排班.csv',
        onRegisterApi: function(gridApi) {
            $scope.gridExporterApi = gridApi;
        },
        columnDefs: [{
            field: 'operRoomName',
            name: '手术室',
            width: 100
        }, {
            field: 'pcs',
            name: '台次',
            width: 60
        }, {
            field: 'deptName',
            name: '科室',
            cellTooltip: function(row, col) {
                return row.entity.deptName;
            },
            minWidth: 100
        }, {
            field: 'bed',
            name: '床号',
            width: 70
        }, {
            field: 'sex',
            name: '性别',
            width: 55
        }, {
            field: 'age',
            name: '年龄',
            width: 55
        }, {
            field: 'regOptName',
            name: '姓名',
            width: 90
        }, {
            field: 'designedOptName',
            name: '手术名称',
            cellTooltip: function(row, col) {
                return row.entity.designedOptName;
            },
            minWidth: 100
        }, {
            field: 'operatorName',
            name: '手术医生',
            width: 100
        }, {
            field: 'designedAnaesMethodName',
            name: '麻醉方法',
            minWidth: 150,
            cellTooltip: function(row, col) {
                return row.entity.designedAnaesMethodName;
            }
        }, {
            field: 'anesthetistName',
            name: '麻醉医生',
            width: 100
        }, {
            field: 'circunurseName1',
            name: '巡回护士',
            width: 100
        }, {
            field: 'instrnurseName1',
            name: '洗手护士',
            width: 100
        }]
    };
    $scope.test=function(){
       
    }

    // 取消手术
    $scope.cancelItem = function(item, type) {
        var scope = $rootScope.$new();
        scope.data = { items: item };
        scope.tit = '取消';
        if (beCode === 'nhfe') {
            $uibModal.open({
                animation: true,
                template: require('../modal/cancelConfirm/cancelConfirm.html'),
                controller: require('../modal/cancelConfirm/cancelConfirm.controller'),
                controllerAs: 'vm',
                backdrop: 'static',
                scope: scope
            }).result.then((rs) => {
                if (rs === 'success') {
                    $scope.$emit('childRefresh');
                }
            });
        } else {
            $uibModal.open({
                animation: true,
                template: require('../../oper/modal/modal.html'),
                controller: require('../../oper/modal/modal.controller'),
                controllerAs: 'vm',
                backdrop: 'static',
                scope: scope
            }).result.then((rs) => {
                if (rs === 'success') {
                    toastr.success('取消手术成功!');
                    $scope.$emit('childRefresh');
                }
            });
        }
    }
    
    $scope.blurFn = function(row, col, flag) {
        var isSameDoct = baseConfig.getSurgSchedule().isSameDoct;
        var isSameNurs = baseConfig.getSurgSchedule().isSameNurs;
        var operRoomId = row.operRoomId;
        if (!(isSameDoct || isSameNurs)) {
            return;
        }
        // 配置麻醉医生同日默认安排相同 &&col.field==='anesthetistId'
        if (isSameDoct == 1 && flag == 'isSameDoct') {
            var fieldList = ['anesthetistId', 'circuAnesthetistId'];

        } else if (isSameNurs == 1 && flag == "isSameNurs") { //配置护士给麻醉医生同日默认安排相同
            var fieldList = ['circunurseId1','circunurseId2', 'instrnurseId1', 'instrnurseId2'];
        } else {
            return;
        }
        angular.forEach($scope.gridOptions.data, function(v, k) {
            if (v != row) {
                var flag = false;
                if (!v[col.field] && v.operRoomId == operRoomId) {
                    angular.forEach(fieldList, function(value, key) {
                        var groupItem = v[value];
                        var rowValut = row[col.field];
                        var colName = col.field;
                        if (groupItem === rowValut) {
                            flag = true;
                        }
                    })
                    if (!flag&&v.state!='04'&&v.state!='05'&&v.state!='06'&&v.state!='07') {//排除术中等状态
                        v[col.field] = row[col.field];   
                    }
                }
            }

        })

    }

    $scope.focus = function(row, col) {
        let nurseFields = [
            'instrnurseId1', //洗手护士
            'instrnurseId2',
            'circunurseId1', //巡回护士
            'circunurseId2'
        ]
        let doctorFields = [
            'anesthetistId',
            'circuAnesthetistId'
        ];
        let selectedList = [];
        if ($scope.isNurse) {
            var FieldsArr = nurseFields; //筛选列
            var listArr = $scope.nurseList; //护士列表
            //护士长选手术室、台次
            if (col.field == 'pcs') {
                var FieldsArr = ['pcs']; //筛选列
                var listArr = $scope.pacList; //护士列表
            }
            if (col.field == 'operRoomId') {
                var FieldsArr = ['operRoomId']; //筛选列
                var listArr = $scope.operroom; //手术室列表
            }
        }
        if ($scope.isAnaes) {
            var FieldsArr = doctorFields; //筛选列
            var listArr = $scope.anaesthetistList; //麻醉医生
        }
        col.colDef.editDropdownOptionsArray = [];
        var item;
        for (var i=0; i<FieldsArr.length; i++) {
            item = FieldsArr[i];
            if (item !== col.field && row[item]) {
                selectedList.push(row[item]);
            }
        }
        // console.log($scope.itemList);
        col.colDef.editDropdownOptionsArray = listArr.filter((item) => {
            let i = 0;
            for (; i < selectedList.length; i++) {
                if (item.userName === selectedList[i]) {
                    break;
                }
            }
            return i === selectedList.length;
        });
    }

    function translateInit() {
        if ($scope.isNurse) {
            angular.forEach($scope.gridOptions.columnDefs, function(item, key) {
                if (item.field == 'circunurseName1') {
                    $scope.gridOptions.columnDefs[key] = {
                        field: 'circunurseId1',
                        name: '巡回护士1',
                        cellClass: 'nurse-circunurseId1',
                        cellTemplate: require('../nursingSchedule/pinYinFilter1.html'),
                        cellTooltip: function(row, col) {
                            return row.entity.circunurseId1;
                        },
                        editDropdownOptionsArray_circunurseId1: [],
                        enableCellEdit: true,
                        width: 105
                    };
                }
                if (item.field == 'circunurseName2') {
                    $scope.gridOptions.columnDefs[key] = {
                        field: 'circunurseId2',
                        name: '巡回护士2',
                        cellClass: 'nurse-circunurseId1',
                        cellTemplate: require('../nursingSchedule/pinYinFilter2.html'),
                        cellTooltip: function(row, col) {
                            return row.entity.circunurseId1;
                        },
                        editDropdownOptionsArray_circunurseId2: [],
                        enableCellEdit: true,
                        width: 105
                    };
                }
                if (item.field == 'instrnurseName1') {
                    $scope.gridOptions.columnDefs[key] = {
                        field: 'instrnurseId1',
                        name: '洗手护士1',
                        cellClass: 'nurse-circunurseId1',
                        cellTemplate: require('../nursingSchedule/pinYinFilter3.html'),
                        cellTooltip: function(row, col) {
                            return row.entity.circunurseId1;
                        },
                        editDropdownOptionsArray_instrnurseId1: [],
                        enableCellEdit: true,
                        width: 105
                    };
                }
                if (item.field == 'instrnurseName2') {
                    $scope.gridOptions.columnDefs[key] = {
                        field: 'instrnurseId2',
                        name: '洗手护士2',
                        cellClass: 'nurse-circunurseId1',
                        cellTemplate: require('../nursingSchedule/pinYinFilter4.html'),
                        cellTooltip: function(row, col) {
                            return row.entity.circunurseId1;
                        },
                        editDropdownOptionsArray_circunurseId1: [],
                        enableCellEdit: true,
                        width: 105
                    };
                }
                if (item.field == 'pcs') {
                    $scope.gridOptions.columnDefs[key] = {
                        field: 'pcs',
                        name: '台次',
                        cellClass: 'nurse-circunurseId1',
                        cellTemplate: require('../nursingSchedule/pinYinFilter5.html'),
                        cellTooltip: function(row, col) {
                            return row.entity.pcs;
                        },
                        editDropdownOptionsArray_pcs: [],
                        enableCellEdit: true,
                        width: 80
                    };
                }
                if (item.field == 'operRoomName') {
                    $scope.gridOptions.columnDefs[key] = {
                        field: 'operRoomId',
                        name: '手术室',
                        cellClass: 'nurse-circunurseId1',
                        cellTemplate: require('../nursingSchedule/pinYinFilter6.html'),
                        cellTooltip: function(row, col) {
                            return row.entity.operRoomName;
                        },
                        editDropdownOptionsArray_operRoomId: [],
                        enableCellEdit: true,
                        width: 130
                    };
                }


            })

        } else if ($scope.isAnaes) {
            angular.forEach($scope.gridOptions.columnDefs, function(item, key) {
                if (item.field == 'anesthetistName') {
                    $scope.gridOptions.columnDefs[key] = {
                        field: 'anesthetistId',
                        name: '麻醉医生',
                        cellClass: 'anaesthetist-anesthetistId',
                        cellTemplate: require('../anaesthesiaSchedule/pinYinFilter1.html'),
                        cellTooltip: function(row, col) {
                            return row.entity.anesthetistId;
                        },
                        editDropdownOptionsArray_anesthetistId: [],
                        enableCellEdit: true,
                        width: 105
                    };
                }
                if (item.field == 'circuanesthetistName') {
                    $scope.gridOptions.columnDefs[key] = {
                        field: 'circuAnesthetistId',
                        name: '副麻医生',
                        cellClass: 'anaesthetist-anesthetistId',
                        cellTemplate: require('../anaesthesiaSchedule/pinYinFilter2.html'),
                        cellTooltip: function(row, col) {
                            return row.entity.circuAnesthetistId;
                        },
                        editDropdownOptionsArray_anesthetistId: [],
                        enableCellEdit: true,
                        width: 105
                    };
                }
            })

        }
    }
    translateInit();
    $scope.$on('query', (event, params) => {
        IHttp.post('basedata/printDispatchItem', params).then((rs) => {
            if (rs.data.resultCode != 1)
                return;
            $scope.gridOptions.data = rs.data.resultList;
            $scope.gridExporterOptions.data = rs.data.resultList;
        });
    })
    $scope.$on('print', () => {
        $scope.$emit('doc-print');
    })

    $scope.$on('export', () => {
        console.log($scope.gridExporterOptions);
        $scope.gridExporterApi.exporter.csvExport('all','all');//导出所有的行和列
    })
    $scope.$on('save', (event) => {
        var dispatchList = [];
        if ($scope.isNurse) {
            for (var a=0; a<$scope.gridOptions.data.length; a++) {
                var item = $scope.gridOptions.data[a - 0];
                if (item.isLocalAnaes == '1')
                    item.isHold = '0';
                if (item.circunurseId1 && !(item.state == '04' || item.state == '05' || item.state == '06' || item.state == '07'))
                    dispatchList.push(item);
            }
            if (dispatchList.length <= 0) {
                toastr.warning('修改数据不完整');
                return;
            }
        }
        if ($scope.isAnaes) {
            for (var a=0; a<$scope.gridOptions.data.length; a++) {
                var item = $scope.gridOptions.data[a - 0];
                item.isHold = '0';
                if (!item.pcs)
                    item.pcs = undefined;
                if (item.anesthetistId && !(item.state == '04' || item.state == '05' || item.state == '06' || item.state == '07'))
                    dispatchList.push(item);
            }
            if (dispatchList.length <= 0) {
                toastr.warning('修改数据不完整');
                return;
            }
        }

        // else{
        //     toastr.info("您不能编辑内容");
        // }

        IHttp.post('basedata/dispatchOperation', {
            dispatchList: dispatchList,
            roleType: auth.loginUser().roleType
        }).then((rs) => {
            $scope.$emit('childRefresh');
            if (rs.data.resultCode != 1)
                return;
            toastr.info(rs.data.resultMessage);
        });
    })
    $scope.$emit('childInited');
}
