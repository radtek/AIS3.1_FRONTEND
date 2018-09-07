pacubedconfig.$inject = ['$rootScope', '$scope', 'IHttp', 'uiGridConstants', '$timeout', '$uibModal'];

module.exports = pacubedconfig;
function pacubedconfig($rootScope, $scope, IHttp, uiGridConstants, $timeout, $uibModal) {
    $scope.params = {
        pageNo: 1,
        pageSize: 15,
        sort: '',
        orderBy: '',
        filters: []
    };
    var promise;
    $scope.gridOption = {
        enableFiltering: true,
        enableGridMenu: true,
        paginationPageSizes: [15, 30, 50],
        rowHeight: 40,
        paginationPageSize: $scope.params.pageSize,
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: true,
        useExternalPagination: true,
        // useExternalSorting: true,
        // expandableRowTemplate: require('./expand.html'),
        // expandableRowHeight:277,
        // expandableRowScope: {
        //     editItem: function(entity) {
        //         edit(entity, 'editItem');
        //     },
        //     delItem: function(entity) {
        //         delItem(entity);
        //     }
        // },
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
            // 状态变化前 控制只能展开一个
            // gridApi.expandable.on.rowExpandedBeforeStateChanged($scope, function(row) {
            //     if (!row.isExpanded) {
            //         paramsGroupById.pageNo = 1;
            //         gridApi.expandable.collapseAllRows();
            //     }
            // });

            // 展开 内部grid
            // gridApi.expandable.on.rowExpandedStateChanged($scope, function(row) {
            //     if (row.isExpanded) {
            //         paramsGroupById.filters = [{
            //             field: 'beid',
            //             value: row.entity.beid
            //         }, {
            //             field: 'groupId',
            //             value: row.entity.groupId
            //         }];
            //         paramsGroupById.pageNo = 1;
            //         initGroupById();
            //         row.entity.editItem = function() {
            //             edit(row.entity, 'addItem');
            //         }
            //     } else {
            //         paramsGroupById.pageNo = 1;
            //         gridOptionsGroupById.data = [];
            //     }
            // });
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
            displayName: '床号',
            cellTooltip: function(row, col) {
                return row.entity.name;
            }
        }, {
            field: 'ipAddr',
            displayName: 'ipAddr',
            cellTooltip: function(row, col) {
                return row.entity.ipAddr;
            }
        }, {
            field: '手术Id',
            displayName: 'regOptId',
            visible:false,
            cellTooltip: function(row, col) {
                return row.entity.regOptId;
            }
        }, {
            field: 'port',
            displayName: 'port',
            cellTooltip: function(row, col) {
                return row.entity.port;
            }
        }, {
            field: 'roomId',
            displayName: 'roomId',
            visible:false,
            cellTooltip: function(row, col) {
                return row.entity.roomId;
            }
        },{
            field: 'sampFreq1',
            displayName: '采样间隔1',
            cellTooltip: function(row, col) {
                return row.entity.sampFreq1;
            }
        },{
            field: 'sampFreq2',
            displayName: '采样间隔2',
            cellTooltip: function(row, col) {
                return row.entity.sampFreq2;
            }
        }, {
            field: 'status',
            displayName: '是否有效',
            cellFilter: "bedStatusList",
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [{
                    value: "1",
                    label: '已分配'
                }, {
                    value: "-1",
                    label: '不可用'
                }, {
                    value: "0",
                    label: '空床'
                }, ]
            },
            cellTooltip: function(row, col) {
                return row.entity.enable;
            }
        }, {
            field: 'type',
            displayName: '操作',
            enableFiltering: false,
            enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents" ><a ng-show="" ng-click=grid.appScope.devicesConfigFn(row)>设备配置</a>&nbsp&nbsp<a ng-click=grid.appScope.addOperaRoom(row)>编辑</a></div>',
        }],
        data: []
    };
    $scope.refresh = function() {
        getOperaRoom();
    }

    var getOperaRoom = function() {
        IHttp.post("bas/getregionbedlist", $scope.params).then(function(data) {
            data = data.data;
            $scope.gridOption.totalItems = data.total;
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
            $scope.gridOption.data = data.resultList;
        });
    }
    getOperaRoom();

    $scope.addOperaRoom = function(row) {
        var scope = $rootScope.$new();
        if (row === undefined) {
            scope.id = 0;
        } else {
            scope.id = row.entity.id;
        }
        $uibModal.open({
            animation: true,
            size: 'lg',
            template: require('./editOperRoomConfig.html'),
            controller: require('./editOperRoomConfig.controller'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        }).result.then(function() {
            getOperaRoom();
        });
    }
    // function delItem(entity) {
    //     IHttp.post('sys/deleteDictItem', { id: entity.id }).then(function(rs) {
    //         if (rs.data.resultCode != 1) return;
    //         var list = gridOptionsGroupById.data;
    //         for (var a = 0; a < list.length; a++) {
    //             if (list[a].id == entity.id) {
    //                 list.splice(a, 1);
    //             }
    //         }
    //     });
    // }

}