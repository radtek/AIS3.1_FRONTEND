oprmdevicesconfig.$inject = ['$rootScope', '$scope', 'IHttp', 'uiGridConstants', '$timeout', 'toastr', '$uibModal', '$q'];

module.exports = oprmdevicesconfig;

function oprmdevicesconfig($rootScope, $scope, IHttp, uiGridConstants, $timeout, toastr, $uibModal, $q) {
    $scope.params = {};
    var paramsGroupById = {
        "pageNo": 1,
        "pageSize": 5,
        "sort": "",
        "orderBy": "",
        "filters": []
    };
    var promise;
    $scope.interfaceTypeList = [{
        value: 1,
        label: 'TCP'
    }, {
        value: 2,
        label: '串口'
    }, {
        value: 3,
        label: 'UDP'
    }, ];
    $scope.deviceTypeList = [{
        value: "1",
        label: '手术室终端'
    }, {
        value: "2",
        label: '复苏室终端'
    }, {
        value: "3",
        label: '心电监护仪'
    }, {
        value: "4",
        label: '呼吸机'
    }, {
        value: "5",
        label: '麻醉机'
    }, ];
    $scope.positionList = [{
        value: 0,
        label: '瞄点'
    }, {
        value: 1,
        label: '数字'
    }, {
        value: -1,
        label: '实时'
    }, ];
    IHttp.post('sys/selectBusForDropDown', {}).then(function(rs) {
        if (rs.data.resultCode != 1) return;
        $scope.hospital = rs.data.sysBusDropDown;
    });
    var getList = function() {
        IHttp.post('sys/selectBusEntityList', {})
            .then(
                function(rs) {
                    var data = rs.data;
                    if (data.resultCode === "1") {
                        for (var i = 0; i < data.sysBusEntityList.length; i++) {
                            if (data.sysBusEntityList[i].isCurBe === 1) {
                                // data.sysBusEntityList[i].enable1 += '　当前局点';\
                                $scope.selHospModel = {};
                                $scope.selHospModel.beid = data.sysBusEntityList[i].beid;
                                $scope.selHospModel.name = data.sysBusEntityList[i].name;
                            }

                        }
                        $scope.initbeidFn();
                    }
                }
            );
    }
    getList();
    
    $scope.initbeidFn = function() {
        if (typeof $scope.selHospModel == "object") {
            $scope.params.beid = $scope.selHospModel.beid;
        } else {
            angular.forEach($scope.hospital, function(item, key) {
                if ($scope.selHospModel == item.name) {
                    $scope.params.beid = item.beid;
                }
            })
        }
        getOperaRoom({ beid: $scope.params.beid });
    }
    $scope.gridoperaRoom = {
        enableFiltering: true,
        enableGridMenu: true,
        paginationPageSizes: [15, 30, 50],
        rowHeight: 40,
        paginationPageSize: 15,
        useExternalSorting: true,
        expandableRowTemplate: require('./expand.html'),
        expandableRowHeight: 222,
        expandableRowScope: {
            editItem: function(entity) {
                edit(entity, 'editItem');
            },
            delItem: function(entity) {
                delItem(entity);
            },
            updatacolumn: function(entity, args) {
                updatacolumn(entity, args);
            }
        },
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
            // gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
            //     $scope.params.pageNo = newPage;
            //     $scope.params.pageSize = pageSize;
            //     getOperaRoom();
            // });
            // 状态变化前 控制只能展开一个
            gridApi.expandable.on.rowExpandedBeforeStateChanged($scope, function(row) {

                if (!row.isExpanded) {
                    paramsGroupById.pageNo = 1;
                    gridApi.expandable.collapseAllRows();
                }
            });
            // 展开 内部grid
            gridApi.expandable.on.rowExpandedStateChanged($scope, function(row) {
                if (row.isExpanded) {
                    paramsGroupById.filters = [{
                        field: 'beid',
                        value: row.entity.beid
                    }, {
                        field: 'groupId',
                        value: row.entity.groupId
                    }];
                    paramsGroupById.pageNo = 1;
                    paramsGroupById.roomId = row.entity.roomId;
                    paramsGroupById.deviceId = row.entity.deviceId;
                    paramsGroupById.beid = $scope.params.beid;
                    row.entity.subGridOptions.data = row.entity.deviceMonitorConfigList;
                    row.entity.editItem = function() {
                        edit(row.entity, 'addItem');
                    }
                } else {
                    paramsGroupById.pageNo = 1;
                    subGridOptions.data = [];
                }
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
                }, 400)
            });
        },
        columnDefs: [{
            field: 'deviceModel',
            displayName: '设备型号',
            cellTooltip: function(row, col) {
                return row.entity.deviceModel;
            }
        }, {
            field: 'deviceType',
            displayName: '设备类型',
            cellTooltip: function(row, col) {
                return row.entity.deviceType;
            },
            cellFilter: "deviceTypeList",
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: $scope.deviceTypeList
            },
        }, {
            field: 'netPort',
            displayName: '端口',
            cellTooltip: function(row, col) {
                return row.entity.netPort;
            }
        }, {
            field: 'deviceFactory',
            displayName: '设备厂商',
            cellTooltip: function(row, col) {
                return row.entity.deviceFactory;
            }
        }, {
            field: 'protocol',
            displayName: '设备协议名称',
            cellTooltip: function(row, col) {
                return row.entity.protocol;
            }
        }, {
            field: 'startBit',
            displayName: '串口开始位',
            visible: false,
            cellTooltip: function(row, col) {
                return row.entity.startBit;
            }
        }, {
            field: 'stopBit',
            displayName: '串口停止位',
            visible: false,
            cellTooltip: function(row, col) {
                return row.entity.stopBit;
            }
        }, {
            field: 'dataBit',
            displayName: '串口数据位',
            visible: false,
            cellTooltip: function(row, col) {
                return row.entity.dataBit;
            }
        }, {
            field: 'parityBit',
            displayName: '串口奇偶校验',
            visible: false,
            cellTooltip: function(row, col) {
                return row.entity.parityBit;
            }
        }, {
            field: 'baudRate',
            displayName: '传输速度',
            visible: false,
            cellTooltip: function(row, col) {
                return row.entity.baudRate;
            }
        }, {
            field: 'interfaceType',
            displayName: '接口类型',
            enableFiltering: true,
            visible: false,
            cellTooltip: function(row, col) {
                return row.entity.interfaceType;
            },
            cellFilter: 'interfaceTypeList',
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: $scope.interfaceTypeList
            },
        }, {
            'field': 'regOptId',
            displayName: '状态',
            enableFiltering: false,
            cellTemplate: '<div class="ui-grid-cell-contents" ><a ng-if="row.entity.checked===0" ></a><a  ng-if="row.entity.checked===1"  >启用中</a></div>',
        }, {
            'field': 'regOptId',
            displayName: '操作',
            enableFiltering: false,
            cellTemplate: '<div class="ui-grid-cell-contents" ><a ng-if="row.entity.checked===0" ng-click=grid.appScope.editCheckedFn(row)>启用</a><a  ng-if="row.entity.checked===1" class="forbid" ng-really-message="是否确定禁用?" confirm=grid.appScope.editCheckedFn(row)>禁用</a></div>',
        }]
    };
    var subGridOptions = {
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
        columnDefs: [{
            field: 'eventName',
            displayName: '监测项名称'
        }, {
            field: 'frequency',
            displayName: '频率'
        }, {
            field: 'precision',
            displayName: '精度'
        }, {
            field: 'max',
            displayName: '最大值'
        }, {
            field: 'min',
            displayName: '最小值'
        }, {
            field: 'iconId',
            displayName: '图标',
            cellTemplate: '<div class="ui-grid-cell-contents"><img style="width:15px;height:15px" ng-src="{{row.entity.iconId}}"  /> </div>'
        }, {
            field: 'amendFlag',
            displayName: '修订'
        }, {
            field: 'eventDesc',
            displayName: '描述'
        }, {
            field: 'mustShow',
            displayName: '是否展示'
        }, {
            field: 'units',
            displayName: '单位'
        }, {
            field: 'optional',
            displayName: '是否采集',
            cellTemplate: '<div class="ui-grid-cell-contents"><label class="diycheckbox "  ng-class="{\'diycheckbox-m\': row.entity.optional == \'M\'}"  name="upcolumn" title="必选"  ng-click=grid.appScope.updatacolumn(row,\'M\') ></label><label class="diycheckbox "  ng-class="{\'diycheckbox-o\': row.entity.optional == \'O\'}"  name="upcolumn" title="可选"  ng-click=grid.appScope.updatacolumn(row,\'O\') style="margin-left:20px;margin-right:20px"  ></label><label class="diycheckbox " ng-class="{\'diycheckbox-n\': row.entity.optional == \'\'}"  name="upcolumn" title="不选"  ng-click=grid.appScope.updatacolumn(row,\'\') ></label></div>'
        }, {
            'field': 'widthAndHeight',
            displayName: '图标宽高'
        }, {
            'field': 'la',
            displayName: '操作',
            cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click=grid.appScope.editItem(row.entity)>编辑</a><span ng-if="" >|</span><a ng-if=""  ng-really-message="是否确定删除?" ng-really-click=grid.appScope.delItem(row.entity)>删除</a></div>'
        }],
        onRegisterApi: function(gridApi) {
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                paramsGroupById.pageNo = newPage;
                paramsGroupById.pageSize = pageSize;
                // initGroupById();
            });
        }

    };
    $scope.refresh = function() {
        getOperaRoom();
    }

    function updatacolumn(row, args) {
        if (promise) {
            $timeout.cancel(promise);
        }
        promise = $timeout(function() {
            // if (row.entity.checked == 1) {
            //     $scope.params.checked = 0;
            // } else {
            //     $scope.params.checked = 1;
            // }
            $scope.params.deviceId = row.entity.deviceId;
            $scope.params.beid = row.entity.beid;
            $scope.params.optional = args;
            $scope.params.roomId = row.entity.roomId;
            $scope.params.eventId = row.entity.eventId;
            IHttp.post('basedata/saveBasDeviceMonitorConfig', $scope.params).then(function(rs) {
                if (rs.data.resultCode != 1) return;
                // getOperaRoom();
                // toastr.success(rs.data.resultMessage);
                row.entity.optional = args;
            });
        }, 400)
    }
    var getOperaRoom = function(args) {
        IHttp.post("basedata/queryBasDeviceListByBeid", $scope.params).then(function(data) {
            data = data.data.resultList;
            $scope.gridoperaRoom.totalItems = data.total;
            for (i = 0; i < data.length; i++) {
                data[i].subGridOptions = {
                    columnDefs: subGridOptions.columnDefs,
                    paginationPageSizes: [5, 10], // 配置每页行数可选参数
                    paginationPageSize: 5, // 每页默认显示行数
                    data: data[i].deviceMonitorConfigList,
                    disableRowExpandable: (data[i].checked === 0)
                }
            }
            $scope.gridoperaRoom.data = data;
            $scope.gridoperaRoom.totalItems = data.total;
        });
    }

    function initGroupById(row) {
        // paramsGroupById.deviceId = $scope.params.deviceId;
        // paramsGroupById.beid = $scope.params.beid;
        var result = [];
        // var start=paramsGroupById.pageNo==1?1:paramsGroupById.pageSize*paramsGroupById.pageNo+1;
        // var end=row.totalItems>(start+paramsGroupById.pageSize)?(start+paramsGroupById.pageSize):row.totalItems;
        var start = 1;
        var end = 3;
        for (var i = 0; i < row.length; i++) {
            if (i >= start && i <= end) {
                result.push(row[i])
            }
        }
        return result;
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
            var list = subGridOptions.data;
            for (var a = 0; a < list.length; a++) {
                if (list[a].id == entity.id) {
                    list.splice(a, 1);
                }
            }
        });
    }
    $scope.editCheckedFn = function(row) {
        if (promise) {
            $timeout.cancel(promise);
        }
        promise = $timeout(function() {
            if (row.entity.checked == 1) {
                $scope.params.checked = 0;
            } else {
                $scope.params.checked = 1;
            }
            $scope.params.basDeviceConfig = {};
            $scope.params.basDeviceConfig.deviceId = row.entity.deviceId;
            $scope.params.basDeviceConfig.beid = $scope.params.beid;
            IHttp.post('basedata/saveBeidDeviceConfig', $scope.params).then(function(rs) {
                if (rs.data.resultCode != 1) return;
                getOperaRoom();
            });
        }, 400)
    }

    function edit(entity, type) {
        var scope = $rootScope.$new();
        scope.item = {
            type: type,
            entity: entity
        };

        if (type == 'addItem')
        // scope.item.len = subGridOptions.data.length + 1;
            scope.item.title = "添加监测项";
        else if (type == 'editItem')
        // scope.item.len = subGridOptions.data.length;
            scope.item.title = "编辑监测项";

        var modalInstance = $uibModal.open({
            animation: true,
            template: require('./modal.html'),
            controller: require('./modal.controller'),
            backdrop: 'static',
            scope: scope
        });

        // modalInstance.result.then(function(data) {
        //     if (type == 'addGroup' || type == 'editGroup')
        //         initGroup();
        //     else
        //         initGroupById();
        // }, function(data) {
        //     //console.log(data)
        // });
    }

}
