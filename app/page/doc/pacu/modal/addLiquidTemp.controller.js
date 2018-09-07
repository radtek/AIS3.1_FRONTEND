loadTemp.$inject = ['$scope', 'IHttp', '$uibModalInstance', 'uiGridConstants', '$timeout', 'items', 'toastr', 'auth', '$filter'];

module.exports = loadTemp;

function loadTemp($scope, IHttp, $uibModalInstance, uiGridConstants, $timeout, items, toastr, auth, $filter) {
    let vm = this;
    let user = auth.loginUser();
    $scope.showSetBtn = false;
    if (user.roleType === 'ANAES_DIRECTOR' || user.roleType === 'HEAD_NURSE') {
        //护士长对所有患者的特殊权限
        $scope.showSetBtn = true;
    }

    var promise;
    $scope.LiquidTemp = {
        "tempName": "",
        "tempContent": "",
        "createUser": user.userName,
        "createName": user.name,
        "type": 1,
        "remark": "",
        "tempType": items.tempType
    };
    // 获取系统时间
    $scope.date = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
    let params = {
        timestamp: $scope.date,
        username: "",
        password: "",
        pageNo: 1,
        pageSize: 15,
        createUser: user.userName,
        sort: '',
        orderBy: '',
        filters: [{ field: 'tempType', value: items.tempType }]
    };
    $scope.gridOptions = {
        enableFiltering: true, //  表格过滤栏
        paginationPageSizes: [ 15, 30, 50],
        rowHeight: 40,
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: false, // 过滤的搜索
        useExternalPagination: true, // 分页
        useExternalSorting: true,
        columnDefs: [{
            field: 'tempContent',
            displayName: '模板内容',
            cellTooltip: function(row, col) {
                return row.entity.tempContent;
            }
        }, {
            field: 'createName',
            width: 85,
            displayName: '创建人',
            cellTooltip: function(row, col) {
                return row.entity.createName;
            }
        }, {
            field: 'type',
            displayName: '类型',
            width: 90,
            cellTooltip: function(row, col) {
                return row.entity.type;
            },
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [{
                    value: 1,
                    label: '私有'
                }, {
                    value: 2,
                    label: '全局'
                }, ]
            },
        }, {
            field: 'tempId',
            width: 150,
            displayName: '操作',
            enableFiltering: false,
            cellTemplate: '<div class="ui-grid-cell-contents" ><a href="" ng-click=grid.appScope.editNotice(row)>编辑</a><a href="" ng-click=grid.appScope.deletenotice(row)>|删除</a><a href="" ng-click=grid.appScope.settype(row)><span ng-if="row.entity.type ==\'私有\'">|设为全局</span><span ng-if="row.entity.type ==\'全局\'">|设为私有</span></a></div>',
        }]
    };

    $scope.gridOptions.onRegisterApi = function(gridApi) {
        $scope.gridApi = gridApi;
        $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
            if (sortColumns.length === 0) {
                params.orderBy = '';
            } else {
                params.orderBy = sortColumns[0].sort.direction;
                params.sort = sortColumns[0].colDef.field;
            }
            getLiquidTemp();
        });
        gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
            params.pageNo = newPage;
            params.pageSize = pageSize;
            getLiquidTemp();
        });
        $scope.gridApi.core.on.filterChanged($scope, function() {
            $scope.grid = this.grid;
            if (promise) {
                $timeout.cancel(promise);
            }
            promise = $timeout(function() {
                var filterArr = [];
                angular.forEach($scope.grid.columns, function(column) {
                    var fieldName = column.field;
                    var value = column.filters[0].term;
                    if (value !== undefined && value !== '' && value !== null) {
                        filterArr.push({
                            field: fieldName,
                            value: value
                        });
                    }
                });
                params.filters = filterArr;
                getLiquidTemp();
            }, 1000)
        });
    };

    var getLiquidTemp = function() {
        IHttp.post('basedata/queryPacuLiquidTempList', params)
            .then(function(rs) {
                if (rs.data.resultCode === '1') {
                    $scope.gridOptions.totalItems = rs.data.total;
                    var data = rs.data.pacuLiquidTempList;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].type === 1) {
                            data[i].type = '私有';
                        } else {
                            data[i].type = '全局';
                        }
                    }
                    $scope.gridOptions.data = data;
                }
            });
    }
    getLiquidTemp();

    $scope.editNotice = function(row) {
        if (row.entity.type == '全局' && $scope.showSetBtn == false) {
            toastr.error("对不起，您没有权限。");
            return;
        }
        if (row != undefined) {
            $scope.LiquidTemp = angular.extend({}, row.entity);
        }
    }

    $scope.saveTemp = function() {
        if ($scope.LiquidTemp.type == '全局' && $scope.showSetBtn == false) {
            toastr.error("对不起，您没有权限。");
            return;
        }
        if (!$scope.LiquidTemp.tempContent) {
            toastr.error("对不起，模板内容不能为空。");
            return;
        }

        if ($scope.LiquidTemp.type === "全局") {
            $scope.LiquidTemp.type = 2;
        } else {
            $scope.LiquidTemp.type = 1;
        }
        if (!$scope.LiquidTemp.createTime) {
            $scope.LiquidTemp.createTime = new Date().getTime();
        }
        $scope.LiquidTemp.tempType = items.tempType;

        var promise = IHttp.post('basedata/updateLiquidTemp', $scope.LiquidTemp);
        promise.then(function(rs) {
            var data = rs.data;
            if (data.resultCode === '1') {
                getLiquidTemp();
                $scope.LiquidTemp = {
                    "tempName": "",
                    "tempContent": "",
                    "createUser": user.username,
                    "createName": user.name,
                    "type": 1,
                    "remark": "",
                    "beid": user.beid
                };
            }
        });
    }

    $scope.settype = function(row) {
        if ($scope.showSetBtn == false) {
            toastr.error("对不起，您没有权限。");
            return;
        }
        if (row != undefined) {
            $scope.LiquidTemp = angular.extend({}, row.entity);
        }
        if ($scope.LiquidTemp.type === "全局") {
            $scope.LiquidTemp.type = 1;
        } else {
            $scope.LiquidTemp.type = 2;
        }
        if (!$scope.LiquidTemp.createTime) {
            $scope.LiquidTemp.createTime = new Date().getTime();
        }
        $scope.LiquidTemp.tempType = items.tempType;
        IHttp.post('basedata/updateLiquidTemp', $scope.LiquidTemp).then(function(rs) {
            var data = rs.data;
            if (data.resultCode === '1') {
                getLiquidTemp();
                $scope.LiquidTemp = {
                    "tempName": "",
                    "tempContent": "",
                    "createUser": user.userName,
                    "createName": user.name,
                    "type": 1,
                    "remark": "",
                    "beid": user.beid
                };
            }
        });

    }

    $scope.deletenotice = function(row) {
        if (row.entity.type == '全局' && $scope.showSetBtn == false) {
            toastr.error("对不起，您没有权限。");
            return;
        }
        var promise = IHttp.post('basedata/deleteLiquidTemp', {
            tempId: row.entity.tempId
        });
        promise.then(function(rs) {
            var data = rs.data;
            if (data.resultCode === '1') {
                getLiquidTemp();
            }
        });
    }

    vm.close = function() {
        $uibModalInstance.close('cancel');
    }

}
