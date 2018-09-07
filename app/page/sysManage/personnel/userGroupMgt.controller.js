userGroupMgt.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModal', '$timeout', 'confirm'];

module.exports = userGroupMgt;

function userGroupMgt($rootScope, $scope, IHttp, $uibModal, $timeout, confirm) {
    var promise;
    $scope.roleParams = {
        pageNo: 1,
        pageSize: 15,
        sort: '',
        orderBy: '',
        filters: []
    };
    $scope.gridOptions = {
        enableFiltering: false,//表头列的过滤栏，默认false
        enableGridMenu: false,//表头右侧配置按钮，默认false
        enableSorting:false,//表头列的排序，默认false
        enablePagination: false, //分页，默认false        
        showGridFooter:false,//显示页脚，默认false
        enableColumnResizing:false,//启动鼠标拖动列宽，默认false 
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: false,
        useExternalPagination: true,
        useExternalSorting: false,         
        paginationPageSizes: [ 15, 30, 50],
        rowHeight: 40,       
        paginationPageSize: $scope.roleParams.pageSize,
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                if (sortColumns.length === 0) {
                    $scope.roleParams.orderBy = '';
                } else {
                    $scope.roleParams.orderBy = sortColumns[0].sort.direction;
                    $scope.roleParams.sort = sortColumns[0].colDef.field;
                }
                getRolePage();
            });
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                $scope.roleParams.pageNo = newPage;
                $scope.roleParams.pageSize = pageSize;
                getRolePage();
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
                        if (value) {
                            filterArr.push({
                                field: fieldName,
                                value: value
                            });
                        }
                    });
                    $scope.roleParams.filters = filterArr;
                    getRolePage();
                }, 2000)

            });
        },
        columnDefs: [{
            field: 'name',
            displayName: '用户组名称',
            cellTooltip: function(row, col) {
                return row.entity.name;
            }
        }, {
            field: 'menuName',
            displayName: '权限菜单',
            cellTooltip: function(row, col) {
                return row.entity.menuName;
            }
        }, {
            field: 'id',
            displayName: '操作',
            enableFiltering: false,
            enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents"><a href="" ng-click=grid.appScope.editGroup(row.entity)>编辑</a></div>'
        }],
        data: []
    };

    var getRolePage = function() {
        IHttp.post("sys/getAllRole", $scope.roleParams).then(function(rs) {
            $scope.gridOptions.data = rs.data.resultList;
            $scope.gridOptions.totalItems = rs.data.total;
        });
    }
    getRolePage();

    $scope.editGroup = function(entity) {
    	var scope = $rootScope.$new();
        scope.role = angular.copy(entity);
        $uibModal.open({
            animation: true,
            size: 'lg',
            template: require('./editUserGroupMgt.html'),
            controller: require('./editUserGroupMgt.controller'),
            controllerAs: 'vm',
            backdrop:'static',
            scope: scope
        }).result.then(function() {
            getRolePage();
        });;
    }
}
