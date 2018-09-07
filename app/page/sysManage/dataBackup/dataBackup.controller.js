DataBackupCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'uiGridConstants', '$uibModal', '$timeout', '$filter', 'toastr'];

module.exports = DataBackupCtrl;

function DataBackupCtrl($rootScope, $scope, IHttp, uiGridConstants, $uibModal, $timeout, $filter, toastr) {
	$scope.params = {
        pageNo: 1,
        pageSize: 15,
        sort: '',
        orderBy: '',
        filters: []
    };
    var promise;

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
        paginationPageSize: $scope.params.pageSize,
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
            field: 'bftime',
            displayName: '备份时间',
            cellTooltip: function(row, col) {
                return row.entity.bftime;
            }
        }, {
            field: 'bfsm',
            displayName: '备份说明',
            cellTooltip: function(row, col) {
                return row.entity.bfsm;
            }
        }, {
            field: 'bfp',
            displayName: '备份人员',
            cellTooltip: function(row, col) {
                return row.entity.bfp;
            }
        }],
        data: []
    };

	var bflist = [
		{bftime:'2016-03-15 12:15:08',bfsm:'2016-03-15 12:15:08备份',bfp:'管理员'},
		{bftime:'2016-04-06 13:05:46',bfsm:'2016-04-06 13:05:46备份',bfp:'管理员'},
		{bftime:'2016-05-20 13:11:28',bfsm:'2016-05-20 13:11:28备份',bfp:'管理员'},
		{bftime:'2016-06-11 16:40:01',bfsm:'2016-06-11 16:40:01备份',bfp:'管理员'},
		{bftime:'2016-09-19 10:21:55',bfsm:'2016-09-19 10:21:55备份',bfp:'管理员'},
		{bftime:'2016-10-10 16:18:06',bfsm:'2016-10-10 16:18:06备份',bfp:'管理员'}
	];

    $scope.backData = function(row) {
        var scope = $rootScope.$new();
        $uibModal.open({
            animation: true,
            template: require('./editDataBackup.html'),
            controller: require('./editDataBackup.controller'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        }).result.then(function(rs) {
			var datas=$filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
			var list={bfsm:rs[0].bfsm,bfp:'管理员',bftime:datas};

			$timeout(function(){
				bflist.push(list);
                toastr.success("操作成功");
			},500);
        });
    }

    var getPage = function() {
        $scope.gridOptions.data = bflist;
    }

    getPage();
}
