myPatientCtrl.$inject = ['$rootScope', '$scope', '$filter','IHttp', 'i18nService','auth', 'uiGridConstants', '$timeout', 'toastr', '$uibModal'];

module.exports = myPatientCtrl;

function myPatientCtrl( $rootScope, $scope,$filter,IHttp, i18nService,auth, uiGridConstants, $timeout, toastr, $uibModal) {
	i18nService.setCurrentLang('zh-cn');
    $scope.talkInfo=0;
    var user=auth.loginUser();
     $scope.startTime = $filter('date')(new Date(), 'yyyy-MM-dd');
    $scope.endTime = $filter('date')(new Date(), 'yyyy-MM-dd');

	var promise;
	$scope.params = {
		pageNo: 1,
		pageSize: 15,
		orderBy: '',
		sort: '',
        beid:user.beid,
        module:user.module,
		filters:  [{"field":"outMedicine","value":"0"}]
	};
    $scope.params1 = {
        pageNo: 1,
        pageSize: 15,
        orderBy: '',
        sort: '',
        beid:user.beid,
        module:user.module,
        filters: [{"field":"outMedicine","value":"1"}]
    };
    $scope.params2 = {
        pageNo: 1,
        pageSize: 15,
        orderBy: '',
        sort: '',
        filters: [{
            field: "inOutType",
            value: "I"
        }]
    };
    $scope.params3 = {
        pageNo: 1,
        pageSize: 15,
        orderBy: '',
        sort: '',
        filters: [{
            field: "inOutType",
            value: "I"
        }]
    };


	$scope.gridOptions = {
		resizable: true,
	    enableFiltering: true, // 过滤栏显示
	    enableGridMenu: true, // 配置按钮显示
	    enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: false, // 禁止内部过滤，启用外部滤波器监听事件
	    useExternalSorting: true,
	    showColumnFooter: true,
	    useExternalPagination: true, // 分页
	    paginationPageSizes: [ 15, 30, 50],
        rowHeight: 40,
	    paginationPageSize: $scope.params.pageSize,
	    onRegisterApi: function(gridApi) {
	        $scope.gridApi = gridApi;
	        $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
	            if (sortColumns.length === 0) {
	                $scope.params.orderBy = '';
	            } else {
	                $scope.params.orderBy = sortColumns[0].sort.direction;
	                $scope.params.sort = sortColumns[0].colDef.field;
	            }
	            getPage();
	        });
	        gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
	            $scope.params.pageNo = newPage;
	            $scope.params.pageSize = pageSize;
	            getPage();
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
	                    if (value === null) {
	                        value = "";
	                    }
	                    if (value !== undefined) {
	                        filterArr.push({
	                            field: fieldName,
	                            value: value
	                        });
	                    }
	                });
                    $scope.params.filters.splice(1, $scope.params.filters.length - 1, ...filterArr);
	                getPage();
	            }, 1000)

	        });
	    },
	    columnDefs:  [{
                    field: 'name',
                    displayName: '患者',
                    cellTooltip: function(row, col) {
                        return row.entity.name;
                    },
                    cellTemplate:'<div ng-click=grid.appScope.showIn(row) title="{{row.entity.name}}"  class="ui-grid-cell-contents hand">{{row.entity.name}}</div>' 
                }, {
                    field: 'deptName',
                    displayName: '科室',
                    cellTooltip: function(row, col) {
                        return row.entity.deptName;
                    },
                    cellTemplate:'<div ng-click=grid.appScope.showIn(row) title="{{row.entity.deptName}}"  class="ui-grid-cell-contents hand">{{row.entity.deptName}}</div>' 
                }, {
                    field: 'designedOptName',
                    displayName: '手术名称',
                    cellTooltip: function(row, col) {
                        return row.entity.designedOptName;
                    },
                    cellTemplate:'<div ng-click=grid.appScope.showIn(row) title="{{row.entity.designedOptName}}"  class="ui-grid-cell-contents hand">{{row.entity.designedOptName}}</div>' 
                }, {
                    field: 'hid',
                    displayName: '住院号',
                    cellTooltip: function(row, col) {
                        return row.entity.hid;
                    },
                    cellTemplate:'<div ng-click=grid.appScope.showIn(row) title="{{row.entity.hid}}"  class="ui-grid-cell-contents hand">{{row.entity.hid}}</div>' 
                }, {
                    field: 'anesthetistName',
                    displayName: '麻醉医生',
                    cellTooltip: function(row, col) {
                        return row.entity.anesthetistName;
                    },
                    cellTemplate:'<div ng-click=grid.appScope.showIn(row) title="{{row.entity.anesthetistName}}"  class="ui-grid-cell-contents hand">{{row.entity.anesthetistName}}</div>' 
                }, {
                    field: 'circunurseName',
                    displayName: '巡回护士',
                    cellTooltip: function(row, col) {
                        return row.entity.circunurseName;
                    },
                    cellTemplate:'<div ng-click=grid.appScope.showIn(row) title="{{row.entity.circunurseName}}"  class="ui-grid-cell-contents hand">{{row.entity.circunurseName}}</div>' 
                }, {
                    field: 'operaDate',
                    displayName: '手术日期',
                    enableFiltering: false,  
                    cellTooltip: function(row, col) {
                        return row.entity.operaDate;
                    },
                    cellTemplate:'<div ng-click=grid.appScope.showIn(row) title="{{row.entity.operaDate}}"  class="ui-grid-cell-contents hand">{{row.entity.operaDate}}</div>' 
                }]
	};

    $scope.gridOptions1 = {
        resizable: true,
        enableFiltering: true, // 过滤栏显示
        enableGridMenu: true, // 配置按钮显示
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: false, // 禁止内部过滤，启用外部滤波器监听事件
        useExternalSorting: true,
        showColumnFooter: true,
        useExternalPagination: true, // 分页
        paginationPageSizes: [ 15, 30, 50],
        rowHeight: 40,
        paginationPageSize: $scope.params1.pageSize,
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                if (sortColumns.length === 0) {
                    $scope.params1.orderBy = '';
                } else {
                    $scope.params1.orderBy = sortColumns[0].sort.direction;
                    $scope.params1.sort = sortColumns[0].colDef.field;
                }
                getPage1();
            });
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                $scope.params1.pageNo = newPage;
                $scope.params1.pageSize = pageSize;
                getPage1();
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
                        if (value === null) {
                            value = "";
                        }
                        if (value !== undefined) {
                            filterArr.push({
                                field: fieldName,
                                value: value
                            });
                        }
                    });
                    $scope.params1.filters.splice(1, $scope.params1.filters.length - 1, ...filterArr);
                    getPage1();
                }, 1000)

            });
        },
        columnDefs: [{
                    field: 'name',
                    displayName: '患者',
                    cellTooltip: function(row, col) {
                        return row.entity.name;
                    },
                    cellTemplate:'<div ng-click=grid.appScope.showIn(row) title="{{row.entity.name}}"  class="ui-grid-cell-contents hand">{{row.entity.name}}</div>' 
                }, {
                    field: 'deptName',
                    displayName: '科室',
                    cellTooltip: function(row, col) {
                        return row.entity.deptName;
                    },
                    cellTemplate:'<div ng-click=grid.appScope.showIn(row) title="{{row.entity.deptName}}"  class="ui-grid-cell-contents hand">{{row.entity.deptName}}</div>' 
                }, {
                    field: 'designedOptName',
                    displayName: '手术名称',
                    cellTooltip: function(row, col) {
                        return row.entity.designedOptName;
                    },
                    cellTemplate:'<div ng-click=grid.appScope.showIn(row) title="{{row.entity.designedOptName}}"  class="ui-grid-cell-contents hand">{{row.entity.designedOptName}}</div>' 
                }, {
                    field: 'hid',
                    displayName: '住院号',
                    cellTooltip: function(row, col) {
                        return row.entity.hid;
                    },
                    cellTemplate:'<div ng-click=grid.appScope.showIn(row) title="{{row.entity.hid}}"  class="ui-grid-cell-contents hand">{{row.entity.hid}}</div>' 
                }, {
                    field: 'anesthetistName',
                    displayName: '麻醉医生',
                    cellTooltip: function(row, col) {
                        return row.entity.anesthetistName;
                    },
                    cellTemplate:'<div ng-click=grid.appScope.showIn(row) title="{{row.entity.anesthetistName}}"  class="ui-grid-cell-contents hand">{{row.entity.anesthetistName}}</div>' 
                }, {
                    field: 'circunurseName',
                    displayName: '巡回护士',
                    cellTooltip: function(row, col) {
                        return row.entity.circunurseName;
                    },
                    cellTemplate:'<div ng-click=grid.appScope.showIn(row) title="{{row.entity.circunurseName}}"  class="ui-grid-cell-contents hand">{{row.entity.circunurseName}}</div>' 
                }, {
                    field: 'operaDate',
                    displayName: '手术日期',
                    enableFiltering: false,  
                    cellTooltip: function(row, col) {
                        return row.entity.operaDate;
                    },
                    cellTemplate:'<div ng-click=grid.appScope.showIn(row) title="{{row.entity.operaDate}}"  class="ui-grid-cell-contents hand">{{row.entity.operaDate}}</div>' 
                }]
    };

    $scope.gridOptions2 = {
        resizable: true,
        enableFiltering: false, // 过滤栏显示
        enableGridMenu: false, // 配置按钮显示
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: true, // 禁止内部过滤，启用外部滤波器监听事件
        useExternalSorting: true,
        showColumnFooter: true,
        useExternalPagination: false, // 为true使用外部 分页，为false使用内部分页
        paginationPageSizes: [ 15, 30, 50],
        rowHeight: 40,
        paginationPageSize: $scope.params2.pageSize,
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                if (sortColumns.length === 0) {
                    $scope.params2.orderBy = '';
                } else {
                    $scope.params2.orderBy = sortColumns[0].sort.direction;
                    $scope.params2.sort = sortColumns[0].colDef.field;
                }
                getPage2();
            });
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                $scope.params2.pageNo = newPage;
                $scope.params2.pageSize = pageSize;
               // getPage2();  这里一次查询出来了，就不需要后台再查询了
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
                        if (value === null) {
                            value = "";
                        }
                        if (value !== undefined) {
                            filterArr.push({
                                field: fieldName,
                                value: value
                            });
                        }
                    });
                    $scope.params2.filters.splice(1, $scope.params2.filters.length - 1, ...filterArr);
                    getPage2();
                }, 1000)

            });
        },
        columnDefs: [{
                    field: 'name',
                    displayName: '耗材名称',
                    width:220,
                    cellTooltip: function(row, col) {
                        return row.entity.name;
                    }
                }, {
                    field: 'spec',
                    displayName: '规格',
                    cellTooltip: function(row, col) {
                        return row.entity.spec;
                    }
                }, {
                    field: 'dosage',
                    displayName: '用量',
                    width:60,
                    cellTooltip: function(row, col) {
                        return row.entity.dosage;
                    }
                }, {
                    field: 'medTakeWayName',
                    displayName: '给耗材途径',
                    cellTooltip: function(row, col) {
                        return row.entity.medTakeWayName;
                    }
                }, {
                    field: 'startTime',
                    displayName: '用耗材时间',
                    width:160,
                     cellFilter: 'dateformatter',
                    cellTooltip: function(row, col) {
                        return row.entity.startTime;
                    }
                }]
    };

    $scope.gridOptions3 = {
        resizable: true,
        enableFiltering: false, // 过滤栏显示
        enableGridMenu: false, // 配置按钮显示
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: true, // 禁止内部过滤，启用外部滤波器监听事件
        useExternalSorting: true,
        showColumnFooter: true,
        useExternalPagination: true, // 分页
        paginationPageSizes: [ 15, 30, 50],
        rowHeight: 40,
        paginationPageSize: $scope.params3.pageSize,
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                if (sortColumns.length === 0) {
                    $scope.params3.orderBy = '';
                } else {
                    $scope.params3.orderBy = sortColumns[0].sort.direction;
                    $scope.params3.sort = sortColumns[0].colDef.field;
                }
                getPage3();
            });
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                $scope.params3.pageNo = newPage;
                $scope.params3.pageSize = pageSize;
                getPage3();
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
                        if (value === null) {
                            value = "";
                        }
                        if (value !== undefined) {
                            filterArr.push({
                                field: fieldName,
                                value: value
                            });
                        }
                    });
                    $scope.params3.filters.splice(1, $scope.params3.filters.length - 1, ...filterArr);
                    getPage3();
                }, 1000)

            });
        },
        columnDefs: [{
                    field: 'medicineName',
                    displayName: '耗材名称',
                    cellTooltip: function(row, col) {
                        return row.entity.medicineName;
                    }
                }, {
                    field: 'outNumber',
                    displayName: '取耗材',
                    cellTooltip: function(row, col) {
                        return row.entity.outNumber;
                    }
                }, {
                    field: 'retreatNumber',
                    displayName: '退耗材',
                    cellTooltip: function(row, col) {
                        return row.entity.retreatNumber;
                    }
                }, {
                    field: 'loseNumber',
                    displayName: '报损',
                    cellTooltip: function(row, col) {
                        return row.entity.loseNumber;
                    }
                }, {
                    field: 'actualNumber',
                    displayName: '实际',
                    cellTooltip: function(row, col) {
                        return row.entity.actualNumber;
                    }
                }, {
                    field: 'spec',
                    displayName: '规格',
                    cellTooltip: function(row, col) {
                        return row.entity.spec;
                    }
                }, {
                    field: 'batch',
                    displayName: '批号',
                    cellTooltip: function(row, col) {
                        return row.entity.batch;
                    }
                }, {
                    field: 'outTime1',
                    displayName: '取耗材时间',
                    cellTooltip: function(row, col) {
                        return row.entity.outTime1;
                    }
                }, {
                    field: 'receiveName',
                    displayName: '领用人',
                    cellTooltip: function(row, col) {
                        return row.entity.receiveName;
                    }
                }]
    };

	function getPage() {
        var startTime=$scope.startTime;
            var endTime=$scope.endTime;
            $scope.params.filters=[{"field":"outMedicine","value":"0"},{"field":"anesthetistId","value":user.userName},{"field":"startTime","value":startTime},{"field":"endTime","value":endTime}];
            
		IHttp.post('basedata/selectRegOptInfoForOutRecord',$scope.params).then(function(rs) {
		    // $scope.gridOptions.data = rs.data.searchRegOptByLoginNameAndStateFormBean;
		    if (rs.status === 200 && rs.data.resultCode === '1') {
		    	$scope.gridOptions.totalItems = rs.data.total;
		    	$scope.gridOptions.data = rs.data.resultList;
		    }
		});
	}

	getPage();

    function getPage1() {
        setTimeout(function(){
            var startTime=$scope.startTime;
            var endTime=$scope.endTime;
            $scope.params1.filters=[{"field":"outMedicine","value":"1"},{"field":"anesthetistId","value":user.userName},{"field":"startTime","value":startTime},{"field":"endTime","value":endTime}];
            
        IHttp.post('basedata/selectRegOptInfoForOutRecord',$scope.params1).then(function(rs) {
            // $scope.gridOptions.data = rs.data.searchRegOptByLoginNameAndStateFormBean;
            if (rs.status === 200 && rs.data.resultCode === '1') {
                $scope.gridOptions1.totalItems = rs.data.total;
                $scope.gridOptions1.data = rs.data.resultList;
            }
        });
        },100);   
    }

    getPage1();

    function getPage2(regOptId) {
        $scope.params2.regOptId= regOptId;

        IHttp.post('operation/serarchMedicaleventList',$scope.params2).then(function(rs) {
            // $scope.gridOptions.data = rs.data.searchRegOptByLoginNameAndStateFormBean;
            if (rs.status === 200 && rs.data.resultCode === '1') {
                $scope.gridOptions2.totalItems = rs.data.total;
                for (var i = 0; i < rs.data.resultList.length; i++) {
                    rs.data.resultList[i].outTime1=$filter('date')(rs.data.resultList[i].outTime, 'yyyy-MM-dd');
                }
                $scope.gridOptions2.data = rs.data.resultList;
            }
        });
    }

    //getPage2();


    function getPage3(regOptId) {

        $scope.params3.filters=[{
            field: "regOptId",
            value: regOptId
        },{
            field: "outType",
            value: "2"
        }];
        //$scope.params2.regOptId= regOptId;
        IHttp.post('basedata/queryMedicineOutRecordList',$scope.params3).then(function(rs) {
            // $scope.gridOptions.data = rs.data.searchRegOptByLoginNameAndStateFormBean;
            if (rs.status === 200 && rs.data.resultCode === '1') {
                $scope.gridOptions3.totalItems = rs.data.total;
                for (var i = 0; i < rs.data.resultList.length; i++) {
                    rs.data.resultList[i].outTime1=$filter('date')(rs.data.resultList[i].outTime, 'yyyy-MM-dd');
                }
                $scope.gridOptions3.data = rs.data.resultList;
            }
        });
    }

    //getPage3();

    $scope.setTalkInfo = function(type){
        $scope.talkInfo=type;
    }

    $scope.showIn = function(row){
        //查询用耗材情况
        getPage2(row.entity.regOptId);
        //查询取耗材记录
        getPage3(row.entity.regOptId);
    }

    $scope.query = function(){
        getPage();
        getPage1();
    }

    


   
    
}