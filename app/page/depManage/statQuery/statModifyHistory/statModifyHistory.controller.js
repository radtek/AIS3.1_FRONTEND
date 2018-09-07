StatModifyHistoryCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'uiGridConstants', '$timeout', 'toastr', '$filter'];

module.exports = StatModifyHistoryCtrl;

function StatModifyHistoryCtrl($rootScope, $scope, IHttp, uiGridConstants, $timeout, toastr, $filter) {
    var page = $rootScope.$state.current.name,
        tempHtml = '<div class="ui-grid-cell-contents"><a ng-click=grid.appScope.query(row.entity)>查看</a><span>|</span><a ng-click=grid.appScope.edit(row.entity)>编辑</a><span>|</span><a ng-click=grid.appScope.cancel(row.entity)>取消</a></div>',
        params = {
            pageNo: 1,
            pageSize: 15,
            sort: '',
            orderBy: '',
            filters: [],
            state: '01,02,08'
        },
        promise;

    $scope.eConfig = {
        dataLoaded: true,
        resize: true
    };

    $scope.gridOptions = {
        enableFiltering: true, // 过滤栏显示
        enableGridMenu: true, // 配置按钮显示
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: true, // 禁止内部过滤，启用外部滤波器监听事件
        useExternalSorting: true,
        useExternalPagination: true, // 分页
        paginationPageSizes: [15, 30, 50],
        rowHeight: 40,
        paginationCurrentPage: params.pageNo,
        paginationPageSize: params.pageSize,
        exporterCsvFilename: '修改痕迹统计.csv',
        exporterOlderExcelCompatibility: true,
        onRegisterApi: function(gridApi) {
            $scope.gridApis = gridApi;
            gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                if (sortColumns.length === 0) {
                    params.orderBy = '';
                } else {
                    params.orderBy = sortColumns[0].sort.direction;
                    params.sort = sortColumns[0].colDef.field;
                }
                initPage();
            });
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                params.pageNo = newPage;
                params.pageSize = pageSize;
                initPage();
            });
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
                    initPage();
                }, 1000)
            });
        },
        columnDefs: [{
            field: 'name',
            displayName: '姓名',
            width: 110,
            cellTooltip: function(row, col) {
                return row.entity.name;
            }
        }, {
            field: 'hid',
            displayName: '住院号',
            width: 95,
            cellTooltip: function(row, col) {
                return row.entity.hid;
            }
        }, {
            field: 'operaDate',
            displayName: '手术日期',
            width: 105,
            cellTooltip: function(row, col) {
                return row.entity.operaDate;
            }
        }, {
            field: 'operRoomName',
            displayName: '手术室',
            width: 90,
            cellTooltip: function(row, col) {
                return row.entity.operRoomName;
            }
        }, {
            field: 'pcs',
            displayName: '台次',
            width: 75,
            cellTooltip: function(row, col) {
                return row.entity.pcs;
            }
        }, {
            field: 'operModule',
            displayName: '所属模块',
            width: 100,
            cellTooltip: function(row, col) {
                return row.entity.operModule;
            }
        }, {
            field: 'modProperty',
            displayName: '属性值',
            cellTooltip: function(row, col) {
                return row.entity.modProperty;
            }
        }, {
            field: 'oldValue',
            displayName: '修改前值',
            width: 80,
            cellTooltip: function(row, col) {
                return row.entity.oldValue;
            }
        }, {
            field: 'newValue',
            displayName: '修改后值',
            width: 80,
            cellTooltip: function(row, col) {
                return row.entity.newValue;
            }
        }, {
            field: 'modifyDate',
            displayName: '修改时间',
            width: 150,
            cellTooltip: function(row, col) {
                return row.entity.modifyDate;
            }
        }, {
            field: 'operId',
            displayName: '操作员',
            width: 150,
            cellTooltip: function(row, col) {
                return row.entity.operId;
            }
        }, {
            field: 'ip',
            displayName: '操作IP',
            width: 120,
            cellTooltip: function(row, col) {
                return row.entity.ip;
            }
        }, {
        	field: 'remark',
        	displayName: '备注',
            cellTooltip: function(row, col) {
                return row.entity.remark;
            }
        }]
    };

    initPage();
    function initPage() {
        IHttp.post('operation/queryEvtAnaesModifyRecordList', params).then((rs) => {
            if(rs.data.resultCode != 1) return;
            rs.data.resultList.forEach((item) => {
            	item.modifyDate = $filter('date')(item.modifyDate, 'yyyy-MM-dd HH:mm')
            });
            $scope.gridOptions.data = rs.data.resultList;
            $scope.gridOptions.totalItems = rs.data.total;
        })
    }

    // 编辑
    $scope.edit = function(row) {
        $rootScope.$state.go('editOperDateil', { });
    }

    // 查看
    $scope.query = function(row) {
        $rootScope.$state.go('preOperDateil', { });
    }

    $scope.$on('export', () => {
        params.pageSize = $scope.gridOptions.totalItems;
        initPage();
        setTimeout(function(){
            $scope.gridApis.exporter.csvExport('all','visible');//导出所有的行和显示的列
            pagesize = 15;
        },1000); 
    })

    // 打印
    $scope.print = function(row) { }

    // 取消
    $scope.cancel = function(row) { }

    // $scope.$on('query', function(ev, data) {
    // 	for(var item in data) {
    // 		params.filters.push({
    // 			field: item,
    // 			value: data[item] ? data[item] : ''
    // 		})
    // 	}
    // 	initPage();
    // });

    // $scope.$emit('childInited');
}