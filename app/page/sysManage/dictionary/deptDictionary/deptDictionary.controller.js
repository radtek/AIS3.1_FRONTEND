deptDictionary.$inject = ['$rootScope', '$scope', 'IHttp', 'uiGridConstants', '$uibModal', '$timeout'];

module.exports = deptDictionary;

function deptDictionary($rootScope, $scope, IHttp, uiGridConstants, $uibModal, $timeout) {
    $scope.params = {
        pageNo: 1,
        pageSize: 15,
        sort: '',
        orderBy: '',
        filters: []
    };
    var promise;
    //科室
    $scope.gridOptions = {
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
                getPage();
            });
            //分页
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                $scope.params.pageNo = newPage;
                $scope.params.pageSize = pageSize;
                getPage();
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
                    getPage();
                }, 1000);
            });
        },
        columnDefs: [{
            field: 'name',
            displayName: '科室名称',
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
                }]
            }
        }, {
            field: 'regOptId',
            displayName: '操作',
            enableFiltering: false,
            cellTemplate: '<div class="ui-grid-cell-contents" ><a href="" ng-click=grid.appScope.editDept(row)>编辑</a><span></div>'
        }]
    };

    $scope.refresh = function() {
        getPage();
    }

    $scope.editDept = function(row) {
        var scope = $rootScope.$new();
        if (row === undefined) {
            scope.deptId = 0;
        } else {
            scope.deptId = row.entity.deptId;
        }
        $uibModal.open({
            animation: true,
            template: require('./editDeptDictionary.html'),
            controller: require('./editDeptDictionary.controller'),
            controllerAs: 'vm',
            backdrop:'static',
            scope: scope
        }).result.then(function() {
        	getPage();
        });
    }
    var getPage = function() {
        IHttp.post("basedata/queryDeptList", $scope.params).then(function(data) {
        	data = data.data;
            $scope.gridOptions.totalItems = data.total;
            for (var i = 0; i < data.resultList.length; i++) {
                if (data.resultList[i].enable === 1) {
                    data.resultList[i].enable = '启用';
                } else {
                    data.resultList[i].enable = '禁用';
                }
            }
            $scope.gridOptions.data = data.resultList;
        });
    }
    getPage();
}
