StatAnaesEffectCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'i18nService', 'uiGridConstants', '$timeout', 'toastr'];

module.exports = StatAnaesEffectCtrl;

function StatAnaesEffectCtrl( $rootScope, $scope, IHttp, i18nService, uiGridConstants, $timeout, toastr) {
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

	$scope.eConfig = {
	    dataLoaded: true,
	    resize: true
	};
	$scope.eOption = {
	    tooltip: {
	        trigger: 'axis',
	        axisPointer: { type: 'shadow' }
	    },
	    grid: { right: '40px', bottom: '70px', left: '40px' },
	    dataZoom: [{ show: true, start: 0, end: 100 }, { type: 'inside', start: 0, end: 100 }],
	    legend: {},
	    
	    xAxis: {
	        data: []
	    },
	    yAxis: {},
	    series: []
	};

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
		// $scope.eOption.yAxis = data.yAxis;
		 $scope.eOption.yAxis = {}

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
	    exporterCsvFilename: '麻醉效果统计',
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
		IHttp.post('statistics/searchAnaesEffectCountByAnaesMethod', data).then((rs) => {
		    if (rs.data.resultCode !== '1') return;
	    	let columns = [{
                field: 'anaMedName',
                displayName: '麻醉方法',
            }, {
                field: 'fst',
                displayName: '一级',
            }, {
                field: 'sec',
                displayName: '二级'
            }, {
                field: 'thd',
                displayName: '三级',
            }, {
                field: 'fou',
                displayName: '四级'
            }, {
                field: 'total',
                displayName: '总计'
            }];
	    	$scope.gridOptions.columnDefs = columns;
	    	$scope.gridOptions.data = rs.data.tableList;
	    	setEchartOption(rs.data);
		});
	});

	$scope.$emit('childInited');
}