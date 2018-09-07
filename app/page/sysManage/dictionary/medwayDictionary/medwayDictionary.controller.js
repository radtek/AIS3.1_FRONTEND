medwayDictionary.$inject = ['$rootScope', '$scope', 'IHttp', 'uiGridConstants', '$uibModal', '$timeout'];

module.exports = medwayDictionary;

function medwayDictionary($rootScope, $scope, IHttp, uiGridConstants, $uibModal, $timeout) {
    $scope.params = {
        pageNo: 1,
        pageSize: 15,
        sort: '',
        orderBy: '',
        filters: []
    };
    var promise;
    $scope.gridmedway = {
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
                getmedway();
            });
            //分页
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                $scope.params.pageNo = newPage;
                $scope.params.pageSize = pageSize;
                getmedway();
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
                    getmedway();
                }, 1000);
            });
        },
        columnDefs: [{
            field: 'code',
            displayName: '代码',
            cellTooltip: function(row, col) {
                return row.entity.code;
            }
        }, {
            field: 'name',
            displayName: '用药途径名',
            cellTooltip: function(row, col) {
                return row.entity.name;
            }
        }, {
            field: 'durable',
            displayName: '是否持续',
            cellTooltip: function(row, col) {
                return row.entity.durable;
            },
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [{
                    value: "1",
                    label: '是'
                }, {
                    value: "0",
                    label: '否'
                }, ]
            },
        }, {
            field: 'category',
            displayName: '分类',
            cellTooltip: function(row, col) {
                return row.entity.category;
            }
        }, {
            field: 'measureMode',
            displayName: '给药方式',
            cellTooltip: function(row, col) {
                return row.entity.measureMode;
            }
        }, {
            field: 'medTakeWayId',
            displayName: '操作',
            enableFiltering: false,
            enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents"><a href="" ng-click=grid.appScope.addMedway(row)>编辑</a></div>'
        }]
    };

    $scope.refresh = function() {
        getmedway();
    }

    var getmedway = function() {
        IHttp.post("basedata/queryMedicalTakeWayList", $scope.params).then(function(data) {
            data = data.data;
            $scope.gridmedway.totalItems = data.total;
            for (var i = 0; i < data.resultList.length; i++) {
                if (data.resultList[i].durable == "1") {
                    data.resultList[i].durable = "是";
                } else {
                    data.resultList[i].durable = "否";
                }
            }
            $scope.gridmedway.data = data.resultList;
        });
    }
    getmedway();

    $scope.addMedway = function(row) {
        var scope = $rootScope.$new();
        if (row === undefined) {
            scope.medTakeWayId = 0;
        } else {
            scope.medTakeWayId = row.entity.medTakeWayId;
        }
        $uibModal.open({
            animation: true,
            template: require('./editMedwayDictionary.html'),
            controller: require('./editMedwayDictionary.controller'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        }).result.then(function() {
            getmedway();
        });
    }
}
