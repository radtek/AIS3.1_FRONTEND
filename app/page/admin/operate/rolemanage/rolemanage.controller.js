RolemanageCtrl.$inject = ['$rootScope', '$scope', 'auth','$filter','i18nService','$uibModal','uiGridConstants','$timeout','toastr','IHttp'];

module.exports = RolemanageCtrl;

function RolemanageCtrl($rootScope, $scope, auth,$filter,i18nService,$uibModal,uiGridConstants,$timeout,toastr,IHttp) {
	var vm = this;
  i18nService.setCurrentLang('zh-cn');
  //按钮权限字符串列表：1-查询列表,2-查询详情,3-添加,4-修改,5-删除,6-his同步,7-数据导入,8-批量执行,9-打印
   
  var promise;
	// 获取系统时间
  $scope.date = $filter('date')(new Date(), 'yyyy/MM/dd HH:mm:ss');
  $scope.params = {
    timestamp:$scope.date,
    pageNo: 1,
    pageSize: 15,
    sort: 'id',
    orderBy: 'asc',
    filters: []
  };

  $scope.gridOptions = {
    enableFiltering: true,     // 过滤栏显示
    enableGridMenu: true,       // 配置按钮显示
    enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: true,   // 使用外部过滤
    useExternalPagination: true, // 使用外部分页
    useExternalSorting: true,     // 使用外部排序
    paginationPageSizes: [ 15, 30, 50],    // 配置每页行数可选参数
    rowHeight: 40,
    paginationPageSize: $scope.params.pageSize     // 每页默认显示行数
  };

  $scope.gridOptions.columnDefs = [
        {
            field: 'name',
            displayName: '角色名称',
            cellTooltip: function(row, col) {
                return row.entity.name;
            }
        },{
            field: 'description',
            displayName: '角色描述',
            cellTooltip: function(row, col) {
                return row.entity.description;
            }
        },{
            field: 'beName',
            displayName: '局点',
            cellTooltip: function(row, col) {
                return row.entity.beName;
            }
        },{
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
                },]
            },
        }, {field: 'regionId',
            displayName: '操作',
            enableFiltering: false,
            enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents" ><a href="" ng-click=grid.appScope.editRole(row)>编辑</a></div>',
        }]


  $scope.gridOptions.onRegisterApi = function( gridApi ) {
    $scope.gridApi = gridApi;
    //排序
    $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
        if (sortColumns.length === 0) {
            $scope.params.orderBy = '';
        } else {
            $scope.params.orderBy = sortColumns[0].sort.direction;
            $scope.params.sort = sortColumns[0].colDef.field;
        }
        getRoleList();
    });
    //分页
    gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
        $scope.params.pageNo = newPage;
        $scope.params.pageSize = pageSize;
        getRoleList();
    });
    //过滤
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
                if (!!value) {
                    filterArr.push({
                        field: fieldName,
                        value: value
                    });
                }
            });
            $scope.params.filters = filterArr;
            getRoleList();
        }, 2000)
    });
  };	

  var getRoleList = function() {
    IHttp.post('sys/getrolelist', $scope.params)
        .then(
            function(rs) {
                var data=rs.data;
                if(data.resultCode==="1"){
                	$scope.gridOptions.totalItems = data.total;
                    for(var i=0;i<data.sysMngRole.length;i++){
                        if(data.sysMngRole[i].enable){
                            data.sysMngRole[i].enable = '启用';
                        }else{
                            data.sysMngRole[i].enable = '禁用';
                        }
                    }
                    $scope.gridOptions.data = data.sysMngRole;
                }
            }
        );
    }
    getRoleList();

    $scope.addRole = function(row){
        var scope = $rootScope.$new();
        var transferrModal = $uibModal.open({
            animation: true,
            template: require('./roledialog.html'),
            controller: require('./roledialog.controller'),
            controllerAs: 'vm',
            backdrop:'static',
            size: 'lg',
            scope: scope
        });
        transferrModal.result.then(function (data) {
            getRoleList();
        }, function () {
            
        });
    }

    $scope.editRole = function(row){
        if($scope.permission.indexOf('UPD')===-1){
            toastr.error("对不起，您没有权限。");
            return;
        }
        var scope = $rootScope.$new();
        if(row != undefined){
            scope.item = angular.extend({},row.entity);
        }
        var transferrModal = $uibModal.open({
            animation: true,
            template: require('./roledialog.html'),
            controller: require('./roledialog.controller'),
            controllerAs: 'vm',
            backdrop:'static',
            size: 'lg',
            scope: scope
        });
        transferrModal.result.then(function (data) {
            getRoleList();
        }, function () {
            
        });
    }
}

