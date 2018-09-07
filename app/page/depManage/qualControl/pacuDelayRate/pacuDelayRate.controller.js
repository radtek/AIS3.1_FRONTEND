PacuDelayRateCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'i18nService', 'uiGridConstants', '$timeout'];

module.exports = PacuDelayRateCtrl;

function PacuDelayRateCtrl( $rootScope, $scope, IHttp, i18nService, uiGridConstants, $timeout) {
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

    $scope.AnaesPacuDelay = {
	    paNum: 0,
	    paTotal: 0,
	    rate: 0,
	};

    //麻醉后监测治疗室（PACU）转出延迟率
	$scope.gridOptionsAnaesPacuDelay = {
		paginationPageSizes: [5, 10],
		paginationPageSize: 5,
		enableColumnMenus:false,//表头列的菜单按钮，默认fal
	    resizable: true,
	    rowHeight: 40,
	    enableFiltering: false,
	    enableGridMenu: true,
	    exporterCsvFilename:'入PACU超过3小时的患者.csv',
	    exporterOlderExcelCompatibility: true,//为true时不使用utf-16编码
	    onRegisterApi:function(gridApi){
	        $scope.gridApiAnaesPacuDelay = gridApi;
	    }
	};

	$scope.gridOptionsAnaesPacuDelaySameDate= {
		paginationPageSizes: [5, 10],
		paginationPageSize: 5,
		enableColumnMenus:false,//表头列的菜单按钮，默认fal
	    resizable: true,
	    rowHeight: 40,
	    enableFiltering: false,
	    enableGridMenu: true,
	    exporterCsvFilename:'同期入PACU患者超过3小时的患者.csv',
	    exporterOlderExcelCompatibility: true,//为true时不使用utf-16编码
	    onRegisterApi:function(gridApi){
	        $scope.gridApiAnaesPacuDelaySameDate = gridApi;
	    }
	};

	$scope.$on('query',function(ev, data){
		IHttp.post('qcMng/searchAnaesPacuDelayRate', data).then((rs) => {
		    if (rs.status === 200 && rs.data.resultCode === '1') {
		    	let columns = [];
		    	let columnArr = rs.data.columnAry;

		    	for (let i = 0; i < columnArr.length; i++) {
		    	    let column = {
		    	        field: columnArr[i],
		    	        displayName: rs.data.columnAry[i]
		    	    };
		    	    columns[i] = column;
		    	}
		    	
		    	$scope.gridOptionsAnaesPacuDelay.columnDefs = columns;
		    	$scope.gridOptionsAnaesPacuDelay.data = rs.data.operCancleTableList;

		    	$scope.AnaesPacuDelay.paNum = rs.data.pacuDelayNum;
		    	$scope.AnaesPacuDelay.paTotal = rs.data.operTotal;
		    	$scope.AnaesPacuDelay.rate = rs.data.rate;
		    	$scope.gridOptionsAnaesPacuDelaySameDate.columnDefs = columns;
		    	$scope.gridOptionsAnaesPacuDelaySameDate.data= rs.data.operTableList;

    	    	$scope.eOption.series[0].data = [
    	            { value: rs.data.rate, name: '入PACU超过3小时的患者数' },
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