UsermanageCtrl.$inject = ['$rootScope', '$scope', 'auth','$filter','i18nService','$uibModal','uiGridConstants','$timeout','toastr','IHttp'];

module.exports = UsermanageCtrl;

function UsermanageCtrl($rootScope, $scope, auth,$filter,i18nService,$uibModal,uiGridConstants,$timeout,toastr,IHttp) {
	 var vm = this;
	  i18nService.setCurrentLang('zh-cn');
	  //按钮权限字符串列表：1-查询列表,2-查询详情,3-添加,4-修改,5-删除,6-his同步,7-数据导入,8-批量执行,9-打印
    console.log($rootScope.permission);
	  var promise;
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
	    // enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: true,   // 使用外部过滤
	    useExternalPagination: true, // 使用外部分页
	    // useExternalSorting: true,     // 使用外部排序
	    paginationPageSizes: [ 15, 30, 50],   // 配置每页行数可选参数
	    rowHeight: 40,
	    paginationPageSize: $scope.params.pageSize     // 每页默认显示行数
	};

	$scope.gridOptions.columnDefs = [
		{
	        field: 'userName',
	        displayName: '用户账号',
	        cellTooltip: function(row, col) {
	            return row.entity.userName;
	        }
	    }, {
	        field: 'name',
	        displayName: '姓名',
	        cellTooltip: function(row, col) {
	            return row.entity.name;
	        }
	    },
	     {
	        field: 'pinYin',
	        displayName: '拼音码',
	        cellTooltip: function(row, col) {
	            return row.entity.pinYin;
	        }
	    }, 
	    {
	        field: 'professionalTitle',
	        displayName: '职称',
	        cellTooltip: function(row, col) {
	            return row.entity.professionalTitle;
	        },
	        filter: {
	            type: uiGridConstants.filter.SELECT,
	            selectOptions: [{
	                value: "INTERNE_DOCTOR",
	                label: '实习医师'
	            }, {
	                value: "INHOSPITAL_DOCTOR",
	                label: '住院医师'
	            }, {
	                value: "INCHARGE_DOCTOR",
	                label: '主治医师'
	            }, {
	                value: "DEPUTY_DIRECTOR_DOCTOR",
	                label: '副主任医师'
	            }, {
	                value: "DIRECTOR_DOCTOR",
	                label: '主任医师'
	            }, {
	                value: "INTERNE_NURSE",
	                label: '实习护士'
	            }, {
	                value: "NURSE",
	                label: '护士'
	            }, {
	                value: "SENIOR_NURSE",
	                label: '护师'
	            }, {
	                value: "INCHARGE_NURSE",
	                label: '主管护师'
	            }, {
	                value: "DEPUTY_DIRECTOR_NURSE",
	                label: '副主任护师'
	            }, {
	                value: "DIRECTOR_NURSE",
	                label: '主任护师'
	            }]
	        },
	    }, {
	        field: 'roleType',
	        displayName: '角色类型',
	        cellTooltip: function(row, col) {
	            return row.entity.roleType;
	        },
	        filter: {
	            type: uiGridConstants.filter.SELECT,
	            selectOptions: [{
	                value: "NURSE",
	                label: '手术室护士'
	            }, {
	                value: "HEAD_NURSE",
	                label: '手术室护士长'
	            }, {
	                value: "ANAES_DOCTOR",
	                label: '麻醉医生'
	            }, {
	                value: "ANAES_DIRECTOR",
	                label: '麻醉科主任'
	            }]
	        },
	    }, {
	        field: 'userType',
	        displayName: '用户类型',
	        cellTooltip: function(row, col) {
	            return row.entity.userType;
	        },
	        filter: {
	            type: uiGridConstants.filter.SELECT,
	            selectOptions: [{
	                value: "NURSE",
	                label: '护士'
	            }, {
	                value: "ANAES_DOCTOR",
	                label: '麻醉医生'
	            }, {
	                value: "HEALTH_NUR",
	                label: '卫生护士'
	            }, {
	                value: "ANAES_PERFUSION",
	                label: '灌注医生'
	            }, {
	                value: "ADMIN",
	                label: '管理员'
	            }]
	        }
	    },{
	        field: 'roleName',
	        displayName: '角色',
	        cellTooltip: function(row, col) {
	            return row.entity.roleName;
	        }
	    },{
            field: 'beid',
            displayName: '局点',
            cellTooltip: function(row, col) {
                return row.entity.beid;
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
	                value: "0",
	                label: '禁用'
	            }, {
	                value: "1",
	                label: '启用'
	            }]
	        },
	    }, {
	        field: 'locked',
	        displayName: '锁定',
	        cellTooltip: function(row, col) {
	            return row.entity.locked;
	        },
	        filter: {
	            type: uiGridConstants.filter.SELECT,
	            selectOptions: [{
	                value: "0",
	                label: '正常'
	            }, {
	                value: "1",
	                label: '锁定'
	            }]
	        },
	    }, {
	        field: 'username',
	        displayName: '操作',
	        enableFiltering: false,
	        cellTemplate: '<div class="ui-grid-cell-contents" ><a href="" ng-click=grid.appScope.edituser(row)>编辑</a>&nbsp&nbsp&nbsp<a href=""  ng-really-message="确定重置密码?" confirm=grid.appScope.reuserpswd(row)>重置用户密码</a></div>',
	       
	    }
	];


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
	        getuserinf();
	    });
	    //分页
	    gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
	        $scope.params.pageNo = newPage;
	        $scope.params.pageSize = pageSize;
	        getuserinf();
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
	            getuserinf();
	        }, 2000)
	    });
	};	

	var getuserinf = function() {
	    IHttp.post('sys/getuserinf', $scope.params)
	        .then(
	            function(rs) {
	            	var data=rs.data;
                	if(data.resultCode==="1"){
	            	$scope.gridOptions.totalItems = data.total;
	                for (var i = 0; i < data.sysMngUser.length; i++) {
	                    if (data.sysMngUser[i].enable) {
	                        data.sysMngUser[i].enable = '启用';
	                    } else {
	                        data.sysMngUser[i].enable = '禁用';
	                    }
	                    if (data.sysMngUser[i].locked) {
	                        data.sysMngUser[i].locked = '禁用';
	                    } else {
	                        data.sysMngUser[i].locked = '正常';
	                    }
	                }
	                $scope.gridOptions.data = data.sysMngUser;
	            	}
	            }
	        );
	    }
	    getuserinf();

	    $scope.edituser = function(row){
	        if($rootScope.permission.indexOf('UPD')===-1){
	                toastr.error("对不起，您没有权限。");
	                return;
	        }
	    	var scope = $rootScope.$new();
	    	if(row != undefined){
	            scope.item = angular.extend({},row.entity);
	        }
		    var transferrModal = $uibModal.open({
		        animation: true,
	            backdrop:'static',
		        template: require('./userdialog.html'),
		        controller: require('./userdialog.controller'),
		        controllerAs: 'vm',
		        scope: scope
		    });
		    transferrModal.result.then(function (data) {
	            getuserinf();
		    }, function () {
		        
		    });
	    }

	    

	$scope.reuserpswd = function(row){
		if($rootScope.permission.indexOf('UPD')===-1){
			toastr.error("对不起，您没有权限。");
			return;
		}
		promise = $timeout(function() {
			IHttp.post('sys/resetUserPassword',{
				loginName:row.entity.userName, 
				beid:row.entity.beid  
			}).then(function(rs) {
				var data=rs.data;    
				if (data.resultCode === '1') {
					toastr.info('重置成功！');
				}
			});
		},200);
	}

}