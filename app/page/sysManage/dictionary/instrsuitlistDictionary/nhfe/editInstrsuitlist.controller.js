editInstrumentDictionary.$inject = ['$scope', 'IHttp', '$uibModalInstance', '$timeout', 'confirm', 'toastr', 'uiGridConstants'];

module.exports = editInstrumentDictionary;

function editInstrumentDictionary($scope, IHttp, $uibModalInstance, $timeout, confirm, toastr, uiGridConstants) {
    let parent = $scope.$parent;
    if (parent.code === 'qx')
        $scope.lable = '新增器械';
    else
        $scope.lable = '新增敷料';
    $scope.params = {
        pageNo: 1,
        pageSize: 15,
        sort: '',
        orderBy: '',
        filters: [{
            field: "enable",
            value: "1"
        }]
    };
    var promise;
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
            //排序
            gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                if (sortColumns.length === 0) {
                    $scope.params.orderBy = '';
                } else {
                    $scope.params.orderBy = sortColumns[0].sort.direction;
                    $scope.params.sort = sortColumns[0].colDef.field;
                }
                getInstrument();
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
            visible: false,
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
                }, ]
            },
        }, {
            field: 'instrumentId',
            displayName: '添加数量',
            enableFiltering: false,
            enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents"><input type="number" min="0" ng-model="number" ng-change="grid.appScope.changeNum(row, number)"></div>',
        }]
    };

    var getInstrument = function() {
        IHttp.post("basedata/queryInstrumentList", $scope.params).then(function(data) {
            data = data.data;
            var list = [];
            $scope.InstrumentList.totalItems = data.total;
            for (var i = 0; i < data.resultList.length; i++) {
                if (data.resultList[i].enable == '1') {
                    data.resultList[i].enable = '启用';
                    list.push(data.resultList[i]);
                }
            }
            $scope.InstrumentList.data = list;
        });
    }
    getInstrument();

    $scope.instru = [];
    $scope.changeNum = function(row, number) {
        row.entity.amount = number;
        if ($scope.instru.length === 0) {
            $scope.instru.push(row.entity);
        } else {
            for (var i = 0; i < $scope.instru.length; i++) {
                if ($scope.instru[i].instrumentId === row.entity.instrumentId) {
                    $scope.instru[i].amount = row.entity.amount;
                    return;
                } else if (i + 1 === $scope.instru.length) {
                    $scope.instru.push(row.entity);
                }
            }
        }
    }

    $scope.save = function() {
        if ($scope.datas.length === 0) {
            for (var i = $scope.instru.length - 1; i >= 0; i--) {
                $scope.datas.push($scope.instru[i]);
                $scope.instru.pop();
            }
        } else {
            var len = $scope.instru.length - 1;
            while (len >= 0) {
                for (var i = 0, k = 1; i < $scope.datas.length; i++) {
                    if (len < 0) {
                        $uibModalInstance.close();
                        return;
                    } else if ($scope.datas[i].instrumentId === $scope.instru[len].instrumentId) {
                        $scope.datas[i].amount = ($scope.instru[len].amount - 0) + ($scope.datas[i].amount - 0);
                        $scope.instru.pop();
                        len = $scope.instru.length - 1;
                        k++;
                    } else if (k === $scope.datas.length) {
                        $scope.datas.push($scope.instru[len]);
                        $scope.instru.pop();
                        len = $scope.instru.length - 1;
                    } else {
                        k++;
                    }
                }
            }
        }
        console.log($scope.datas);
        $uibModalInstance.close();
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };
}
