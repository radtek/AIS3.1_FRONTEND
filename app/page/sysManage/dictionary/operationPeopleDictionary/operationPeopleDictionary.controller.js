operationPeopleDictionary.$inject = ['$rootScope', '$scope', 'IHttp', 'uiGridConstants', '$uibModal', '$timeout'];

module.exports = operationPeopleDictionary;

function operationPeopleDictionary($rootScope, $scope, IHttp, uiGridConstants, $uibModal, $timeout) {
    $scope.params = {
        pageNo: 1,
        pageSize: 15,
        sort: '',
        orderBy: '',
        filters: []
    };
    var promise;
    //科室
    $scope.gridOperationPeople = {
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
            field: 'name',
            displayName: '手术医生名字',
            cellTooltip: function(row, col) {
                return row.entity.name;
            }
        }, {
            field: 'pinYin',
            displayName: '拼音码',
            cellTooltip: function(row, col) {
                return row.entity.pinYin;
            }
        }, {
            field: 'enable',
            displayName: '有效标志',
            cellTooltip: function(row, col) {
                return row.entity.enable;
            },
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [{
                    value: "1",
                    label: '在岗'
                }, {
                    value: "0",
                    label: '不在岗'
                }]
            }
        }, {
            field: 'operatorId',
            displayName: '操作',
            enableFiltering: false,
            enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents"><a href="" ng-click=grid.appScope.editOperationpeople(row)>编辑</a><span></div>',
        }],
        data: []
    };

    $scope.editOperationpeople = function(row) {
        var scope = $rootScope.$new();
        if (row === undefined) {
            scope.operatorId = 0;
        } else {
            scope.operatorId = row.entity.operatorId;
        }
        $uibModal.open({
            animation: true,
            template: require('./editOperationpeopleDictionary.html'),
            controller: require('./editOperationpeopleDictionary.controller'),
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
        IHttp.post("basedata/queryOperationPeopleList", $scope.params).then(function(data) {
        	data = data.data;
            $scope.gridOperationPeople.totalItems = data.total;
            for (var i = 0; i < data.resultList.length; i++) {
                if (data.resultList[i].enable == '1') {
                    data.resultList[i].enable = '在岗';
                } else {
                    data.resultList[i].enable = '不在岗';
                }
            }
            $scope.gridOperationPeople.data = data.resultList;
        });
    }
    getPage();
}
