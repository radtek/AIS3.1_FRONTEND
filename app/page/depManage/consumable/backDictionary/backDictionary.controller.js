backDictionaryCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'i18nService', 'confirm','uiGridConstants', '$timeout','$filter', 'toastr', '$uibModal','auth'];

module.exports = backDictionaryCtrl;

function backDictionaryCtrl( $rootScope, $scope, IHttp, i18nService,confirm, uiGridConstants, $timeout,$filter, toastr, $uibModal,auth) {
		
	   
		i18nService.setCurrentLang('zh-cn');

        $scope.startTime= $filter('date')(new Date(), 'yyyy-MM-dd');
        $scope.endTime=$filter('date')(new Date(), 'yyyy-MM-dd');

        var pagesize=15;

		var promise;
		$scope.params = {
			pageNo: 1,
			pageSize: pagesize,
			orderBy: '',
			sort: '',
			filters: []
		};
        $scope.params2 = {
            pageNo: 1,
            pageSize: pagesize,
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
            exporterCsvFilename:'普通退耗材记录.csv',
            exporterOlderExcelCompatibility: true,
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
		    columnDefs: [{
                    field: 'retreatTime',
                    displayName: '时间',
                    width:130,
                    enableFiltering: false,  
                    cellTooltip: function(row, col) {
                        return row.entity.retreatTime;
                    }
                },{
                    field: 'instrumentName',     
                    displayName: '耗材名称',
                    width:230,
                    cellTooltip: function(row, col) {
                        return row.entity.instrumentName;
                    }
                },
                //  {
                //     field: 'firm',
                //     displayName: '厂家名称',                   
                //     cellTooltip: function(row, col) {
                //         return row.entity.firm;
                //     }
                // },
                {
                    field: 'spec',
                    displayName: '规格',                   
                    cellTooltip: function(row, col) {
                        return row.entity.spec;
                    }
                },
                {
                    field: 'batch',
                    displayName: '耗材批号',
                    cellTooltip: function(row, col) {
                        return row.entity.batch;
                    }
                }, {
                    field: 'retreatNumber',
                    displayName: '退耗材',
                    cellTooltip: function(row, col) {
                        return row.entity.retreatNumber;
                    }
                }, {
                    field: 'operator',
                    displayName: '经办人',
                    cellTooltip: function(row, col) {
                        return row.entity.operator;
                    }
                }, {
                    field: 'retreatName',
                    displayName: '退耗材人',                   
                    cellTooltip: function(row, col) {
                        return row.entity.retreatName;
                    }
                }]
		};

        $scope.gridOptions2 = {
            resizable: true,
            enableFiltering: true, // 过滤栏显示
            enableGridMenu: true, // 配置按钮显示
            enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: true, // 禁止内部过滤，启用外部滤波器监听事件
            useExternalSorting: true,
            showColumnFooter: true,
            useExternalPagination: true, // 分页
            paginationPageSizes: [ 15, 30, 50],
            rowHeight: 40,
            paginationPageSize: $scope.params2.pageSize,
            exporterCsvFilename:'手术退耗材记录.csv',
            exporterOlderExcelCompatibility: true,
            onRegisterApi: function(gridApi2) {
                $scope.gridApi2 = gridApi2;
                $scope.gridApi2.core.on.sortChanged($scope, function(grid, sortColumns) {
                    if (sortColumns.length === 0) {
                        $scope.params2.orderBy = '';
                    } else {
                        $scope.params2.orderBy = sortColumns[0].sort.direction;
                        $scope.params2.sort = sortColumns[0].colDef.field;
                    }
                    getPage();
                });
                gridApi2.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                    $scope.params2.pageNo = newPage;
                    $scope.params2.pageSize = pageSize;
                    getPage();
                });
                $scope.gridApi2.core.on.filterChanged($scope, function() {
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
                        getPage();
                    }, 1000)

                });
            },
            columnDefs: [{
                    field: 'retreatTime',
                    displayName: '时间',
                    enableFiltering: false,  
                    width:130,
                    cellTooltip: function(row, col) {
                        return row.entity.retreatTime;
                    }
                },{
                    field: 'designedOptName',     
                    displayName: '手术名称',
                    width:200,
                    cellTooltip: function(row, col) {
                        return row.entity.designedOptName;
                    }
                }, {
                    field: 'name',
                    displayName: '姓名',                   
                    cellTooltip: function(row, col) {
                        return row.entity.name;
                    }
                },{
                    field: 'sex',
                    displayName: '性别',                   
                    cellTooltip: function(row, col) {
                        return row.entity.sex;
                    }
                },{
                    field: 'age',
                    displayName: '年龄',
                    cellTooltip: function(row, col) {
                        return row.entity.age;
                    }
                },{
                    field: 'hid',
                    displayName: '住院号',
                    cellTooltip: function(row, col) {
                        return row.entity.hid;
                    }
                }, {
                    field: 'instrumentName',     
                    displayName: '耗材名称',
                    cellTooltip: function(row, col) {
                        return row.entity.instrumentName;
                    }
                },
                //  {
                //     field: 'firm',
                //     displayName: '厂家名称',                   
                //     cellTooltip: function(row, col) {
                //         return row.entity.firm;
                //     }
                // },{
                //     field: 'spec',
                //     displayName: '规格',                   
                //     cellTooltip: function(row, col) {
                //         return row.entity.spec;
                //     }
                // },
                {
                    field: 'batch',
                    displayName: '耗材批号',
                    cellTooltip: function(row, col) {
                        return row.entity.batch;
                    }
                }, {
                    field: 'retreatNumber',
                    displayName: '退耗材',
                    cellTooltip: function(row, col) {
                        return row.entity.retreatNumber;
                    }
                }, {
                    field: 'operator',
                    displayName: '经办人',
                    cellTooltip: function(row, col) {
                        return row.entity.operator;
                    }
                }, {
                    field: 'retreatName',
                    displayName: '退耗材人',                   
                    cellTooltip: function(row, col) {
                        return row.entity.retreatName;
                    }
                }]
        };


		function getPage() {
            var startTime=$scope.startTime;
            var endTime=$scope.endTime;
            $scope.params.filters=[{"field":"startTime","value":startTime},{"field":"endTime","value":endTime}];
			IHttp.post('/basedata/queryConsumablesCommonRetreatRecordList',$scope.params).then(function(rs) {
			    // $scope.gridOptions.data = rs.data.searchRegOptByLoginNameAndStateFormBean;
			    if (rs.status === 200 && rs.data.resultCode === '1') {
			    	$scope.gridOptions.totalItems = rs.data.total;
                     var data=rs.data.resultList;
                    for (var i = 0; i <data.length; i++) {
                        if(data[i].retreatTime){
                            data[i].retreatTime=$filter('date')(data[i].retreatTime, 'yyyy-MM-dd HH:mm');
                        }                        
                    }
                    $scope.gridOptions.data = data;
			    }
			});
		}

		getPage();

        function getPage2() {
            var startTime=$scope.startTime;
            var endTime=$scope.endTime;
            $scope.params2.filters=[{"field":"startTime","value":startTime},{"field":"endTime","value":endTime}];

            IHttp.post('basedata/queryConsumablesOperationRetreatRecordList',$scope.params2).then(function(rs) {
                // $scope.gridOptions.data = rs.data.searchRegOptByLoginNameAndStateFormBean;
                if (rs.status === 200 && rs.data.resultCode === '1') {
                    $scope.gridOptions2.totalItems = rs.data.total;
                     var data=rs.data.resultList;
                    for (var i = 0; i <data.length; i++) {
                        if(data[i].retreatTime){
                            data[i].retreatTime=$filter('date')(data[i].retreatTime, 'yyyy-MM-dd HH:mm');
                        }                        
                    }
                    $scope.gridOptions2.data = data;
                }
            });
        }

        getPage2();

        $scope.query=function(){
            getPage();
            getPage2();
        }

        $scope.export=function(type){
            if(type==1){
                pagesize = $scope.gridOptions.totalItems;
                $scope.params.pageNo = 1;
                $scope.params.pageSize = pagesize;
                getPage();
                setTimeout(function(){
                    $scope.gridApi.exporter.csvExport('all','visible');//导出所有的行和显示的列
                    pagesize = 15;
                },1000); 
            }else{
                pagesize = $scope.gridOptions2.totalItems;
                $scope.params2.pageNo = 1;
                $scope.params2.pageSize = pagesize;
                getPage2();
                setTimeout(function(){
                    $scope.gridApi2.exporter.csvExport('all','visible');//导出所有的行和显示的列
                    pagesize = 15;
                },1000); 
            }
             
        }

        
}