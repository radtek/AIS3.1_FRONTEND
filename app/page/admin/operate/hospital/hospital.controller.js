HospitalCtrl.$inject = ['$rootScope', '$scope', 'auth','$filter','i18nService','$uibModal','uiGridConstants','$timeout','toastr','IHttp'];

module.exports = HospitalCtrl;

function HospitalCtrl($rootScope, $scope, auth,$filter,i18nService,$uibModal,uiGridConstants,$timeout,toastr,IHttp) {
	var vm = this;
	i18nService.setCurrentLang('zh-cn');
    //console.log("跳转代码执行进来了");
    //按钮权限字符串列表：1-查询列表,2-查询详情,3-添加,4-修改,5-删除,6-his同步,7-数据导入,8-批量执行,9-打印
    
    // if($scope.permission.indexOf('1')===-1){
    //     toastr.error("对不起，您没有权限。");
    //     return;
    // }
    var promise;
    //$scope.$emit('changeEvent');
	// 获取系统时间
  $scope.date = $filter('date')(new Date(), 'yyyy/MM/dd HH:mm:ss');
  $scope.params = {
    timestamp:$scope.date,
    pageNo: 1,
    pageSize: 15,
    sort: '',
    orderBy: '',
    filters: []
  };

  $scope.gridOptions = {
    enableFiltering: true,     // 过滤栏显示
    enableGridMenu: true,       // 配置按钮显示
    enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: true,   // 使用外部过滤
    useExternalPagination: true, // 使用外部分页
    useExternalSorting: true,     // 使用外部排序
    paginationPageSizes: [ 15, 30, 50],   // 配置每页行数可选参数
    rowHeight: 40,
    paginationPageSize: $scope.params.pageSize     // 每页默认显示行数   
  };

  $scope.gridOptions.columnDefs = [
    {
	    field: 'beid',
	    displayName: '局点id',
	    cellTooltip: function(row, col) {
	        return row.entity.beid;
	    }
	},
	{
	    field: 'name',
	    displayName: '局点名称',
	    cellTooltip: function(row, col) {
	        return row.entity.name;
	    }
	},{
	    field: 'description',
	    displayName: '信息备注',
	    cellTooltip: function(row, col) {
	        return row.entity.description;
	    }
	},{
	    field: 'enable1',
	    displayName: '状态',
         enableFiltering: false,
	    cellTooltip: function(row, col) {
	        return row.entity.enable1;
	    }
	}, {
	    field: 'regOptId',
	    displayName: '操作',
	    enableFiltering: false,
	    cellTemplate: '<div class="ui-grid-cell-contents" ><a href="" ng-click=grid.appScope.edit(row)>编辑</a><a href=""  ng-really-message="确定删除吗?" confirm=grid.appScope.del(row)>&nbsp|&nbsp删除</a><a href="" ng-if="row.entity.enable ==1 && row.entity.isCurBe ==0" ng-click=grid.appScope.setCurr(row)>&nbsp|&nbsp设为当前局点</a><a href="" ng-if="" ng-click=grid.appScope.devicesListFn(row)>&nbsp|&nbsp拥有设备</a></div>',
	}];


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
        getList();
    });
    //分页
    gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
        $scope.params.pageNo = newPage;
        $scope.params.pageSize = pageSize;
        getList();
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
            getList();
        }, 2000)
    });
  };	
  $scope.devicesListFn=function(row){
        var scope = $rootScope.$new();
        if(row != undefined){
            scope.item = angular.extend({},row.entity);
        }else if($rootScope.permission.indexOf('UPD')===-1){
            toastr.error("对不起，您没有权限。");
            return;
        }
        var transferrModal = $uibModal.open({
            animation: true,
            backdrop:'static',
            template: require('./hospitaldialog.html'),
            controller: require('./hospitaldialog.controller'),
            controllerAs: 'vm',
            scope: scope
        });
        transferrModal.result.then(function (data) {
            getList();
        }, function () {
        });
  }
    var getList = function() {
    	IHttp.post('sys/selectBusEntityList', $scope.params)
        .then(
            function(rs) {
                var data=rs.data;            	
            	if(data.resultCode==="1"){
            		    for(var i=0;i<data.sysBusEntityList.length;i++){
            		        if(data.sysBusEntityList[i].enable===1){
            		            data.sysBusEntityList[i].enable1 = '启用';
            		        }else{
            		            data.sysBusEntityList[i].enable1 = '停用';
            		        }

            		        if(data.sysBusEntityList[i].isCurBe===1){
            		            data.sysBusEntityList[i].enable1 += '　当前局点';
            		        }
            		       
            		    }
            		    $scope.gridOptions.data = data.sysBusEntityList;
                        $scope.gridOptions.totalItems = data.sysBusEntityTotal;
            	}
            }
        );
    }
    getList();

    $scope.del = function(row){
    	// if( !$rootScope.patToVitaState ){
     //        toastr.error('您没有权限！');
     //        return false;
     //    }
     if($rootScope.permission.indexOf('DEL')===-1){
        toastr.error("对不起，您没有权限。");
        return;
     }
        var obj=row.entity;
        if(obj.isCurBe===1){
        	 toastr.error('当前局点不能删除！');
             return false;
        }
        //if (confirm("你确定要标记删除此设备吗？")) {
            IHttp.post('sys/delBusEntity', obj).then(function(rs) { var data=rs.data; 
                if (data.resultCode === '1') {
                    getList();
                    toastr.info("删除局点成功！");
                }
            });
    }

    $scope.setCurr = function(row){
    	if($rootScope.permission.indexOf('UPD')===-1){
        toastr.error("对不起，您没有权限。");
        return;
       }
        var obj=row.entity;
        //if (confirm("你确定要标记删除此设备吗？")) {
            IHttp.post('sys/setCurBe', obj).then(function(rs) { var data=rs.data; 
                if (data.resultCode === '1') {
                    getList();
                    toastr.info("设置当前局点成功！");
                }
            });
    }

    $scope.edit = function(row){
    	var scope = $rootScope.$new();
        scope.flag = false;
    	if(row != undefined){
            scope.item = angular.extend({},row.entity);
            scope.flag = true;
        }else if($rootScope.permission.indexOf('UPD')===-1){
            toastr.error("对不起，您没有权限。");
        return;
       }
	    var transferrModal = $uibModal.open({
	        animation: true,
            backdrop:'static',
	        template: require('./hospitaldialog.html'),
	        controller: require('./hospitaldialog.controller'),
	        controllerAs: 'vm',
	        scope: scope
	    });
	    transferrModal.result.then(function (data) {
	        getList();
	    }, function () {
	    });
    }

}