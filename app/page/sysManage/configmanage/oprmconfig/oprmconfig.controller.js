oprmConfig.$inject = ['$rootScope', '$scope', 'IHttp', 'uiGridConstants', '$timeout', '$uibModal'];

module.exports = oprmConfig;

function oprmConfig($rootScope, $scope, IHttp, uiGridConstants, $timeout, $uibModal) {
    $scope.params = {
        pageNo: 1,
        pageSize: 15,
        sort: '',
        orderBy: '',
        filters: []
    };
    var paramsGroupById = {
        "pageNo": 1,
        "pageSize": 5,
        "sort": "",
        "orderBy": "",
        "filters": []
    };
    var promise;
    //        $scope.gridoperaRoom.expandableRowHeight=127+40*,
    
    $scope.gridoperaRoom = {
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

            // // 展开 内部grid
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
            cellTemplate: '<div class="ui-grid-cell-contents" ><a ng-show="" ng-click=grid.appScope.devicesConfigFn(row)>设备配置</a>&nbsp&nbsp<a ng-click=grid.appScope.addOperaRoom(row)>编辑</a></div>',
        }],
        data: []
    };
    var gridOptionsGroupById = {
        enableSorting: false,
        enableFiltering: false, // 过滤栏显示
        enableGridMenu: false, // 配置按钮显示
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: false, // 使用外部过滤
        useExternalPagination: true, // 使用外部分页
        useExternalSorting: false, // 使用外部排序
        paginationPageSizes: [5, 10], // 配置每页行数可选参数
        paginationPageSize: 5, // 每页默认显示行数
        showGridFooter: true, // 显示页脚        
        columnDefs: [
            { field: 'codeValue', name: '值' },
            { field: 'codeName', name: '展示文本' }, {
                field: 'enable',
                name: '状态',
                filter: {
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: [{ value: 'true', label: '启用' }, { value: 'false', label: '禁用' }]
                },
                cellFilter: 'fieldEnable'
            }, {
                name: '操作',
                enableSorting: false,
                enableFiltering: false,
                cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click=grid.appScope.editItem(row.entity)>编辑</a><span ng-if="" >|</span><a ng-if=""  ng-really-message="是否确定删除?" ng-really-click=grid.appScope.delItem(row.entity)>删除</a></div>'
            }
        ],
        onRegisterApi: function(gridApi) {
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                paramsGroupById.pageNo = newPage;
                paramsGroupById.pageSize = pageSize;
                initGroupById();
            });
        }
    };
    $scope.refresh = function() {
        getOperaRoom();
    }

    var getOperaRoom = function() {
        IHttp.post("basedata/queryRoomList", $scope.params).then(function(data) {
            data = data.data;
            $scope.gridoperaRoom.totalItems = data.total;
            for (var i = 0; i < data.resultList.length; i++) {

                data.resultList[i].gridOptionsGroupById = gridOptionsGroupById;
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
            backdrop: 'static',
            scope: scope
        }).result.then(function() {
            getOperaRoom();
        });
    }
    $scope.devicesConfigFn = function(row) {
        var scope = $rootScope.$new();
        if (row === undefined) {
            scope.operRoomId = 0;
        } else {
            scope.operRoomId = row.entity.operRoomId;
        }
        $uibModal.open({
            animation: true,
            size: 'lg',
            template: require('./deviceconfigdialog.html'),
            controller: require('./deviceconfigdialog.controller'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        }).result.then(function() {
            getOperaRoom();
        });
    }

    function initGroupById() {
        var paramsGroupById = { "pageNo": 1, "pageSize": 5, "sort": "", "orderBy": "", "filters": [{ "field": "beid", "value": "102" }, { "field": "groupId", "value": "abnormal" }], "beid": "102" };
        IHttp.post('sys/getDictItemsByGroupId', paramsGroupById).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            var list = rs.data.resultList;
            gridOptionsGroupById.data = list;
            gridOptionsGroupById.totalItems = rs.data.total;
        });
    }
    $scope.btnAdd = function() {
        edit(null, 'addGroup');
    }
    $scope.editGroup = function(entity) {
        edit(entity, 'editGroup');
    }
    $scope.delGroup = function(entity) {
        IHttp.post('sys/deleteDictItemGroup', { id: entity.id }).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            var list = $scope.gridOptions.data;
            for (var a = 0; a < list.length; a++) {
                if (list[a].id == entity.id) {
                    list.splice(a, 1);
                }
            }
        });
    }

    function delItem(entity) {
        IHttp.post('sys/deleteDictItem', { id: entity.id }).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            var list = gridOptionsGroupById.data;
            for (var a = 0; a < list.length; a++) {
                if (list[a].id == entity.id) {
                    list.splice(a, 1);
                }
            }
        });
    }

    function edit(entity, type) {
        var scope = $rootScope.$new();
        scope.item = {
            type: type,
            entity: entity
        };

        if (type == 'addItem')
            scope.item.len = gridOptionsGroupById.data.length + 1;
        else if (type == 'editItem')
            scope.item.len = gridOptionsGroupById.data.length;

        var modalInstance = $uibModal.open({
            animation: true,
            template: require('./modal.html'),
            controller: require('./modal.controller'),
            backdrop: 'static',
            scope: scope
        });

        modalInstance.result.then(function(data) {
            if (type == 'addGroup' || type == 'editGroup')
                initGroup();
            else
                initGroupById();
        }, function(data) {
            //console.log(data)
        });
    }
}
