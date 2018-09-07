HospitalCtrl.$inject = ['$rootScope', '$scope', 'auth', '$filter', 'i18nService', '$uibModal', 'uiGridConstants', '$timeout', 'toastr', 'IHttp'];

module.exports = HospitalCtrl;

function HospitalCtrl($rootScope, $scope, auth, $filter, i18nService, $uibModal, uiGridConstants, $timeout, toastr, IHttp) {
    var vm = this;
    i18nService.setCurrentLang('zh-cn');
    var promise;
    $scope.date = $filter('date')(new Date(), 'yyyy/MM/dd HH:mm:ss');
    $scope.params = {
        timestamp: $scope.date,
        pageNo: 1,
        pageSize: 15,
        sort: '',
        orderBy: '',
        filters: [],
    };
    $scope.gridOptions = {
        enableFiltering: true, // 过滤栏显示
        enableGridMenu: true, // 配置按钮显示
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: true, // 使用外部过滤
        useExternalPagination: true, // 使用外部分页
        useExternalSorting: true, // 使用外部排序
        paginationPageSizes: [15, 30, 50], // 配置每页行数可选参数
        rowHeight: 40,
        paginationPageSize: $scope.params.pageSize, // 每页默认显示行数 
        expandableRowTemplate: require('./expand.html'),
        expandableRowHeight: 222,
        expandableRowScope: {
            editItem: function(row, args) {
                if (args == 1) {
                    edit(row, 1);
                } else {
                    edit(row, 'editItem');
                }
            },
            delItem: function(row) {
                delItem(row);
            },
            updatacolumn: function(row, args) {
                updatacolumn(row, args);
            }
        }
    };
    $scope.interfaceTypeList = [{
        value: 1,
        label: 'TCP'
    }, {
        value: 2,
        label: '串口'
    }, {
        value: 3,
        label: 'UDP'
    }, {
        value: 4,
        label: '组播'
    }, {
        value: 5,
        label: 'TCP Server'
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
    $scope.gridOptions.columnDefs = [{
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
        cellTooltip: function(row, col) {
            return row.entity.startBit;
        }
    }, {
        field: 'stopBit',
        displayName: '串口停止位',
        cellTooltip: function(row, col) {
            return row.entity.stopBit;
        }
    }, {
        field: 'dataBit',
        displayName: '串口数据位',
        cellTooltip: function(row, col) {
            return row.entity.dataBit;
        }
    }, {
        field: 'parityBit',
        displayName: '串口奇偶校验',
        cellTooltip: function(row, col) {
            return row.entity.parityBit;
        }
    }, {
        field: 'baudRate',
        displayName: '传输速度',
        cellTooltip: function(row, col) {
            return row.entity.baudRate;
        }
    }, {
        field: 'interfaceType',
        displayName: '接口类型',
        enableFiltering: true,
        cellTooltip: function(row, col) {
            return row.entity.interfaceType;
        },
        cellFilter: 'interfaceTypeList',
        filter: {
            type: uiGridConstants.filter.SELECT,
            selectOptions: $scope.interfaceTypeList
        },
    }, {
        field: 'regOptId',
        displayName: '操作',
        width: 150,
        enableFiltering: false,
        cellTemplate: '<div class="ui-grid-cell-contents" ><a  ng-click=grid.appScope.editmonitor(row)>采集项</a><span>&nbsp|&nbsp<a  ng-click=grid.appScope.edit(row)>编辑</a><span>&nbsp|&nbsp</span><a  ng-really-message="是否确定删除?" ng-really-click=grid.appScope.del(row.entity)>删除</a></div>',
    }];
    var paramsGroupById = {
        "pageNo": 1,
        "pageSize": 5,
        "sort": "",
        "orderBy": "",
        "filters": []
    };
    var subGridOptions = {
        enableSorting: false,
        enableFiltering: false, // 过滤栏显示
        enableGridMenu: false, // 配置按钮显示
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: false, // 使用外部过滤
        useExternalSorting: false, // 使用外部排序
        paginationPageSizes: [5, 10], // 配置每页行数可选参数
        paginationPageSize: 5, // 每页默认显示行数      
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
            field: 'paraId',
            displayName: '采集ID配置',
            cellTemplate: '<div > <input type="text"  ng-change="grid.appScope.updatacolumn(row,1)" ng-model="row.entity.paraId" style="border:0;background-color:transparent;height:40px;text-align:center" /> </div>',
            cellTooltip: function(row, col) {
                return row.entity.taskGroup;
            }
        }, {
            field: 'paraName',
            displayName: '采集名称配置',
            cellTemplate: '<div > <input type="text"  ng-change="grid.appScope.updatacolumn(row,2)" ng-model="row.entity.paraName" style="border:0;background-color:transparent;height:40px;text-align:center" /> </div>',
            cellTooltip: function(row, col) {
                return row.entity.taskGroup;
            }
        }, {
            'field': 'la',
            displayName: '操作',
            width: 200,
            cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click=grid.appScope.editItem(row,1)>应用局点</a><span >&nbsp|&nbsp</span><a ng-click=grid.appScope.editItem(row)>编辑</a><span ng-if="" >|</span><a ng-if=""  ng-really-message="是否确定删除?" ng-really-click=grid.appScope.delItem(row.entity)>删除</a></div>'
        }]
    };

    function updatacolumn(row, args) {
        if (promise) {
            $timeout.cancel(promise);
        }
        promise = $timeout(function() {
            if (typeof args == "string") {
                $scope.params.optional = args;
                $scope.params.paraId = row.entity.paraId;
                $scope.params.paraName = row.entity.paraName;
            }
            if (typeof args == "number") {
                $scope.params.paraId = row.entity.paraId;
                $scope.params.paraName = row.entity.paraName;
                $scope.params.optional = row.entity.optional;
            }
            $scope.params.deviceId = row.entity.deviceId;
            $scope.params.beid = row.entity.beid;
            $scope.params.roomId = row.entity.roomId;
            $scope.params.eventId = row.entity.eventId;
            IHttp.post('basedata/saveBasDeviceMonitorConfig', $scope.params).then(function(rs) {
                if (rs.data.resultCode != 1) return;
                toastr.success(rs.data.resultMessage);
                getGroupList(row)
            });
        }, 400)
    }
    $scope.gridOptions.onRegisterApi = function(gridApi) {
        $scope.gridApi = gridApi;
        //排序
        $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
            if (sortColumns.length === 0) {
                $scope.params.orderBy = '';
            } else {
                $scope.params.orderBy = sortColumns[0].sort.direction;
                $scope.params.sort = sortColumns[0].colDef.field;
            }
            getList();
        });
        //分页
        gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
            $scope.params.pageNo = newPage;
            $scope.params.pageSize = pageSize;
            getList();
        });
        //过滤
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
                    if (!!value) {
                        filterArr.push({
                            field: fieldName,
                            value: value
                        });
                    }
                });
                $scope.params.filters = filterArr;
                getList();
            }, 2000)
        });
        // 状态变化前 控制只能展开一个
        gridApi.expandable.on.rowExpandedBeforeStateChanged($scope, function(row) {
            if (!row.isExpanded) {
                // paramsGroupById.pageNo = 1;
                gridApi.expandable.collapseAllRows();
            }
        });
        // 展开 内部grid
        gridApi.expandable.on.rowExpandedStateChanged($scope, function(row) {
            if (row.isExpanded) {
                getGroupList(row);
            } else {
                paramsGroupById.pageNo = 1;
                subGridOptions.data = [];
            }
        });
    };
    var getGroupList = function(row) {
        row.entity.subGridOptions = subGridOptions;
        paramsGroupById.pageNo = 1;
        paramsGroupById.roomId = "";
        paramsGroupById.beid = "0";
        paramsGroupById.deviceId = row.entity.deviceId;
        IHttp.post('basedata/getDeviceMonitorConfigListByBeidDeviceId', paramsGroupById)
            .then(
                function(rs) {
                    var data = rs.data;
                    if (data.resultCode === "1") {
                        row.entity.subGridOptions.data = data.resultList;
                        row.entity.subGridOptions.totalItems = data.total;
                    }
                }
            );
    }
    var getList = function() {
        IHttp.post('basedata/queryDeviceSpecificationList', $scope.params)
            .then(
                function(rs) {
                    var data = rs.data;
                    if (data.resultCode === "1") {
                        $scope.gridOptions.data = data.resultList;
                        $scope.gridOptions.totalItems = data.total;
                    }
                }
            );
    }
    getList();
    $scope.del = function(row) {
        var obj = row;
        IHttp.post('basedata/delDeviceSpecification', obj).then(function(rs) {
            var data = rs.data;
            if (data.resultCode === '1') {
                getList();
                toastr.info("删除成功！");
            }
        });
    }

    $scope.setCurr = function(row) {
        if ($rootScope.permission.indexOf('UPD') === -1) {
            toastr.error("对不起，您没有权限。");
            return;
        }
        var obj = row.entity;
        //if (confirm("你确定要标记删除此设备吗？")) {
        IHttp.post('sys/setCurBe', obj).then(function(rs) {
            var data = rs.data;
            if (data.resultCode === '1') {
                getList();
                toastr.info("设置当前局点成功！");
            }
        });
    }

    $scope.edit = function(row) {
        var scope = $rootScope.$new();
        if (row != undefined) {
            scope.item = angular.extend({}, row.entity);
        } else if ($rootScope.permission.indexOf('UPD') === -1) {
            // toastr.error("对不起，您没有权限。");
            // return;
        }
        var transferrModal = $uibModal.open({
            animation: true,
            backdrop: 'static',
            template: require('./hospitaldialog.html'),
            controller: require('./hospitaldialog.controller'),
            controllerAs: 'vm',
            scope: scope
        });
        transferrModal.result.then(function(data) {
            getList();
        }, function() {});
    }
    $scope.editmonitor = function(row) {
        var scope = $rootScope.$new();
        row.entity.subGridOptions = subGridOptions;
        paramsGroupById.pageNo = 1;
        paramsGroupById.roomId = "";
        paramsGroupById.beid = "0";
        paramsGroupById.deviceId = row.entity.deviceId;
        IHttp.post('basedata/getDeviceMonitorConfigListByBeidDeviceId', paramsGroupById)
            .then(
                function(rs) {
                    var data = rs.data;
                    if (data.resultCode === "1") {
                        row.entity.subGridOptions.data = data.resultList;
                        row.entity.subGridOptions.totalItems = data.total;
                        if (row.entity.subGridOptions.data != undefined) {
                            scope.item = angular.extend({}, row.entity);
                        } else {
                            // alert(888)
                        }
                        var transferrModal = $uibModal.open({
                            animation: true,
                            backdrop: 'static',
                            template: require('./editmonitordialog.html'),
                            controller: require('./editmonitordialog.controller'),
                            controllerAs: 'vm',
                            scope: scope
                        });
                        transferrModal.result.then(function(data) {
                            // getList();
                        }, function() {
                            getGroupList(row);
                        });
                    }
                }
            );

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
        else if (type == 1)
        // scope.item.len = subGridOptions.data.length;
            scope.item.title = "应用到局点";
        if (type == "editItem") {
            var modalInstance = $uibModal.open({
                animation: true,
                template: require('./modal.html'),
                controller: require('./modal.controller'),
                backdrop: 'static',
                scope: scope
            });
        }
        if (type == 1) {
            var entity = scope.item.entity.entity;
            if (!entity.paraId || !entity.paraName) {
                toastr.error("采集ID或名称配置不能为空")
                return;
            }
            init();
            function init() {
                IHttp.post('basedata/queryBusEntityListByDeviceIdAndEventId', scope.item.entity.entity).then(function(rs) {
                    if (rs.data.resultCode != 1) return;
                    if (rs.data.resultList.length==0) {
                        toastr.error("无应用局点");
                        return;
                    }
                    var modalInstance = $uibModal.open({
                        animation: true,
                        template: require('./modal2.html'),
                        controller: require('./modal2.controller'),
                        backdrop: 'static',
                        scope: scope
                    });
                })
            }
        }

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
