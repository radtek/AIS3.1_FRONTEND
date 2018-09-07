anaesMethodDictionary.$inject = ['$rootScope', '$scope', 'IHttp', 'uiGridConstants', '$uibModal', '$timeout'];

module.exports = anaesMethodDictionary;

function anaesMethodDictionary($rootScope, $scope, IHttp, uiGridConstants, $uibModal, $timeout) {
    $scope.params = {
        pageNo: 1,
        pageSize: 15,
        sort: '',
        orderBy: '',
        filters: []
    };
    var promise;
    //麻醉方法
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
                getAnaesMethod();
            });
            //分页
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                $scope.params.pageNo = newPage;
                $scope.params.pageSize = pageSize;
                getAnaesMethod();
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
                    getAnaesMethod();
                }, 1000);
            });
        },
        columnDefs: [{
            field: 'name',
            displayName: '麻醉方法名',
            cellTooltip: function(row, col) {
                return row.entity.name;
            }
        }, {
            field: 'anesTypeName',
            displayName: '麻醉类型',
            cellTooltip: function(row, col) {
                return row.entity.anesTypeName;
            }
        }, {
            field: 'pinYin',
            displayName: '拼音码',
            cellTooltip: function(row, col) {
                return row.entity.pinYin;
            }
        }, {
            field: 'isValid',
            displayName: '状态',
            cellTooltip: function(row, col) {
                return row.entity.isValid;
            },
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
        }, {
            field: 'anaMedId',
            displayName: '操作',
            enableFiltering: false,
            enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents"><a href="" ng-click=grid.appScope.editAnaesMethod(row)>编辑</a></div>',
        }]
    };

    $scope.refresh = function() {
        getAnaesMethod();
    }

    var getAnaesMethod = function() {
        IHttp.post("basedata/queryAnaesMethodList", $scope.params).then(function(data) {
            data = data.data;
            $scope.gridOptions.totalItems = data.total;
            for (var i = 0; i < data.resultList.length; i++) {
                if (data.resultList[i].isValid == '1') {
                    data.resultList[i].isValid = '启用';
                } else {
                    data.resultList[i].isValid = '禁用';
                }

            }
            $scope.gridOptions.data = data.resultList;
        });
    }
    getAnaesMethod();

    $scope.editAnaesMethod = function(row) {
        var scope = $rootScope.$new();
        if (row === undefined) {
            scope.anaMedId = 0;
        } else {
            scope.anaMedId = row.entity.anaMedId;
        }
        $uibModal.open({
            animation: true,
            template: require('./editAnaesMethodDictionary.html'),
            controller: require('./editAnaesMethodDictionary.controller'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        }).result.then(function() {
            getAnaesMethod();
        });
    }
}
