AnesRegistCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$filter', 'i18nService', '$state', 'uiGridConstants', '$timeout', 'toastr'];

module.exports = AnesRegistCtrl;

function AnesRegistCtrl($rootScope, $scope, IHttp, $filter, i18nService, $state, uiGridConstants, $timeout, toastr) {
    $scope.queryObj = {
        startTime: '',
        endTime: ''
    }

    $scope.params = {
        pageNo: 1,
        pageSize: 15,
        filters: [
            { field: 'startTime', value: $scope.queryObj.startTime },
            { field: 'endTime', value: $scope.queryObj.endTime }
        ]
    };
    $scope.gridOptions = {
        enableFiltering: true, //  表格过滤栏
        enableGridMenu: true, //表格配置按钮
        paginationPageSizes: [15, 30, 50],
        rowHeight: 40,
        paginationPageSize: $scope.params.pageSize,
        enableColumnMenus: false, //表头列的菜单按钮，默认false
        useExternalFiltering: true, // 过滤的搜索
        useExternalPagination: true, // 分页
        useExternalSorting: true,
        exporterCsvFilename: '麻醉登记.csv',
        exporterOlderExcelCompatibility: true,
        exporterFieldCallback: function(grid, row, col, value) { //全部列字符串化
            return "\t" + value;
        },
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
            gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                if (sortColumns.length === 0) {
                    $scope.params.orderBy = '';
                } else {
                    $scope.params.orderBy = sortColumns[0].sort.direction;
                    $scope.params.sort = sortColumns[0].colDef.field;
                }
                $scope.getPage();
            });
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                $scope.params.pageNo = newPage;
                $scope.params.pageSize = pageSize;
                $scope.getPage();
            });
            gridApi.core.on.filterChanged($scope, function() {
                $scope.grid = this.grid;
                var filterArr = [];
                $timeout(function() {
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
                            filterArr.push({ field: 'startTime', value: $scope.queryObj.startTime });
                            filterArr.push({ field: 'endTime', value: $scope.queryObj.endTime });
                        }
                    });
                    $scope.params.filters = filterArr;
                    $scope.getPage();
                }, 1000);
            });
        },
        columnDefs: [{
            field: 'name',
            displayName: '姓名',
            cellTooltip: function(row, col) {
                return row.entity.name;
            }
        }, {
            field: 'sex',
            displayName: '性别',
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [{
                    value: '男',
                    label: '男'
                }, {
                    value: '女',
                    label: '女'
                }]
            },
            cellTooltip: function(row, col) {
                return row.entity.sex;
            }
        }, {
            field: 'age',
            displayName: '年龄',
            cellTooltip: function(row, col) {
                return row.entity.age;
            }
        }, {
            field: 'hid',
            displayName: '住院号',
            cellTooltip: function(row, col) {
                return row.entity.hid;
            }
        }, {
            field: 'operaDate',
            displayName: '手术时间',
            cellTooltip: function(row, col) {
                return row.entity.operaDate;
            }
        }, {
            field: 'optLatterDiag',
            displayName: '诊断名称',
            cellTooltip: function(row, col) {
                return row.entity.optLatterDiag;
            }
        }, {
            field: 'optRealOper',
            displayName: '手术名称',
            cellTooltip: function(row, col) {
                return row.entity.optRealOper;
            }
        }, {
            field: 'realAnaesMethod',
            displayName: '麻醉方法',
            cellTooltip: function(row, col) {
                return row.entity.realAnaesMethod;
            }
        }, {
            field: 'operStartTime',
            displayName: '手术开始时间',
            cellTooltip: function(row, col) {
                return row.entity.operStartTime;
            }
        }, {
            field: 'operEndTime',
            displayName: '手术结束时间',
            cellTooltip: function(row, col) {
                return row.entity.operEndTime;
            }
        }, {
            field: 'operTime',
            displayName: '手术时长',
            cellTooltip: function(row, col) {
                return row.entity.operTime;
            }
        }, {
            field: 'anaesStartTime',
            displayName: '麻醉开始时间',
            cellTooltip: function(row, col) {
                return row.entity.anaesStartTime;
            }
        }, {
            field: 'anaesTime',
            displayName: '麻醉时长',
            enableFiltering: false,
            cellTooltip: function(row, col) {
                return row.entity.anaesTime;
            }
        }, {
            field: 'anaesDoc',
            displayName: '麻醉医生',
            cellTooltip: function(row, col) {
                return row.entity.anaesDoc;
            }
        }, {
            field: 'shiftAnaesDoc',
            displayName: '接班医师',
            cellTooltip: function(row, col) {
                return row.entity.shiftAnaesDoc;
            }
        }]
    };

    $scope.getwcsRow = function(row, docname) {
        return row.entity["'" + docname + "'"].split(',')[1];
    };

    $scope.getcsRow = function(row, docname) {
        return row.entity["'" + docname + "'"].split(',')[0];
    };

    $scope.getPage = function() {
        if (new Date($scope.queryObj.startTime) > new Date($scope.queryObj.endTime)) {
            toastr.warning('开始时间不能大于结束时间！');
            initQueryObj();
            return;
        }
        for (var i = 0; i < $scope.params.filters.length; i++) {
            if ($scope.params.filters[i].field === 'startTime') {
                $scope.params.filters[i].value = $scope.queryObj.startTime;
            }
            if ($scope.params.filters[i].field === 'endTime') {
                $scope.params.filters[i].value = $scope.queryObj.endTime;
            }
        }
        IHttp.post('statistics/searchAnaesRegInfoList', $scope.params).then((rs) => {
            if (rs.status === 200 && rs.data.resultCode === '1') {
                $scope.gridOptions.totalItems = rs.data.total;
                $scope.gridOptions.data = rs.data.anaesRegInfoList;
            }
        });
    }



    initQueryObj();

    function initQueryObj() {
        let endD = $filter('date')(new Date(), 'yyyy-MM-dd');
        let startD = new Date(endD);
        $scope.queryObj = {
            startTime: $filter('date')(startD.setMonth(startD.getMonth() - 6), 'yyyy-MM-dd'),
            endTime: endD
        };
        $scope.getPage();
    }
    $scope.exporter = function() {
        var pageNo=angular.copy($scope.params.pageNo);
        $scope.params.pageNo=1;
        $scope.params.pageSize = $scope.gridOptions.totalItems;
        $scope.getPage();
        setTimeout(function() {
            $scope.gridApi.exporter.csvExport('all', 'visible'); //导出所有的行和显示的列
            $scope.params.pageNo=pageNo;
            $scope.params.pageSize = 15;
            $scope.getPage();
        }, 1000);
    }
}