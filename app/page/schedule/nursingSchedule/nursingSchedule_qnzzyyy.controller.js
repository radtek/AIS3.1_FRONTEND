NursingScheduleCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'uiGridConstants', '$timeout', 'toastr', 'select', 'auth', '$uibModal', '$filter', 'confirm', 'baseConfig'];

module.exports = NursingScheduleCtrl;

function NursingScheduleCtrl($rootScope, $scope, IHttp, uiGridConstants, $timeout, toastr, select, auth, $uibModal, $filter, confirm, baseConfig) {
    var page = $rootScope.$state.current.name;
    var beCode = auth.loginUser().beCode;
    $scope.RECALL = $rootScope.permission.indexOf('RECALL') > 0;
    var tempHtml = '<div class="ui-grid-cell-contents"><a ng-if="grid.appScope.RECALL" ng-click=grid.appScope.revokeItem(row.entity,1)>撤回</a><span ng-if="grid.appScope.RECALL">&nbsp;|&nbsp;</span><a ng-click=grid.appScope.cancelItem(row.entity,1)>取消</a></div>';
    var params = {
        pageNo: 1,
        pageSize: 15,
        sort: '',
        orderBy: '',
        filters: [],
        state: '01,02,08'
    };

    var promise;

    select.dept().then((rs) => {
        if (rs.data.resultCode != 1)
            return;
        $scope.dept = rs.data.resultList;
    });

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
    });

    select.getOptBody().then((rs) => {
        if (rs.data.resultCode != 1)
            return;
        $scope.optBodyList = rs.data.resultList;
    })

    //需要排重的下拉选项字段
    let nurseFields = [
        'instrnurseId1', //洗手护士
        'instrnurseId2',
        'circunurseId1', //巡回护士
        'circunurseId2'
    ]

    $scope.gridOptions = {
        enableFiltering: false, // 过滤栏显示
        enableGridMenu: true, // 配置按钮显示
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: false, // 禁止内部过滤，启用外部滤波器监听事件
        useExternalSorting: true,
        showGridFooter: true, // 显示页脚
        useExternalPagination: false, // 分页
        paginationPageSizes: [15, 30, 50],
        rowHeight: 40,
        paginationPageSize: params.pageSize,
        // enableCellEdit: false,
        enableCellEditOnFocus: true,
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
            gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                if (sortColumns.length === 0) {
                    params.orderBy = '';
                } else {
                    params.orderBy = sortColumns[0].sort.direction;
                    params.sort = sortColumns[0].colDef.field;
                }
                $scope.$emit('childRefresh');
            });
            // gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
            //     $scope.queryObj.pageNo = newPage;
            //     $scope.queryObj.pageSize = pageSize;
            //     $scope.$emit('childRefresh');
            // });
            gridApi.core.on.filterChanged($scope, function() {
                $scope.grid = this.grid;
                if (promise) {
                    $timeout.cancel(promise);
                }
                promise = $timeout(function() {
                    var filterArr = [];
                    angular.forEach($scope.grid.columns, function(column) {
                        var fieldName = column.field;
                        var value = column.filters[0].term;
                        if (value === null) {
                            value = "";
                        }
                        if (value !== undefined) {
                            filterArr.push({
                                field: fieldName,
                                value: value
                            });
                        }
                    });
                    params.filters = filterArr;
                    $scope.$emit('childRefresh');
                }, 1000)
            });
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
            field: 'operaDate',
            name: '手术日期',
            width: 100,
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
            minWidth: 110
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
            field: 'name',
            name: '姓名',
            width: 90
        }, {
            field: 'designedOptName',
            name: '拟施手术',
            cellTooltip: function(row, col) {
                return row.entity.designedOptName;
            },
            minWidth: 100
        }, {
            field: 'operatorName',
            name: '手术医生',
            width: 105
        }, {
            field: 'designedAnaesMethodName',
            name: '麻醉方法',
            cellTooltip: function(row, col) {
                return row.entity.designedAnaesMethodName;
            },
            minWidth: 100
        }, {
            field: 'circunurseId1',
            name: '巡回护士1',
            cellClass: 'nurse-circunurseId1',
            cellTemplate: require('./pinYinFilter1.html'),
            cellTooltip: function(row, col) {
                return row.entity.circunurseId1;
            },
            editDropdownOptionsArray: [],
            enableCellEdit: true,
            width: 105
        }, {
            field: 'circunurseId2',
            name: '巡回护士2',
            cellClass: 'nurse-circunurseId2',
            cellTemplate: require('./pinYinFilter2.html'),
            cellTooltip: function(row, col) {
                return row.entity.circunurseId2;
            },
            editDropdownOptionsArray: [],
            enableCellEdit: true,
            width: 105
        }, {
            field: 'instrnurseId1',
            name: '洗手护士1',
            cellClass: 'nurse-instrnurseId1',
            cellTemplate: require('./pinYinFilter3.html'),
            cellTooltip: function(row, col) {
                return row.entity.instrnurseId1;
            },
            editDropdownOptionsArray: [],
            enableCellEdit: true,
            width: 105
        }, {
            field: 'instrnurseId2',
            name: '洗手护士2',
            cellClass: 'nurse-instrnurseId2',
            cellTemplate: require('./pinYinFilter4.html'),
            cellTooltip: function(row, col) {
                return row.entity.instrnurseId2;
            },
            editDropdownOptionsArray: [],
            enableCellEdit: true,
            width: 105
        }, {
            name: '操作',
            field: 'instrnurseId2',
            enableSorting: false,
            enableFiltering: false,
            cellTemplate: tempHtml,
            width: 90
        }],
        rowTemplate: '<div ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell ng-dblclick="grid.appScope.detail(row.entity);"></div>'
    };

    $scope.detail = function(entity) {
        var scope = $rootScope.$new();
        scope.data = entity;
        scope.tabIndex = 1;
        $uibModal.open({
            animation: true,
            size: 'lg',
            template: require('../modal/rowDetail/rowDetail.html'),
            controller: require('../modal/rowDetail/rowDetail.controller'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        }).result.then((rs) => {
            if (rs == 'success') {
                $scope.$emit('childRefresh');
            }
        });
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
    $scope.focus = function(row, col) {
        let selectedList = [];
        col.colDef.editDropdownOptionsArray = [];
        for (let nurse of nurseFields) {
            if (nurse !== col.field && row[nurse]) {
                selectedList.push(row[nurse]);
            }
        }
        // console.log($scope.nurseList);
        col.colDef.editDropdownOptionsArray = $scope.nurseList.filter((nurse) => {
            let i = 0;
            for (; i < selectedList.length; i++) {
                if (nurse.userName === selectedList[i]) {
                    break;
                }
            }
            return i === selectedList.length;
        });
    }

    $scope.$on('pushInfo', (event) => {
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
            if (rs.data.resultCode != 1)
                toastr.warning(rs.data.resultMessage);
            else
                toastr.info(rs.data.resultMessage)
        });
    })

    $scope.$on('query', (event, params) => {
        params.type = 1;
        params.dispStep = 2;
        if (beCode == 'qnzrmyy') {
            params.pageNo = undefined;
            params.pageSize = undefined;
        }
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
            if (item.circunurseId1)
                dispatchList.push(item);
        }

        if (dispatchList.length <= 0) {
            toastr.warning('请为患者安排巡回护士。');
            return;
        }

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

    $scope.$on('print', () => {
        if ($scope.gridOptions.data.length <= 0) {
            toastr.info('没有可打印的数据');
            return;
        }
        $scope.$emit('doc-print');
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
