OperCancelRateCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'i18nService', 'uiGridConstants', '$timeout'];

module.exports = OperCancelRateCtrl;

function OperCancelRateCtrl( $rootScope, $scope, IHttp, i18nService, uiGridConstants, $timeout) {
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


	$scope.OperCancle = {
	    operCancleNum: 0,
	    operTotal: 0,
	    rate: 0.0,
	};

	//麻醉开始后手术取消率
	$scope.gridOptionsOperCancle = {
		paginationPageSizes: [5, 10],
		paginationPageSize: 5,
		enableColumnMenus:false,//表头列的菜单按钮，默认fal
	    resizable: true,
	    rowHeight:25,
	    enableFiltering: false,
	    enableGridMenu: true,
	    exporterCsvFilename:'麻醉开始后手术开始前取消的手术数.csv',
	    exporterOlderExcelCompatibility: true,//为true时不使用utf-16编码
	    onRegisterApi:function(gridApi){
	        $scope.gridApiOperCancle = gridApi;
	    }
	};

	$scope.gridOptionsOperC = {
		paginationPageSizes: [5, 10],
		paginationPageSize: 5,
		enableColumnMenus:false,//表头列的菜单按钮，默认fal
	    resizable: true,
	    rowHeight: 40,
	    enableFiltering: false,
	    enableGridMenu: true,
	    exporterCsvFilename:'同期麻醉总数.csv',
	    exporterOlderExcelCompatibility: true,//为true时不使用utf-16编码
	    onRegisterApi:function(gridApi){
	        $scope.gridApiOperC = gridApi;
	    }
	};

	$scope.$on('query',function(ev, data){
		IHttp.post('qcMng/searchOperCancleRate', data).then((rs) => {
		    if (rs.status === 200 && rs.data.resultCode === '1') {
		    	let columns = [];
		    	let columnArr = rs.data.columnAry;
		    	
		    	for (let i = 0; i < columnArr.length; i++) {
		    	    let column = {
		    	        field: columnArr[i],
		    	        displayName:rs.data.columnAry[i]
		    	    };
		    	    columns[i] = column;
		    	}

		    	$scope.gridOptionsOperCancle.columnDefs = columns;
		    	$scope.gridOptionsOperCancle.data = rs.data.operCancleTableList;

		    	$scope.gridOptionsOperC.columnDefs = columns;
		    	$scope.gridOptionsOperC.data = rs.data.operTableList;

		    	$scope.OperCancle.operCancleNum = rs.data.operCancleNum;
		    	$scope.OperCancle.operTotal = rs.data.operTotal;
		    	$scope.OperCancle.rate = rs.data.rate;

    	    	$scope.eOption.series[0].data = [
    	            { value: rs.data.rate, name: '麻醉开始后手术开始前取消的手术数' },
    	            { 
    	            	value: 1000 - rs.data.rate, 
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