MedFinanceCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$filter', 'toastr', 'auth', 'anaesCheckOutServe', '$uibModalInstance'];

module.exports = MedFinanceCtrl;

function MedFinanceCtrl($rootScope, $scope, IHttp, $filter, toastr, auth, anaesCheckOutServe, $uibModalInstance) {
    var vm = this;
    let regOptId = $rootScope.$stateParams.regOptId;
    let parent = $scope.$parent;
    let mark = parent.mark;
    let user = auth.loginUser();
    $scope.loginName = user.userName;

    $scope.lvList = [{
        id: '',
        name: ''
    }, {
        id: 1,
        name: '个人'
    }, {
        id: 2,
        name: '科室'
    }];

    var params = {
        timestamp: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        pageNo: 1,
        pageSize: 15,
        createUser: user.userName,
        roleType: user.roleType,
        sort: '',
        orderBy: '',
        filters: [{ field: 'tempName', value: '' }, { field: 'type', value: '' }, {field: 'remark', value: ''}, { field: 'tempType', value: '2' }]
    };

    $scope.gridOptions = {
        enableFiltering: false, //  表格过滤栏
        paginationPageSizes: [15, 30, 50],
        rowHeight: 40,
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: false, // 过滤的搜索
        useExternalPagination: true, // 分页
        useExternalSorting: true,
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                params.pageNo = newPage;
                params.pageSize = pageSize;
                $scope.search(vm);
            });
        },
        columnDefs: [{
                field: 'tempName',
                displayName: '模板名称',
                cellTooltip: function(row, col) {
                    return row.entity.tempName;
                }
            }, {
                field: 'remark',
                displayName: '描述',
                cellTooltip: function(row, col) {
                    return row.entity.remark;
                },
                width: '20%'
            }, {
                field: 'createName',
                displayName: '创建人',
                cellTooltip: function(row, col) {
                    return row.entity.createName;
                },
                visible: $scope.mark != '核算单'
            }, {
                field: 'createTimeStr',
                displayName: '时间',
                cellTooltip: function(row, col) {
                    return row.entity.createTimeStr;
                },
                visible: $scope.mark != '核算单'
            }, {
                field: 'typeStr',
                displayName: '应用级别',
                cellTooltip: function(row, col) {
                    return row.entity.typeStr;
                },
                visible: false,
                width: 100
            }, {
                field: 'id',
                displayName: '操作',
                width: 88,
                cellTemplate: '<div class="ui-grid-cell-contents"><a href="" ng-click=grid.appScope.apply(row.entity)>应用</a><span ng-if="grid.appScope.loginName===row.entity.createUser">&nbsp;|&nbsp;<a href="" ng-click=grid.appScope.del(row.entity)>删除</a></span></div>'
            }]
    };

    $scope.search = function(vm) {
        params.filters[0].value = vm.tempName == undefined ? '' : vm.tempName;
        params.filters[1].value = vm.lv == undefined ? '' : vm.lv;
        params.filters[2].value = vm.remark == undefined ? '' : vm.remark;
        var data = [];
        IHttp.post('basedata/queryPacuLiquidTempList', params).then(function(rs) {
            if (rs.data.resultCode != 1)
                return;
            data = rs.data.pacuLiquidTempList;
            data.forEach(function(item) {
                item.createTimeStr = $filter('date')(item.createTime, 'yyyy-MM-dd');
                item.typeStr = item.type == 1 ? '个人' : '科室';
            });
            $scope.gridOptions.data = data;
            $scope.gridOptions.totalItems = rs.data.total;
        });
    }
    $scope.search(vm);

    $scope.apply = function(row) {
        $uibModalInstance.close(row);
    }

    $scope.del = function(row) {
        if (user.roleType !== 'ANAES_DIRECTOR' && row.type == 2) {
            toastr.warning('只有麻醉科主任或护士长能删除科室模板');
            return;
        }
        IHttp.post('basedata/deleteLiquidTemp', { tempId: row.tempId }).then(function(rs) {
            if (rs.data.resultCode === '1') {
                $scope.search(vm);
            }
        });
    }

    vm.close = function() {
        $uibModalInstance.close('cancel');
    }

}
