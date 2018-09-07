instrumentDictionary.$inject = ['$rootScope', '$scope', 'IHttp', 'uiGridConstants', '$uibModal', '$timeout'];

module.exports = instrumentDictionary;

function instrumentDictionary($rootScope, $scope, IHttp, uiGridConstants, $uibModal, $timeout) {
    $scope.params = {
        pageNo: 1,
        pageSize: 15,
        sort: '',
        orderBy: '',
        filters: []
    };
    var promise;
    //器械库
    $scope.InstrumentList = {
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
            $scope.gridApi = gridApi;
            //排序
            $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                if (sortColumns.length === 0) {
                    $scope.params.orderBy = '';
                } else {
                    $scope.params.orderBy = sortColumns[0].sort.direction;
                    $scope.params.sort = sortColumns[0].colDef.field;
                }
                // getInstrument();
            });
            //分页
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                $scope.params.pageNo = newPage;
                $scope.params.pageSize = pageSize;
                getInstrument();
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
                    getInstrument();
                }, 1000);
            });
        },
        columnDefs: [{
            field: 'name',
            displayName: '器械名称',
            cellTooltip: function(row, col) {
                return row.entity.name;
            }
        }, {
            field: 'code',
            displayName: '代码',
            cellTooltip: function(row, col) {
                return row.entity.code;
            }
        }, {
            field: 'pinYin',
            displayName: '拼音码',
            cellTooltip: function(row, col) {
                return row.entity.pinYin;
            }
        }, {
            field: 'enable',
            displayName: '状态',
            cellTooltip: function(row, col) {
                return row.entity.enable;
            },
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
            field: 'instrumentId',
            displayName: '操作',
            enableFiltering: false,
            enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents"><a href="" ng-click=grid.appScope.editInstrument(row)>编辑</a></div>'
        }]
    };

    var getInstrument = function() {
        IHttp.post("basedata/queryInstrumentList", $scope.params).then(function(data) {
            data = data.data;
            $scope.InstrumentList.totalItems = data.total;
            for (var i = 0; i < data.resultList.length; i++) {
                if (data.resultList[i].enable == '1') {
                    data.resultList[i].enable = '启用';
                } else {
                    data.resultList[i].enable = '禁用';
                }
            }
            $scope.InstrumentList.data = data.resultList;
        });
    }
    getInstrument();

    $scope.refresh = function() {
        getInstrument();
    }

    //编辑器械库
    $scope.editInstrument = function(row) {
        var scope = $rootScope.$new();
        if (row === undefined) {
            scope.instrumentId = 0;
        } else {
            scope.instrumentId = row.entity.instrumentId;
        }
        $uibModal.open({
            animation: true,
            template: require('./editInstrumentDictionary.html'),
            controller: require('./editInstrumentDictionary.controller'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        }).result.then(function() {
            getInstrument();
        });
    }
}
