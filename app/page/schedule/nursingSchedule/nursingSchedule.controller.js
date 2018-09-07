NursingScheduleCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'uiGridConstants', '$timeout', 'toastr', 'select', 'auth', '$uibModal', 'uiGridServe', 'baseConfig'];

module.exports = NursingScheduleCtrl;

function NursingScheduleCtrl($rootScope, $scope, IHttp, uiGridConstants, $timeout, toastr, select, auth, $uibModal, uiGridServe, baseConfig) {
    var beCode = auth.loginUser().beCode,
        tempHtml = '<div class="ui-grid-cell-contents"><a ng-click=grid.appScope.cancelItem(row.entity,1)>取消</a></div>',
        basCfg = baseConfig.getSurgSchedule();

    select.dept().then((rs) => {
        if (rs.data.resultCode != 1)
            return;
        $scope.dept = rs.data.resultList;
    })

    select.operroom().then((rs) => {
        if (rs.data.resultCode != 1)
            return;
        $scope.operroom = rs.data.resultList;
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

        var colDefs = $scope.gridOptions.columnDefs;
        for (var col of colDefs) {
            if (col.field == 'instrnurseId1' || col.field == 'instrnurseId2' || col.field == 'circunurseId1' || col.field == 'circunurseId2')
                col.editDropdownOptionsArray = rs.data.userItem;
        }
    })

    select.getOptBody().then((rs) => {
        if (rs.data.resultCode != 1)
            return;
        $scope.optBodyList = rs.data.resultList;
    })

    //需要排重的下拉选项字段
    let fields = [
        'instrnurseId1', //洗手护士
        'instrnurseId2',
        'circunurseId1', //巡回护士
        'circunurseId2'
    ]
    
    $scope.gridOptions = uiGridServe.option({
        enableFiltering: false,
        paginationState: 2,
        columnDefs: [{
            field: 'operateNumber',
            name: '手术申请序号',
            width: 110,
            cellTooltip: function(row, col) {
                return row.entity.operateNumber;
            },
            visible: beCode == 'sybx' ? true : false
        }, {
            field: 'emergencyName',
            name: '类型',
            pinnedLeft: true,
            width: 70
        }, {
            field: 'name',
            name: '姓名',
            pinnedLeft: true,
            width: 90
        }, {
            field: 'sex',
            name: '性别',
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [{
                    value: '男',
                    label: '男'
                }, {
                    value: '女',
                    label: '女'
                }]
            },
            enablePinning: false,
            width: 55
        }, {
            field: 'age',
            name: '年龄',
            width: 55
        }, {
            field: 'hid',
            name: '住院号',
            width: 100
        }, {
            field: 'regionName',
            name: '病区',
            cellTooltip: function(row, col) {
                return row.entity.regionName;
            },
            minWidth: 100,
            visible: beCode == 'hbgzb' ? false : true
        }, {
            field: 'deptName',
            name: '科室',
            cellTooltip: function(row, col) {
                return row.entity.deptName;
            },
            minWidth: 140
        }, {
            field: 'bed',
            name: '床号',
            width: 70
        }, {
            field: 'diagnosisName',
            name: '术前诊断',
            cellTooltip: function(row, col) {
                return row.entity.diagnosisName;
            },
            minWidth: 200
        }, {
            field: 'designedOptName',
            name: '拟施手术',
            cellTooltip: function(row, col) {
                return row.entity.designedOptName;
            },
            minWidth: 200
        }, {
            field: 'designedAnaesMethodName',
            name: '麻醉方法',
            cellTooltip: function(row, col) {
                return row.entity.designedAnaesMethodName;
            },
            minWidth: 100
        }, {
            field: 'operatorName',
            name: '手术医生',
            width: 110
        }, {
            field: 'operRoomId',
            name: '手术室',
            cellClass: 'visible',
            cellTemplate: '<select ng-options="item.operRoomId as item.name for item in grid.appScope.operroom track by item.operRoomId" ng-model="row.entity.operRoomId" ></select>',
            width: 90
        }, {
            field: 'pcs',
            name: '手术台次',
            cellClass: 'visible',
            cellTemplate: '<select ng-options="item.codeValue as item.codeName for item in grid.appScope.pacList track by item.codeValue" ng-model="row.entity.pcs" ></select>',
            width: 100
        }, {
            field: 'operaDate',
            name: '手术日期',
            cellClass: 'visible',
            cellTemplate: '<datetime-picker flex ng-model="row.entity.operaDate" timepicker="false" format="Y-m-d" maxdate="2100-01-01" not-allow-blank="true"></datetime-picker>',
            width: 100
        }, {
            field: 'startTime',
            name: '开始时间',
            cellClass: 'visible',
            cellTemplate: '<datetime-picker flex ng-model="row.entity.startTime" datepicker="false" timepicker="true" format="H:i"></datetime-picker>',
            width: 100
        }, {
            field: 'circunurseId1',
            name: '第一巡回护士',
            cellClass: 'visible',
            cellTemplate: require('./pinYinFilter1.html'),
            editDropdownOptionsArray: [],
            width: 120
        }, {
            field: 'circunurseId2',
            name: '第二巡回护士',
            cellClass: 'visible',
            cellTemplate: require('./pinYinFilter2.html'),
            editDropdownOptionsArray: [],
            width: 120
        }, {
            field: 'instrnurseId1',
            name: '第一洗手护士',
            cellClass: 'visible',
            cellTemplate: require('./pinYinFilter3.html'),
            editDropdownOptionsArray: [],
            width: 120
        }, {
            field: 'instrnurseId2',
            name: '第二洗手护士',
            cellClass: 'visible',
            cellTemplate: require('./pinYinFilter4.html'),
            editDropdownOptionsArray: [],
            width: 120
        }, {
            field: 'optBody',
            name: '体位',
            cellClass: 'visible',
            cellTemplate: '<select ng-if="row.entity.optBodydiv" ng-options="item.codeValue as item.codeName for item in grid.appScope.optBodyList track by item.codeValue" ng-model="row.entity.optBody" ></select>',
            width: 80,
            visible: beCode == 'hbgzb' ? false : true
        }, {
            field: 'remark',
            name: '备注',
            cellTooltip: function(row, col) {
                return row.entity.remark;
            },
            width: 100,
            visible: beCode == 'hbgzb' ? false : true
        }, {
            name: '操作',
            enableSorting: false,
            enableFiltering: false,
            cellTemplate: tempHtml,
            width: 90
        }]
    }, function(){
        $scope.$emit('childRefresh');
    });

    $scope.focus = function(row, col) {
        col = uiGridServe.cellFocus(row, col, fields, $scope.nurseList);
    }

    $scope.$on('query', (event, params) => {
        params.type = 1;
        params.dispStep = 2;
        IHttp.post('basedata/searchNoEndListSchedule', params).then((rs) => {
            if (rs.data.resultCode != 1)
                return;
            $scope.gridOptions.data = rs.data.resultList;
        });
    })

    $scope.$on('save', (event) => {
        var dispatchList = [];
        for (var a in $scope.gridOptions.data) {
            var item = $scope.gridOptions.data[a - 0];
            if (item.isLocalAnaes == '1')
                item.isHold = '0';
            if (item.circunurseId1 || item.operRoomId || item.startTime || item.pcs) {
                if (!item.circunurseId1) {
                    toastr.warning('请为患者安排巡回护士');
                    return;
                }
                if (!item.operRoomId) {
                    toastr.warning('请为患者安排手术间');
                    return;
                }
                if (!item.operaDate) {
                    toastr.warning('请为患者安排手术日期');
                    return;
                }
                if (!item.startTime) {
                    toastr.warning('请为患者安排具体手术时间');
                    return;
                }
                if (!item.pcs && beCode !== 'nhfe') {
                    toastr.warning('请为患者安排台次');
                    return;
                }
                dispatchList.push(item)
            }
        }

        if (dispatchList.length <= 0) {
            toastr.warning('患者未安排巡回护士、手术间、手术日期、手术时间、台次不能为空');
            return;
        }

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

    $scope.$on('pushInfo',(event) => {
        var pushList = [];
        angular.forEach($scope.gridApi.grid.rows, function(row) {
            if (row.isSelected && row.entity.isLocalAnaes == '0') {
                pushList.push(row.entity.regOptId);
            } else {
                row.isSelected = false;
            }
        });
        if (pushList.length <= 0) {
            toastr.warning('请先选择要推送的数据！');
            return;
        }
        IHttp.post('basedata/dispatchDataPush', pushList).then(function(rs) {
            if(rs.data.resultCode != 1)
                toastr.warning(rs.data.resultMessage);
            else
                toastr.info(rs.data.resultMessage)
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

    $scope.$emit('childInited');
}