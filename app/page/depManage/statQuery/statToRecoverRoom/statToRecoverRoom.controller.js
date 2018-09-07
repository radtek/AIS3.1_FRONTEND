StatToRecoverRoomCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'i18nService', 'uiGridConstants', '$timeout', 'toastr'];

module.exports = StatToRecoverRoomCtrl;

function StatToRecoverRoomCtrl( $rootScope, $scope, IHttp, i18nService, uiGridConstants, $timeout, toastr) {
	var page = $rootScope.$state.current.name,
	    tempHtml = '<div class="ui-grid-cell-contents"><a ng-click=grid.appScope.query(row.entity)>查看</a><span>|</span><a ng-click=grid.appScope.edit(row.entity)>编辑</a><span>|</span><a ng-click=grid.appScope.cancel(row.entity)>取消</a></div>';

	i18nService.setCurrentLang('zh-cn');

	$scope.params = {
	    pageNo: 1,
	    pageSize: 15,
	    sort: '',
	    orderBy: '',
	    filters: [],
	    state: '01,02,08'
	};

	var promise;

	// $scope.eConfig = {
	//     dataLoaded: true,
	// 	   resize: true
	// };
	// $scope.eOption = {
	//     tooltip: {
	//         trigger: 'axis',
	//         axisPointer: { type: 'shadow' }
	//     },
	//     grid: { right: '40px', bottom: '70px', left: '40px' },
	//     dataZoom: [{ show: true, start: 0, end: 100 }, { type: 'inside', start: 0, end: 100 }],
	//     legend: {},
	    
	//     xAxis: {
	//         data: []
	//     },
	//     yAxis: {},
	//     series: []
	// };

	function setEchartOption(data) {
		if (!data.xAxis)
		    return;
		$scope.eConfig.dataLoaded = false;

		var len = data.xAxis.data.length * data.series.length;
		if (len >= 50 && len <= 150)
		    $scope.eOption.dataZoom[0].end = $scope.eOption.dataZoom[1].end = 50;
		else if (len >= 150 && len <= 250)
		    $scope.eOption.dataZoom[0].end = $scope.eOption.dataZoom[1].end = 30;
		else if (len >= 250 && len <= 500)
		    $scope.eOption.dataZoom[0].end = $scope.eOption.dataZoom[1].end = 15;
		else if (len > 500)
	    $scope.eOption.dataZoom[0].end = $scope.eOption.dataZoom[1].end = 5;
		$scope.eOption.legend = data.legend;
		$scope.eOption.xAxis = data.xAxis;
		$scope.eOption.yAxis = data.yAxis;

		if (len < 50) {
		    $scope.eOption.series = (function() {
		        var res = [];
		        data.series.map(function(data) {
		            data.barWidth = 15;
		            res.push(data);
		        })
		        return res;
		    })();
		} else {
		    $scope.eOption.series = data.series;
		}
	}

	$scope.gridOptions = {
	    enableFiltering: false, // 过滤栏显示
	    enableGridMenu: true, // 配置按钮显示
	    enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: true, // 禁止内部过滤，启用外部滤波器监听事件
	    useExternalSorting: true,
	    useExternalPagination: true, // 分页
	    paginationPageSizes: [ 15, 30, 50],
	    rowHeight: 40,
	    paginationPageSize: $scope.params.pageSize,
	    exporterCsvFilename: '麻醉科麻醉例数统计',
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
	                $scope.params.filters = filterArr;
	                getPage();
	            }, 1000)

	        });
	    }
	};

	function getPage() {

	}

	// 编辑
	$scope.edit = function(row) {
	    $rootScope.$state.go('editOperDateil', {
	        // uid: row.entity.regOptId
	    });
	}

	// 查看
	$scope.query = function(row) {
	    $rootScope.$state.go('preOperDateil', {
	        // uid: row.entity.regOptId
	    });
	}

	// 打印
	$scope.print = function(row) {

	}

	// 取消
	$scope.cancel = function(row) {

	}

	$scope.$on('export',function(){
        $scope.gridApi.exporter.csvExport('all','visible');//导出所有的行和显示的列
    });

	$scope.$on('query',function(ev, data){
		var param = {
            filters: [
            	{ field: 'startTime', value: data.startTime },
                { field: 'endTime', value: data.endTime },
                { field: 'leaveTo', value: '2' },
                { field: 'deptId', value: data.deptId }
            ]
        }
        if (!data.deptId) {
        	for(var i=0; i<param.filters.length; i++) {
        		if (param.filters[i].field === 'deptId')
        			param.filters.splice(i, 1);
        	}
        }
		IHttp.post('statistics/searchPatGroupByDept', param).then((rs) => {
		    if (rs.status === 200 && rs.data.resultCode === '1') {
		    	let data = {
		    	    "time": ["2016-10 例数"],
		    	    "field": ["total"],
		    	    "value": [],
		    	    "anaesMethodName": []
		    	};
		    	$scope.gridOptions.columnDefs = [{
		    	    field: 'name',
		    	    displayName: '科室',
		    	}, {
		    	    field: 'total',
		    	    displayName: '例数',
		    	}];
		    	$scope.gridOptions.data = rs.data.tableList;
		    	for (let j = 0; j < rs.data.tableList.length; j++) {
		    	    data.anaesMethodName.push(rs.data.tableList[j].name);
		    	    data.value.push([rs.data.tableList[j].total]);
		    	}

		    }
		});
	});
	$scope.$emit('childInited');
}