operDictionaryCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'i18nService','confirm','auth', '$filter','uiGridConstants', '$timeout','select','$q', 'toastr', '$uibModal'];

module.exports = operDictionaryCtrl;

function operDictionaryCtrl( $rootScope, $scope, IHttp, i18nService,confirm,auth,$filter, uiGridConstants, $timeout,select,$q, toastr, $uibModal) {
	i18nService.setCurrentLang('zh-cn');
    vm = this;
    $scope.talkInfo=0;
    var user=auth.loginUser();
    vm.regOptId = '';
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
        filters:  [{"field":"outInstrument","value":"0"}]
    };
    $scope.params2 = {
        pageNo: 1,
        pageSize: 15,
        orderBy: '',
        sort: '',
        beid:user.beid,
        module:user.module,
        filters: [{"field":"outInstrument","value":"1"}]
    };
    $scope.params3 = {
        pageNo: 1,
        pageSize: 15,
        orderBy: '',
        sort: '',
        filters: []
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
                    //$scope.params.filters = filterArr;
	                getPage();
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
                    width:230,
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
                } ,{
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
                    enableFiltering: false,  
                    displayName: '手术日期',
                    cellTooltip: function(row, col) {
                        return row.entity.operaDate;
                    },
                    cellTemplate:'<div ng-click=grid.appScope.showIn(row) title="{{row.entity.operaDate}}"  class="ui-grid-cell-contents hand">{{row.entity.operaDate}}</div>' 
                }]
	};

    $scope.gridOptions2 = {
        enableFiltering: true, // 过滤栏显示
        enableGridMenu: true, // 配置按钮显示
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: false, // 禁止内部过滤，启用外部滤波器监听事件
        useExternalSorting: true,
        showColumnFooter: true,
        useExternalPagination: true, // 分页
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
                getPage2();
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
                    //$scope.params2.filters = filterArr;
                    getPage2();
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
                    width:230,
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
                    field: 'instrumentName',
                    displayName: '耗材名称',
                    width:120,
                    cellTooltip: function(row, col) {
                        return row.entity.instrumentName;
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
                    field: 'outTime',
                    displayName: '取耗材时间',
                    width:113,
                    cellTooltip: function(row, col) {
                        return row.entity.outTime;
                    }
                }, {
                    field: 'receiveName',
                    displayName: '领用人',
                    cellTooltip: function(row, col) {
                        return row.entity.receiveName;
                    }
                },  {
                    field: 'id',
                    width:130,
                    displayName: '操作',
                    enableFiltering: false,
                    enableSorting: false,
                    cellTemplate: '<div class="ui-grid-cell-contents" ><a href="" ng-click=grid.appScope.editIn(row)>退耗材</a><span>|</span><a href="" ng-click=grid.appScope.setbad(row)>报损</a><span>|</span><a href="" ng-click=grid.appScope.deleteIn(row)>删除</a></div>'
                }
                ]
    };

	function getPage() {
        var startTime=$scope.startTime;
            var endTime=$scope.endTime;
            $scope.params.filters=[{"field":"outInstrument","value":"0"},{"field":"startTime","value":startTime},{"field":"endTime","value":endTime}];
            
		IHttp.post('basedata/selectRegOptInfoForOutRecord',$scope.params).then(function(rs) {
		    // $scope.gridOptions.data = rs.data.searchRegOptByLoginNameAndStateFormBean;
		    if (rs.status === 200 && rs.data.resultCode === '1') {
		    	$scope.gridOptions.totalItems = rs.data.total;
		    	$scope.gridOptions.data = rs.data.resultList;
		    }
		});
	}

	getPage();

    function getPage2() {
        setTimeout(function(){
            var startTime=$scope.startTime;
            var endTime=$scope.endTime;
            $scope.params2.filters=[{"field":"outInstrument","value":"1"},{"field":"startTime","value":startTime},{"field":"endTime","value":endTime}];
            
            IHttp.post('basedata/selectRegOptInfoForOutRecord',$scope.params2).then(function(rs) {
            // $scope.gridOptions.data = rs.data.searchRegOptByLoginNameAndStateFormBean;
            if (rs.status === 200 && rs.data.resultCode === '1') {
                $scope.gridOptions2.totalItems = rs.data.total;
                $scope.gridOptions2.data = rs.data.resultList;
            }
        });
        },100);        
    }

    getPage2();

    $scope.query=function(){
       getPage();
       getPage2(); 
    }


    function getPage3(regOptId) {
        if (!regOptId)
            regOptId = vm.regOptId;
        $scope.params3.filters=[{
            field: "regOptId",
            value: regOptId
        },{
            field: "outType",
            value: "2"
        }];
        IHttp.post('basedata/queryConsumablesOutRecordList',$scope.params3).then(function(rs) {
            // $scope.gridOptions.data = rs.data.searchRegOptByLoginNameAndStateFormBean;
            if (rs.status === 200 && rs.data.resultCode === '1') {
                $scope.gridOptions3.totalItems = rs.data.total;
                for (var i = 0; i < rs.data.resultList.length; i++) {
                    rs.data.resultList[i].outTime=$filter('date')(rs.data.resultList[i].outTime, 'yyyy-MM-dd');
                }
                $scope.gridOptions3.data = rs.data.resultList;
            }
        });
    }

    function getPa(regOptId) {
        // var params={
        //     field: "regOptId",
        //     value: regOptId
        // };
        var params={
            regOptId: regOptId
        };
        IHttp.post('operation/searchApplication',params).then(function(rs) {            
            if (rs.status === 200 && rs.data.resultCode === '1') {
                $scope.resultDispatch=rs.data.resultDispatch;
                $scope.resultRegOpt=rs.data.resultRegOpt;
                if($scope.resultRegOpt.isLocalAnaes===0){
                    $scope.resultRegOpt.localAnaes="全麻";
                }else if($scope.resultRegOpt.isLocalAnaes===1){
                    $scope.resultRegOpt.localAnaes="局麻";
                }
            }
        });
    }

    $scope.setTalkInfo = function(type){
        $scope.talkInfo=type;
    }

    $scope.showIn = function(row){
        vm.regOptId = row.entity.regOptId;
        //查询详情
        getPa(row.entity.regOptId);
        //查询用耗材记录
        getPage3(row.entity.regOptId);
    }

    $scope.editIn = function(row) {
        //退耗材
        var scope = $rootScope.$new();
        scope.data = {
            tag: '0',
            row: row
        };
        $uibModal.open({
            animation: true,
            size: 'lg',
            template: require('../operDictionary/talkoperDictionaryEdit.html'),
            controller: require('../operDictionary/talkoperDictionaryEdit.controller'),
            less: require('../operDictionary/talkoperDictionaryEdit.less'),
            controllerAs: 'vm',
               backdrop:'static',
            scope: scope
        })
        .result
        .then((data) => {
            if (data === 'success') {
                if($scope.resultRegOpt && $scope.resultRegOpt.regOptId){
                    getPage3($scope.resultRegOpt.regOptId);
                }
            }
        })
    };

    $scope.setbad = function(row) {
        var scope = $rootScope.$new();
        scope.data = {
            tag: '0',
            row: row
        };

        $uibModal.open({
            animation: true,
            size: 'lg',
            template: require('../operDictionary/badoperDictionaryEdit.html'),
            controller: require('../operDictionary/badoperDictionaryEdit.controller'),
            less: require('../operDictionary/badoperDictionaryEdit.less'),
            controllerAs: 'vm',
               backdrop:'static',
            scope: scope
        })
        .result
        .then((data) => {
            if (data === 'success') {
                if($scope.resultRegOpt && $scope.resultRegOpt.regOptId){
                    getPage3($scope.resultRegOpt.regOptId);
                }
            }
        })
    };
   

    $scope.deleteIn = function(row) {
        confirm.show("是否确认删除此记录？").then(function(data) {
                 var deleteInParams = {
                     id: row.entity.id
                 };
                 
                 IHttp.post('basedata/delConsumablesOutRecord', deleteInParams)
                     .then((rs) => {
                         if (rs.status === 200 && rs.data.resultCode === '1') {
                             toastr.info("删除成功！");
                             if($scope.resultRegOpt && $scope.resultRegOpt.regOptId){
                                 getPage3($scope.resultRegOpt.regOptId);
                             }
                         }
                         
                     });
            });
    }



    $scope.addmed=function(){
        var scope = $rootScope.$new();
        var talkname="";
        if($scope.resultRegOpt && $scope.resultRegOpt.regOptId){

            if($scope.resultRegOpt.isLocalAnaes===0){
                talkname=$scope.resultDispatch.anesthetistName;
            }else if($scope.resultRegOpt.isLocalAnaes===1){
                talkname=$scope.resultDispatch.circunurseName1;
            }
            scope.data = {
                tag: '0',
                outType:2,
                receiveName:talkname,
                regOptId:$scope.resultDispatch.regOptId,
                beid:user.beid
            };

            $uibModal.open({
                animation: true,
                size: 'lg',
                template: require('../operDictionary/operDictionaryEdit.html'),
                controller: require('../operDictionary/operDictionaryEdit.controller'),
                less: require('../operDictionary/operDictionaryEdit.less'),
                controllerAs: 'vm',
                   backdrop:'static',
                scope: scope
            })
            .result
            .then((data) => {
                if (data === 'success') {
                    if($scope.resultRegOpt && $scope.resultRegOpt.regOptId){
                        getPage3($scope.resultRegOpt.regOptId);
                    }
                }
            })
        }else{
            toastr.error("请先选择一个患者");
        }
    }
    
}