AnaesthesiaScheduleCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$timeout', 'toastr', 'select', 'auth', '$uibModal', 'uiGridConstants', 'uiGridServe', 'confirm', 'baseConfig'];

module.exports = AnaesthesiaScheduleCtrl;

function AnaesthesiaScheduleCtrl($rootScope, $scope, IHttp, $timeout, toastr, select, auth, $uibModal, uiGridConstants, uiGridServe, confirm, baseConfig) {
    var beCode = auth.loginUser().beCode,
        tempHtml = '<div class="ui-grid-cell-contents"><a ng-if="grid.appScope.RECALL" ng-click=grid.appScope.revokeItem(row.entity,1)>撤回</a><span ng-if="grid.appScope.RECALL">&nbsp;|&nbsp;</span><a ng-click=grid.appScope.cancelItem(row.entity,2)>取消</a></div>',
        basCfg = baseConfig.getSurgSchedule();

    $scope.RECALL = $rootScope.permission.indexOf('RECALL') > 0;
    // if (beCode == 'qnzrmyy') {
    //     if (auth.loginUser().roleType == 'ANAES_DIRECTOR')
    //         $scope.back = true;
    // }

    select.dept().then((rs) => {
            if (rs.data.resultCode != 1)
                return;
            $scope.dept = rs.data.resultList;
        })
        // 手术台次
    select.sysCodeBy('pacType').then((rs) => {
        if (rs.data.resultCode != 1)
            return;
        $scope.pacList = rs.data.resultList;
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

    select.getAnaesthetists().then((rs) => {
        if (rs.data.resultCode != 1)
            return;
        $scope.anaesthetistList = rs.data.userItem;

        var colDefs = $scope.gridOptions.columnDefs;
        var col;
        for (var i=0; i<colDefs.length; i++) {
            col = colDefs[i];
            if (col.field == 'anesthetistId' || col.field == 'circuAnesthetistId')
                col.editDropdownOptionsArray = rs.data.userItem;
        }
    })

    $scope.gridOptions = uiGridServe.option({
        enableFiltering: false,
        paginationState: 2,
        paginationPageSizes: [15],
        columnDefs: [{
            field: 'operateNumber',
            name: '手术申请序号',
            width: 110,
            cellTooltip: function(row, col) {
                return row.entity.operateNumber;
            },
            visible: beCode == 'sybx' ? true : false
        }, {
            field: 'operRoomName',
            name: '手术室',
            width: 100
        }, {
            field: 'pcs',
            name: '台次',
            width: 60
        }, {
            field: 'operaDate',
            name: '手术日期',
            width: 100
        }, {
            field: 'startTime',
            name: '时间',
            width: 70
        }, {
            field: 'emergencyName',
            name: '类型',
            width: 70
        }, {
            field: 'deptName',
            name: '科室',
            cellTooltip: function(row, col) {
                return row.entity.deptName;
            },
            minWidth: 160
        }, {
            field: 'bed',
            name: '床号',
            width: 100
        }, {
            field: 'sex',
            name: '性别',
            width: 55
        }, {
            field: 'age',
            name: '年龄',
            width: 55
        }, {
            field: 'name',
            name: '姓名',
            width: 90
        }, {
            field: 'designedOptName',
            name: '拟施手术',
            cellTooltip: function(row, col) {
                return row.entity.designedOptName;
            },
            minWidth: 200
        }, {
            field: 'operatorName',
            name: '手术医生',
            width: 110
        }, {
            field: 'designedAnaesMethodName',
            name: '麻醉方法',
            cellTooltip: function(row, col) {
                return row.entity.designedAnaesMethodName;
            },
            minWidth: 150
        }, {
            field: 'anesthetistId',
            name: '麻醉医生',
            cellClass: 'anaesthetist-anesthetistId',
            cellTemplate: require('./pinYinFilter1.html'),
            editDropdownOptionsArray: [],
            width: 100
        }, {
            field: beCode=='sybx'?'perfusionDoctorIdList':'circuAnesthetistId',
            name:beCode=='sybx'?'巡台医生':'副麻医生' ,
            cellClass: 'anaesthetist-circuanesthetistId',
            cellTemplate: beCode=='sybx'?require('./pinYinFilter3.html'):require('./pinYinFilter2.html'),
            editDropdownOptionsArray: [],
            width: beCode == 'sybx' ? 300 : 100
        }, {
            name: '操作',
            enableSorting: false,
            enableFiltering: false,
            cellTemplate: tempHtml,
            width: 90
        }]
    });


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
                var fieldList = ['circunurseId1', 'instrnurseId1', 'instrnurseId2'];
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
                        if (!flag) {
                            v[col.field] = row[col.field];
                        }
                    }
                }

            })
            // $scope.changeAnaes(row,col);

        }
        //需要排重的下拉选项字段
    let doctorFields = [
        'anesthetistId',
        'circuAnesthetistId'
    ];
    $scope.focus = function(row, col) {
        let selectedList = [];
        let doctor;
        for (var i=0; i<doctorFields.length; i++) {
            doctor = doctorFields[i];
            if (doctor !== col.field && row[doctor]) {
                selectedList.push(row[doctor]);
            }
        }

        col.colDef.editDropdownOptionsArray = $scope.anaesthetistList.filter((doctor) => {
            let i;
            for (i = 0; i < selectedList.length; i++) {
                if (doctor.userName === selectedList[i]) {
                    break;
                }
            }
            return i === selectedList.length;
        });
    }

    // 相同手術間的记录，排了一个麻醉医生后其他的默认同步选上;
    var dispatchList = [], // 记录被修改过的数据
        sourceData,
        tempData;
    // $scope.changeAnaes = function(row, col) {
    //     var tempData = $scope.gridOptions.data;
    //     dispatchList = []
    //     for (var a = 0; a < tempData.length; a++) {
    //         if (tempData[a].operRoomId == row.operRoomId && basCfg.isSameDoct == 1) {
    //             tempData[a].anesthetistId = row.anesthetistId;
    //             tempData[a].circuAnesthetistId = row.circuAnesthetistId;
    //         }
    //         if (!angular.equals(tempData[a], sourceData[a]))
    //             dispatchList.push(tempData[a]);
    //     }
    // }

    $scope.$on('query', (event, params) => {
        params.type = 2;
        params.dispStep = 3;
        IHttp.post('basedata/searchNoEndListSchedule', params).then((rs) => {
            if (rs.data.resultCode != 1)
                return;
            var rsList = rs.data.resultList;
            $scope.gridOptions.data = rsList;
            sourceData = angular.copy(rsList);
        });
    })

    $scope.$on('save', (event) => {
        var dispatchList = [];
        for (var a=0; a<$scope.gridOptions.data.length; a++) {
            var item = $scope.gridOptions.data[a - 0];
            item.isHold = '0';
            if (!item.pcs)
                item.pcs = undefined;
            if (item.anesthetistId)
                dispatchList.push(item);
        }

        if (dispatchList.length <= 0) {
            toastr.warning('患者未安排麻醉医生');
            return;
        }
        if (beCode == 'yxyy') 
        toastr.warning('正在同步排班信息给HIS,请耐心等待。');
        
        IHttp.post('basedata/dispatchOperation', {
            dispatchList: dispatchList,
            roleType: auth.loginUser().roleType
        }).then((rs) => {
            $scope.$emit('childRefresh');
            if (rs.data.resultCode != 1)
                return
            toastr.info(rs.data.resultMessage);
        });
    })

    // 取消手术 
    $scope.cancelItem = function(item, type) {
        var scope = $rootScope.$new();
        scope.data = {
            items: item
        };
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
                    toastr.info('取消手术成功!');
                    $scope.$emit('childRefresh');
                }
            });
        }
    }

    // 撤回手术
    $scope.revokeItem = function(item, type) {
        confirm.show('选择 "确定" 将数据撤回到手术室安排，否则取消撤回').then(function(rs) {
            IHttp.post('basedata/cancelOperroomDispatch', { regOptId: item.regOptId }).then(function(rs) {
                if (rs.data.resultCode != 1) return;
                toastr.success(rs.data.resultMessage);
                $scope.$emit('childInited');
            });
        });
    }
    $scope.$emit('childInited');
}
