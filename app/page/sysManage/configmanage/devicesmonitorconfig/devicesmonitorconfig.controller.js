devicesmonitorconfig.$inject = ['$rootScope', '$scope', 'IHttp', 'uiGridConstants', '$timeout', '$uibModal'];

module.exports = devicesmonitorconfig;

function devicesmonitorconfig($rootScope, $scope, IHttp, uiGridConstants, $timeout, $uibModal) {
    $scope.params = {
        pageNo: 1,
        pageSize: 15,
        sort: '',
        orderBy: '',
        filters: []
    };
    var promise;
    $scope.gridoperaRoom = {
        enableFiltering: true,
        enableGridMenu: true,
        paginationPageSizes: [ 15, 30, 50],
        rowHeight: 40,
        paginationPageSize: $scope.params.pageSize,
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: true,
        useExternalPagination: true,
        useExternalSorting: true,
        onRegisterApi: function(gridApi) {
            //排序
            gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                if (sortColumns.length === 0) {
                    $scope.params.orderBy = '';
                } else {
                    $scope.params.orderBy = sortColumns[0].sort.direction;
                    $scope.params.sort = sortColumns[0].colDef.field;
                }
                getOperaRoom();
            });
            //分页
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                $scope.params.pageNo = newPage;
                $scope.params.pageSize = pageSize;
                getOperaRoom();
            });
            //过滤
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
                        if (value) {
                            filterArr.push({
                                field: fieldName,
                                value: value
                            });
                        }
                    });
                    $scope.params.filters = filterArr;
                    getOperaRoom();
                }, 1000)
            });
        },
        columnDefs: [{
            field: 'name',
            displayName: '手术室名称',
            cellTooltip: function(row, col) {
                return row.entity.name;
            }
        }, {
            field: 'enable',
            displayName: '是否有效',
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [{
                    value: "1",
                    label: '启用'
                }, {
                    value: "0",
                    label: '禁用'
                }, ]
            },
            cellTooltip: function(row, col) {
                return row.entity.enable;
            }
        }, {
            field: 'tableNum',
            displayName: '手术台数量',
            cellTooltip: function(row, col) {
                return row.entity.tableNum;
            }
        }, {
            field: 'maxOperNum',
            displayName: '最大连台数',
            cellTooltip: function(row, col) {
                return row.entity.maxOperNum;
            }
        }, {
            field: 'operLevel',
            displayName: '手术室等级',
            cellTooltip: function(row, col) {
                return row.entity.operLevel;
            }
        }, {
            field: 'roomType',
            displayName: '类型',
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [{
                    value: "01",
                    label: '手术室'
                }, {
                    value: "02",
                    label: '恢复室'
                }, ]
            },
            cellTooltip: function(row, col) {
                return row.entity.roomType;
            }
        }, {
            field: 'operRoomId',
            displayName: '操作',
            enableFiltering: false,
            enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents" ><a ng-click=grid.appScope.addOperaRoom(row)>编辑</a></div>',
        }],
        data: []
    };

    $scope.refresh = function() {
        getOperaRoom();
    }

    var getOperaRoom = function() {
        IHttp.post("basedata/queryRoomList", $scope.params).then(function(data) {
            data = data.data;
            $scope.gridoperaRoom.totalItems = data.total;
            for (var i = 0; i < data.resultList.length; i++) {
                if (data.resultList[i].enable == '1') {
                    data.resultList[i].enable = '启用';
                } else {
                    data.resultList[i].enable = '禁用';
                }
                if (data.resultList[i].roomType == '01') {
                    data.resultList[i].roomType = '手术室';
                } else {
                    data.resultList[i].roomType = '恢复室';
                }
            }
            $scope.gridoperaRoom.data = data.resultList;
        });
    }
    getOperaRoom();

    $scope.addOperaRoom = function(row) {
        var scope = $rootScope.$new();
        if (row === undefined) {
            scope.operRoomId = 0;
        } else {
            scope.operRoomId = row.entity.operRoomId;
        }
        $uibModal.open({
            animation: true,
            size: 'lg',
            template: require('./editOperRoomConfig.html'),
            controller: require('./editOperRoomConfig.controller'),
            controllerAs: 'vm',
            backdrop:'static',
            scope: scope
        }).result.then(function() {
            getOperaRoom();
        });
    }
}