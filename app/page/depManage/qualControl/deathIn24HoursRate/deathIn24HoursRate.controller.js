DeathIn24HoursRateCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'i18nService', 'uiGridConstants', '$timeout'];

module.exports = DeathIn24HoursRateCtrl;

function DeathIn24HoursRateCtrl( $rootScope, $scope, IHttp, i18nService, uiGridConstants, $timeout) {
	$scope.eConfig = {
        dataLoaded: true,
        resize: true
    };
	$scope.eOption = {
	    series: [{
	        name: '访问来源',
	        type: 'pie',
	        radius: '55%',
	        itemStyle: {
	            normal: {
	                shadowBlur: 200,
	                shadowColor: 'rgba(0, 0, 0, 0.5)'
	            }
	        }
	    }]
	};

	//麻醉开始后24小时内死亡率参数---同期麻醉患者总数 
	$scope.OperByDeath24 = {
	    OperByDeath24Num: 0,
	    operTotal: 0,
	    rate: 0.0,
	};

	$scope.gridOptionsOperByDeath24top= {
		paginationPageSizes: [5, 10],
		paginationPageSize: 5,
	    resizable: true,
	    enableColumnMenus:false,//表头列的菜单按钮，默认fal
	    rowHeight: 40,
	    enableFiltering: false,
	    treeRowHeaderAlwaysVisible:false,
	    enableGridMenu: true,
	    exporterCsvFilename:'麻醉开始后24小时内死亡患者.csv',
	    exporterOlderExcelCompatibility: true,//为true时不使用utf-16编码
	    onRegisterApi:function(gridApi){
	        $scope.gridApiOperByDeath24top = gridApi;
	    }
	};

	//麻醉开始后24小时内死亡率---同期麻醉患者总数  excel 
	$scope.gridOptionsOperByDeath24 = {
		paginationPageSizes: [5, 10],
		paginationPageSize: 5,
	    resizable: true,
	    enableColumnMenus:false,//表头列的菜单按钮，默认fal
	    rowHeight: 40,
	    enableFiltering: false,
	    treeRowHeaderAlwaysVisible:false,
	    enableGridMenu: true,
	    exporterCsvFilename:'麻醉开始后24小时内死亡例数-同期麻醉患者总数.csv',
	    exporterOlderExcelCompatibility: true,//为true时不使用utf-16编码
	    onRegisterApi:function(gridApi){
	        $scope.gridApiOperByDeath24 = gridApi;
	    }
	};
			
	$scope.$on('query',function(ev, data){
		IHttp.post('qcMng/search24HourDealthRate', data).then((rs) => {
		    if (rs.status === 200 && rs.data.resultCode === '1') {
		    	let columns = [];
		    	let columnArr = rs.data.columnAry;
		    	
		    	for (let i = 0; i < columnArr.length; i++) {
		    	    let column = {
		    	        field: columnArr[i],
		    	        displayName:rs.data.columnAry[i],
		    	        name:columnArr[i]
		    	    };

		    	    if (columnArr[i] === '性别') {
		    	    	column.grouping = {
		    	    		groupPriority: 0
		    	    	};
		    	    	column.cellTemplate =  '<div><div ng-if="!col.grouping || col.grouping.groupPriority === undefined || col.grouping.groupPriority === null || ( row.groupHeader && col.grouping.groupPriority === row.treeLevel )" class="ui-grid-cell-contents" title="TOOLTIP">{{COL_FIELD CUSTOM_FILTERS}}</div></div>';
		    	    	column.sort = {priority:0,direction:'asc'};

		    	    }
		    	    columns[i] = column;
		    	}
		    	
		    	$scope.gridOptionsOperByDeath24.columnDefs = columns;
		    	$scope.gridOptionsOperByDeath24.data = rs.data.operTableList;

		    	$scope.gridOptionsOperByDeath24top.columnDefs = columns;
		    	$scope.gridOptionsOperByDeath24top.data = rs.data.toHourDeathTableList;

		    	

		    	$scope.OperByDeath24.OperByDeath24Num = rs.data.dealthNum;
		    	$scope.OperByDeath24.operTotal = rs.data.operTotal;
		    	$scope.OperByDeath24.rate = rs.data.rate;	

    	    	$scope.eOption.series[0].data = [
    	            { value: rs.data.rate, name: '麻醉开始后24小时内死亡患者数' },
    	            { 
    	            	value: 100 - rs.data.rate, 
    		            labelLine: {
    		                normal: {
    		                    lineStyle: {
    		                        color: 'rgba(255, 255, 255, 0.3)'
    		                    }
    		                }
    		            }
    	            }
    	        ];
    	        $scope.eConfig.dataLoaded = false;
		    }
		});
	});

    $scope.export = function(type) {
        $scope[type].exporter.csvExport('all', 'all');
    };

	$scope.$emit('childInited');
}