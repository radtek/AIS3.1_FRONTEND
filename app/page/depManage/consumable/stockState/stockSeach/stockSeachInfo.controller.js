stockSeachInfoCtrl.$inject = ['$rootScope', '$scope', 'IHttp','i18nService','uiGridConstants','$timeout','toastr', '$uibModalInstance', 'select', '$filter', 'auth'];

module.exports = stockSeachInfoCtrl;

function stockSeachInfoCtrl($rootScope, $scope, IHttp,i18nService,uiGridConstants,$timeout,   toastr, $uibModalInstance, select, $filter, auth) {
    vm = this;
    vm.title="查看明细"; 
    i18nService.setCurrentLang('zh-cn');
    var promise;
    $scope.params = {
        pageNo: 1,
        pageSize: 15,
        orderBy: '',
        sort: '',
        filters: []
    };

    $scope.medicalParams={};   

    if ($scope.data.row) {
        vm.title="取耗材";
        $scope.medicalParams = $scope.data.row.entity;    
        $scope.params.filters=[{
            field: "instrumentId",
            value: $scope.medicalParams.instrumentId
        }];
        getPage();
    }

    $scope.gridOptions = {
        resizable: true,
        enableFiltering: false, // 过滤栏显示
        enableGridMenu: false, // 配置按钮显示
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: true, // 禁止内部过滤，启用外部滤波器监听事件
        useExternalSorting: true,
        showColumnFooter: true,
        useExternalPagination: true, // 分页
        paginationPageSizes: [ 15, 30, 50],
        rowHeight: 40,
        paginationPageSize: $scope.params.pageSize,
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                if (sortColumns.length === 0) {
                    $scope.params.orderBy = '';
                } else {
                    $scope.params.orderBy = sortColumns[0].sort.direction;
                    $scope.params.sort = sortColumns[0].colDef.field;
                }
                getPage();
            });
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                $scope.params.pageNo = newPage;
                $scope.params.pageSize = pageSize;
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
                    $scope.params.filters.splice(1, $scope.params.filters.length - 1, ...filterArr);
                    getPage();
                }, 1000)

            });
        },
        columnDefs: [{
                    field: 'instrumentName',
                    displayName: '耗材名称',         
                    cellTooltip: function(row, col) {
                        return row.entity.instrumentName;
                    }
                },
                //  {
                //     field: 'firm',
                //     displayName: '厂家名称',
                //     cellTooltip: function(row, col) {
                //         return row.entity.firm;
                //     }
                // },
                 {
                    field: 'spec',
                    displayName: '规格',
                    cellTooltip: function(row, col) {
                        return row.entity.spec;
                    }
                }, 
                {
                    field: 'batch',
                    displayName: '耗材批号', 
                    cellTooltip: function(row, col) {
                        return row.entity.batch;
                    }
                }, {
                    field: 'number',
                    displayName: '库存数量',
                    cellTooltip: function(row, col) {
                        return row.entity.number;
                    }
                }, {
                    field: 'productionTime',
                    displayName: '生产日期',
                    cellTooltip: function(row, col) {
                        return row.entity.productionTime;
                    }
                },  {
                    field: 'effectiveTime',
                    displayName: '有效日期',
                    cellTooltip: function(row, col) {
                        return row.entity.effectiveTime;
                    }
                }]
    };

    function getPage() {        
        IHttp.post('basedata/queryConsumablesList',$scope.params).then(function(rs) {
            // $scope.gridOptions.data = rs.data.searchRegOptByLoginNameAndStateFormBean;
            if (rs.status === 200 && rs.data.resultCode === '1') {
                $scope.gridOptions.totalItems = rs.data.total;
                var data=rs.data.resultList;
                    for (var i = 0; i <data.length; i++) {
                        if(data[i].effectiveTime){
                            data[i].effectiveTime=$filter('date')(data[i].effectiveTime, 'yyyy-MM-dd HH:mm');
                        }
                    }
                $scope.gridOptions.data = data;
            }
        });
    }

    vm.close = function() {
        $uibModalInstance.close('cancel');
    }
   
}
