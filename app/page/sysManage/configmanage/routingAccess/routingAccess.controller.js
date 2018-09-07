routingAccess.$inject = ['$rootScope', '$scope', 'IHttp', 'uiGridConstants', '$timeout', '$uibModal','auth'];

module.exports = routingAccess;

function routingAccess($rootScope, $scope, IHttp, uiGridConstants, $timeout, $uibModal,auth) {
	var promise;
    var vm = this;
	$scope.params = {
        pageNo: 1,
        pageSize: 15,
        sort: '',
        orderBy: '',
        filters: []
    };
    var user=auth.loginUser();
    
    $scope.gridOptions = {
        enableFiltering: false,
        enableGridMenu: true,
        paginationPageSizes: [ 15, 30, 50],
        rowHeight:40,
        paginationPageSize: $scope.params.pageSize,
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: false,
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
                getNecessaryList();
            });
            //分页
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                $scope.params.pageNo = newPage;
                $scope.params.pageSize = pageSize;
                getNecessaryList();
            });
            
        },
        columnDefs: [{
            field: 'uri',
            displayName: '访问资源URI',
            
            cellTooltip: function(row, col) {
                return row.entity.uri;
            }
        },{
            field: 'clazzUri',
            displayName: '对应的类',
            
            cellTooltip: function(row, col) {
                return row.entity.clazzUri;
            }
        },{
            field: 'method',
            displayName: '对应的方法',//;0:否,1:是 福
                 
            cellTooltip: function(row, col) {
                return row.entity.method;
            }
        },{
            field: 'aliasName',
            displayName: '别名',//0:否,1:是
                 
            cellTooltip: function(row, col) {
                return row.entity.aliasName;
            }
        },{
            field: 'description',
            displayName: '描述',//0:否,1:是"
                      
            cellTooltip: function(row, col) {
                return row.entity.description;
            }
        },{
            field: 'id',
            displayName: '操作',
            
            enableFiltering: false,
            enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents" ><a ng-click=grid.appScope.setNecessary(row)>编辑</a></div>',
        }],
        data: []
    };

    $scope.refresh = function() {
        getNecessaryList();
    }

    var getNecessaryList = function() {
        IHttp.post("basedata/getBasRoutingAccessByBeid", {"beid":user.beid}).then(function(data) {
            data = data.data;
            $scope.gridOptions.totalItems = data.resultList.length;
           
            $scope.gridOptions.data = data.resultList;
        });
    }
    getNecessaryList();

	$scope.setNecessary=function(row){
		var scope = $rootScope.$new();
        if (row === undefined) {
            scope.state = 0;
        } else {
            scope.item = row.entity;         
        }
        $uibModal.open({
            animation: true,            
            template: require('./editRoutingAccess.html'),
            controller: require('./editRoutingAccess.controller'),
            controllerAs: 'vm',
            backdrop:'static',
            scope: scope
        }).result.then(function() {
            getNecessaryList();
        });
	}
}