EmergencyRateCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'i18nService', 'uiGridConstants', '$timeout'];

module.exports = EmergencyRateCtrl;

function EmergencyRateCtrl( $rootScope, $scope, IHttp, i18nService, uiGridConstants, $timeout) {
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

	$scope.EmergencyOper = {
	    emergencyTotal: 0,
	    operTotal: 0,
	    rate: 0.0,
	};

	//急诊非择期麻醉比例
	$scope.gridOptionsEmergencyOper = {
		paginationPageSizes: [5, 10],
		paginationPageSize: 5,
	    resizable: true,
	    rowHeight: 40,
	    enableFiltering: false,
	    enableColumnMenus:false,//表头列的菜单按钮，默认fal
	    enableGridMenu: true,
	    exporterCsvFilename:'急诊非择期手术例数.csv',
	    exporterOlderExcelCompatibility: true,//为true时不使用utf-16编码
	    onRegisterApi:function(gridApi){
	        $scope.gridApiEmergencyOper = gridApi;
	    }
	};

	$scope.gridOptionsOper = {
		paginationPageSizes: [5, 10],
		paginationPageSize: 5,
	    resizable: true,
	    rowHeight: 40,
	    enableFiltering: false,
	    enableColumnMenus:false,//表头列的菜单按钮，默认fal
	    enableGridMenu: true,
	    exporterCsvFilename:'麻醉例数总数.csv',
	    exporterOlderExcelCompatibility: true,//为true时不使用utf-16编码
	    onRegisterApi:function(gridApi){
	        $scope.gridApiOper = gridApi;
	    }
	};


	$scope.$on('query',function(ev, data){
		IHttp.post('qcMng/searchEmergencyOper', data).then((rs) => {
		    if (rs.status === 200 && rs.data.resultCode === '1') {
		    	var columns = [];
		    	var columnArr = rs.data.columnAry;
		    	
		    	for (var i = 0; i < columnArr.length; i++) {
		    	    var column = {
		    	        field: columnArr[i],
		    	        displayName:rs.data.columnAry[i]
		    	    };
		    	    columns[i] = column;
		    	}
		    	
		    	$scope.gridOptionsEmergencyOper.columnDefs = columns;
		    	$scope.gridOptionsEmergencyOper.data = rs.data.emergencyTableList;

		    	$scope.gridOptionsOper.columnDefs = columns;
		    	$scope.gridOptionsOper.data = rs.data.operTableList;

		    	$scope.EmergencyOper.emergencyTotal = rs.data.emergencyTotal;
		    	$scope.EmergencyOper.operTotal = rs.data.operTotal;
		    	$scope.EmergencyOper.rate = rs.data.rate;

    	    	$scope.eOption.series[0].data = [
    	            { value: rs.data.rate, name: '急诊非择期手术所实施的麻醉数' },
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