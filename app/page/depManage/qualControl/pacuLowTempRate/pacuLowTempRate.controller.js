PacuLowTempRateCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'i18nService', 'uiGridConstants', '$timeout'];

module.exports = PacuLowTempRateCtrl;

function PacuLowTempRateCtrl( $rootScope, $scope, IHttp, i18nService, uiGridConstants, $timeout) {
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

    $scope.AnaesPacuLowTemp = {
	    paNum: 0,
	    paTotal: 0,
	    rate: 0,
	};

    //PACU入室低体温
	$scope.gridOptionsAnaesPacuLowTemp = {
		paginationPageSizes: [5, 10],
		paginationPageSize: 5,
		enableColumnMenus:false,//表头列的菜单按钮，默认fal
	    resizable: true,
	    rowHeight: 40,
	    enableFiltering: false,
	    enableGridMenu: true,
	    exporterCsvFilename:'PACU入室低体温的患者数.csv',
	    exporterOlderExcelCompatibility: true,//为true时不使用utf-16编码
	    onRegisterApi:function(gridApi){
	        $scope.gridApiAnaesPacuLowTemp = gridApi;
	    }
	};

	$scope.gridOptionsAnaesPacuLowTempSameDate= {
		paginationPageSizes: [5, 10],
		paginationPageSize: 5,
		enableColumnMenus:false,//表头列的菜单按钮，默认fal
	    resizable: true,
	    rowHeight: 40,
	    enableFiltering: false,
	    enableGridMenu: true,
	    exporterCsvFilename:'同期入PACU患者总数.csv',
	    exporterOlderExcelCompatibility: true,//为true时不使用utf-16编码
	    onRegisterApi:function(gridApi){
	        $scope.gridApiAnaesPacuLowTempSameDate = gridApi;
	    }
	};

	$scope.$on('query',function(ev, data){
		IHttp.post('qcMng/searchAnaesPacuLowTempRate', data).then((rs) => {
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
		    	
		    	$scope.gridOptionsAnaesPacuLowTemp.columnDefs = columns;
		    	$scope.gridOptionsAnaesPacuLowTemp.data = rs.data.pacuLowTempTableList;

		    	$scope.AnaesPacuLowTemp.paNum = rs.data.pacuLowTempNum;
		    	$scope.AnaesPacuLowTemp.paTotal = rs.data.operTotal;
		    	$scope.AnaesPacuLowTemp.rate = rs.data.rate;

		    	$scope.gridOptionsAnaesPacuLowTempSameDate.columnDefs = columns;
		    	$scope.gridOptionsAnaesPacuLowTempSameDate.data = rs.data.operTableList;

    	    	$scope.eOption.series[0].data = [
    	            { value: rs.data.rate, name: 'PACU入室低体温的患者数' },
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