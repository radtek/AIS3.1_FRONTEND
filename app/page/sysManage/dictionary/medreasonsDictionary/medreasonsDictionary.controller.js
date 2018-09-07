medreasonsDictionary.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModal', 'confirm', 'toastr', '$timeout'];

module.exports = medreasonsDictionary;

function medreasonsDictionary($rootScope, $scope, IHttp, $uibModal, confirm, toastr, $timeout) {
    $scope.params = {
        pageNo: 1,
        pageSize: 15,
        sort: '',
        orderBy: '',
        filters: []
    };
    var promise;
    $scope.gridmedreasons = {
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
                getmedreasons();
            });
            //分页
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                $scope.params.pageNo = newPage;
                $scope.params.pageSize = pageSize;
                getmedreasons();
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
                    getmedreasons();
                }, 1000);
            });
        },
        columnDefs: [{
            field: 'reason',
            displayName: '给药理由',
            cellTooltip: function(row, col) {
                return row.entity.reason;
            }
        }, {
            field: 'medTakeReasonId',
            displayName: '操作',
            enableFiltering: false,
            enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents"><a href="" ng-click=grid.appScope.addMedreasons(row)>编辑</a> <span>|</span> <a href="" ng-click=grid.appScope.deleteMedreasons(row)>删除</a></div>'
        }]
    };

    var getmedreasons = function() {
        IHttp.post("basedata/queryMedicalTakeReasonList", $scope.params).then(function(data) {
            $scope.gridmedreasons.totalItems = data.data.total;
            $scope.gridmedreasons.data = data.data.resultList;
        });
    }
    getmedreasons();

    $scope.refresh = function() {
        getmedreasons();
    }

    $scope.addMedreasons = function(row) {
        var scope = $rootScope.$new();
        if (row === undefined) {
            scope.medTakeReasonId = 0;
        } else {
            scope.medTakeReasonId = row.entity.medTakeReasonId;
        }
        $uibModal.open({
            animation: true,
            template: require('./editMedreasonsDictionary.html'),
            controller: require('./editMedreasonsDictionary.controller'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        }).result.then(function() {
            getmedreasons();
        });
    }

    $scope.deleteMedreasons = function(row) {
        confirm.tips().show('你是否要删除该用药理由？').then(function() {
            IHttp.post('basedata/deleteMedicalTakeReason', [row.entity.medTakeReasonId]).then(function(rs) {
                if (rs.data.resultCode === '1') {
                    getmedreasons();
                    toastr.success(rs.data.resultMessage);
                }
            });
        });
    }
}
