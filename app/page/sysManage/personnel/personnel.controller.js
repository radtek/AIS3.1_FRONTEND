PersonnelCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'uiGridConstants', '$timeout', 'toastr', 'confirm', '$uibModal'];

module.exports = PersonnelCtrl;

function PersonnelCtrl($rootScope, $scope, IHttp, uiGridConstants, $timeout, toastr, confirm, $uibModal) {
	var promise;
    $scope.userParams = {
        pageNo: 1,
        pageSize: 15,
        sort: '',
        orderBy: '',
        filters: []
    };

    $scope.gridOptions = {
        enableFiltering: true,
        enableGridMenu: true,
        paginationPageSizes: [ 15, 30, 50],
        rowHeight: 40,
        paginationPageSize: $scope.userParams.pageSize,
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: true,
        useExternalPagination: true,
        useExternalSorting: true,
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                if (sortColumns.length === 0) {
                    $scope.userParams.orderBy = '';
                } else {
                    $scope.userParams.orderBy = sortColumns[0].sort.direction;
                    $scope.userParams.sort = sortColumns[0].colDef.field;
                }
                getPage();
            });
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                $scope.userParams.pageNo = newPage;
                $scope.userParams.pageSize = pageSize;
                getPage();
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
                        if (value) {
                            filterArr.push({
                                field: fieldName,
                                value: value
                            });
                        }
                    });
                    $scope.userParams.filters = filterArr;
                    getPage();
                }, 2000)

            });
        },
        columnDefs: [{
            field: 'userName',
            displayName: '用户名',
            cellTooltip: function(row, col) {
                return row.entity.userName;
            }
        }, {
            field: 'name',
            displayName: '姓名',
            cellTooltip: function(row, col) {
                return row.entity.name;
            }
        }, {
            field: 'pinYin',
            displayName: '拼音码',
            cellTooltip: function(row, col) {
                return row.entity.pinYin;
            }
        }, {
            field: 'professionalTitle',
            displayName: '职称',
            cellTooltip: function(row, col) {
                return row.entity.professionalTitle;
            }
        }, {
            field: 'executiveLevel',
            displayName: '行政级别',
            cellTooltip: function(row, col) {
                return row.entity.executiveLevel;
            }
        }, {
            field: 'userType',
            displayName: '用户类型',
            cellTooltip: function(row, col) {
                return row.entity.userType;
            },
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [{
                    value: "ADMIN",
                    label: '管理员'
                }, {
                    value: "ANAES_DOCTOR",
                    label: '麻醉医生'
                }, {
                    value: "NURSE",
                    label: '护士'
                }, {
                    value: "ANAES_PERFUSION",
                    label: '灌注医生'
                }]
            },
        }, {
            field: 'enable',
            displayName: '状态',
            visible: false,
            cellTooltip: function(row, col) {
                return row.entity.enable;
            },
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [{
                    value: "0",
                    label: '禁用'
                }, {
                    value: "1",
                    label: '启用'
                }]
            }
        }, {
            field: 'roleName',
            displayName: '用户组',
            cellTooltip: function(row, col) {
                return row.entity.roleName;
            }
        }, {
            field: 'id',
            displayName: '操作',
            enableFiltering: false,
            enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents"><a href="" ng-click=grid.appScope.editUser(row.entity)>编辑</a> <span>|</span> <a href="" ng-click=grid.appScope.removeUser(row.entity)>{{row.entity.enable}}</a> <span>|</span> <a href="" ng-click=grid.appScope.resetpwd(row.entity.userName)>重置密码</a></div>'
        }],
        data: []
    };

    var getPage = function() {
        IHttp.post("sys/getAllUser", $scope.userParams).then(function(data) {
            data = data.data;
            var gridData = data.userItem;
            $scope.gridOptions.totalItems = data.total;
            for (var i = 0; i < gridData.length; i++) {
                var tag = gridData[i].enable;
                if (tag == "0") {
                    gridData[i].enable = '启用';
                } else {
                    gridData[i].enable = '禁用';
                }
            }
            $scope.gridOptions.data = gridData;
        });
    }
    getPage();

    $scope.editUser = function(entity) {
        var scope = $rootScope.$new();
        !entity || (scope.userName = entity.userName);
        $uibModal.open({
            animation: true,
            size: 'lg',
            template: require('./editPersonnel.html'),
            controller: require('./editPersonnel.controller'),
            controllerAs: 'vm',
            backdrop:'static',
            scope: scope
        }).result.then(function() {
            getPage();
        });
    }

    $scope.removeUser = function(entity) {
        confirm.tips().show('确认将状态置为' + entity.enable + '?').then(function() {
            IHttp.post('sys/deleteUserById', { userName: entity.userName, enable: entity.enable == '启用' ? '1' : '0' }).then(function(rs) {
                if (rs.data.resultCode === '1') {
                    entity.enable = entity.enable == '禁用' ? '启用' : '禁用';
                    toastr.success(rs.data.resultMessage);
                }
            });
        });
    }

    $scope.resetpwd = function(userName) {
        confirm.tips().show('你确定重置此密码？').then(function() {
            IHttp.post('sys/resetUserPassword', { 'loginName': userName }).then(function(rs) {
                if (rs.data.resultCode === '1') {
                    toastr.info('密码重置成功。');
                }
            });
        });
    }

}
