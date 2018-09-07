HeartStoppedIn24HourRateCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'i18nService', 'uiGridConstants', '$timeout'];

module.exports = HeartStoppedIn24HourRateCtrl;

function HeartStoppedIn24HourRateCtrl( $rootScope, $scope, IHttp, i18nService, uiGridConstants, $timeout) {
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
	//麻醉开始后24小时内心跳骤停率---下部分参数
	$scope.OperByAnes24hrCardiacArrestRate = {
	    hrCardiacArrestNum: 0,
	    operTotal: 0,
	    rate: 0.0,
	};
	//	麻醉开始后24小时内心跳骤停率 excel
	$scope.gridOptionsOperByAnes24hrCardiacArrestRatetop = {
	    resizable: true,
	    rowHeight: 40,
	    enableFiltering: false,
	    treeRowHeaderAlwaysVisible: false,
	    enableColumnMenus:false,//表头列的菜单按钮，默认fal
	    enableGridMenu: true,
	    exporterCsvFilename: '麻醉开始后24小时内心跳骤停患者.csv',
	    exporterOlderExcelCompatibility: true, //为true时不使用utf-16编码
	    onRegisterApi: function(gridApi) {
	        $scope.gridApiOperByAnes24hrCardiacArrestRatetop = gridApi;
	    }
	}

	//	麻醉开始后24小时内心跳骤停率 excel
	$scope.gridOptionsOperByAnes24hrCardiacArrestRate = {
	    resizable: true,
	    rowHeight: 40,
	    enableFiltering: false,
	    treeRowHeaderAlwaysVisible: false,
	    enableColumnMenus:false,//表头列的菜单按钮，默认fal
	    enableGridMenu: true,
	    exporterCsvFilename: '麻醉开始后24小时内心跳骤停率-同期麻醉患者总数.csv',
	    exporterOlderExcelCompatibility: true, //为true时不使用utf-16编码
	    onRegisterApi: function(gridApi) {
	        $scope.gridApiOperByAnes24hrCardiacArrestRate = gridApi;
	    }
	};

	$scope.$on('query',function(ev, data){
		IHttp.post('qcMng/searchAnes24hrCardiacArrestRate', data).then((rs) => {
		    if (rs.status === 200 && rs.data.resultCode === '1') {
		    		let columns = [];
		    	   	let columnArr = rs.data.columnAry;
		    	   	for (let i = 0; i < columnArr.length; i++) {
		    	       let column = {
		    	           field: columnArr[i],
		    	           displayName: rs.data.columnAry[i],
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
		    	   
		    	   $scope.gridOptionsOperByAnes24hrCardiacArrestRate.columnDefs = columns;
		    	   $scope.gridOptionsOperByAnes24hrCardiacArrestRate.data = rs.data.operTableList;

		    	   $scope.gridOptionsOperByAnes24hrCardiacArrestRatetop.columnDefs = columns;
		    	   $scope.gridOptionsOperByAnes24hrCardiacArrestRatetop.data = rs.data.toCardiacArrestTableList;




		    	   $scope.OperByAnes24hrCardiacArrestRate.operTotal = rs.data.operTotal;
		    	   $scope.OperByAnes24hrCardiacArrestRate.rate = rs.data.rate;
		    	   $scope.OperByAnes24hrCardiacArrestRate.hrCardiacArrestNum = rs.data.hrCardiacArrestNum;

	    	       	$scope.eOption.series[0].data = [
	    	               { value: rs.data.rate, name: '麻醉开始后24小时内心脏骤停患者数' },
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