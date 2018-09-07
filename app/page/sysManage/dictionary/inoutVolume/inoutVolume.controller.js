inoutVolume.$inject = ['$rootScope', '$scope', 'IHttp', 'uiGridConstants', '$uibModal', 'confirm', 'toastr', '$timeout'];

module.exports = inoutVolume;

function inoutVolume($rootScope, $scope, IHttp, uiGridConstants, $uibModal, confirm, toastr, $timeout) {
	$scope.params = {
        pageNo: 1,
        pageSize: 15,
        sort: '',
        orderBy: '',
        filters: []
    };
    var promise;
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
                }, 2000);
            });
        },
        columnDefs: [{
            field: 'code',
            displayName: '代码',
            cellTooltip: function(row, col) {
                return row.entity.code;
            }
        }, {
            field: 'typeStr',
            displayName: '类型',
            cellTooltip: function(row, col) {
                return row.entity.typeStr;
            }
        }, {
            field: 'subType',
            displayName: '子类型',
            cellTooltip: function(row, col) {
                return row.entity.subType;
            }
        }, {
            field: 'name',
            displayName: '名称',
            cellTooltip: function(row, col) {
                return row.entity.name;
            }
        }, {
            field: 'briefName',
            displayName: '简称',
            cellTooltip: function(row, col) {
                return row.entity.briefName;
            }
        }, {
            field: 'enable',
            displayName: '是否可用',
            cellTooltip: function(row, col) {
                return row.entity.enable;
            },
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [{
                    value: "1",
                    label: '是'
                }, {
                    value: "0",
                    label: '否'
                }]
            }
        }, {
            field: 'spec',
            displayName: '规格',
            cellTooltip: function(row, col) {
                return row.entity.spec;
            }
        }, {
            field: 'unit',
            displayName: '单位',
            cellTooltip: function(row, col) {
                return row.entity.unit;
            }
        }, {
            field: 'dosageUnit',
            displayName: '剂量单位',
            cellTooltip: function(row, col) {
                return row.entity.dosageUnit;
            }
        }, {
            field: 'ioDefId',
            displayName: '操作',
            enableFiltering: false,
            enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents"><a href="" ng-click=grid.appScope.editInOutVolume(row)>编辑</a><span></div>',
        }],
        data: []
    };

    $scope.editInOutVolume = function(row) {
        var scope = $rootScope.$new();
        if (row === undefined) {
            scope.ioDefId = 0;
        } else {
            scope.ioDefId = row.entity.ioDefId;
        }
        $uibModal.open({
            animation: true,
            template: require('./editInoutVolume.html'),
            controller: require('./editInoutVolume.controller'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        }).result.then(function() {
            getPage();
        });
    }

    $scope.refresh = function() {
        getPage();
    }

    var getPage = function() {
        IHttp.post("basedata/queryIoDefinationList", $scope.params).then(function(data) {
        	data = data.data;
            $scope.gridOptions.totalItems = data.total;
            for (var i = 0; i < data.resultList.length; i++) {
                if (data.resultList[i].type == 'I') {
                    data.resultList[i].typeStr = '入量';
                } else {
                    data.resultList[i].typeStr = '出量';
                }
                if (data.resultList[i].subType == '1') {
                    data.resultList[i].subType = '输液';
                } else {
                    data.resultList[i].subType = '输血';
                }
                if (data.resultList[i].enable == '1') {
                    data.resultList[i].enable = '是';
                } else {
                    data.resultList[i].enable = '否';
                }
            }
            $scope.gridOptions.data = data.resultList;
        });
    }
    getPage();
}
