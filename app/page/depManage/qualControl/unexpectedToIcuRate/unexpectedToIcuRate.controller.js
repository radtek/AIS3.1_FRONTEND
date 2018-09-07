UnexpectedToIcuRateCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'i18nService', 'uiGridConstants', '$timeout'];

module.exports = UnexpectedToIcuRateCtrl;

function UnexpectedToIcuRateCtrl( $rootScope, $scope, IHttp, i18nService, uiGridConstants, $timeout) {
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

	$scope.OperBynoticu = {
	    nonPlanICUNum: 0,
	    operTotal: 0,
	    rate: 0.0,
	};

    //非计划转入icu率---上部分  excel 
	$scope.gridOptionsOperBynoticu = {
		paginationPageSizes: [5, 10],
		paginationPageSize: 5,
		enableColumnMenus:false,//表头列的菜单按钮，默认fal
	    resizable: true,
	    rowHeight: 40,
	    enableFiltering: false,
	    treeRowHeaderAlwaysVisible:false,
	    enableGridMenu: true,
	    exporterCsvFilename:'非计划转入icu患者.csv',
	    exporterOlderExcelCompatibility: true,//为true时不使用utf-16编码
	    onRegisterApi:function(gridApi){  
	        $scope.gridApiOperBynoticu = gridApi;
	    }

	};
	//非计划转入icu率---下部分  excel 
	$scope.gridOptionsOperBynoticuSameDate = {
		paginationPageSizes: [5, 10],
		paginationPageSize: 5,
		enableColumnMenus:false,//表头列的菜单按钮，默认fal
	    resizable: true,
	    rowHeight: 40,
	    enableFiltering: false,
	    treeRowHeaderAlwaysVisible:false,
	    enableGridMenu: true,
	    exporterCsvFilename:'非计划转入icu率-同期转入ICU患者.csv',
	    exporterOlderExcelCompatibility: true,//为true时不使用utf-16编码
	    onRegisterApi:function(gridApi){  
	        $scope.gridApiOperBynoticuSameDate = gridApi;
	    }

	};	

	$scope.$on('query',function(ev, data){
		IHttp.post('qcMng/searchNonPlanToICURate', data).then((rs) => {
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
	            
	            $scope.gridOptionsOperBynoticu.columnDefs = columns;
	            $scope.gridOptionsOperBynoticu.data = rs.data.toICUQmFjhTableList;
	            $scope.gridOptionsOperBynoticuSameDate.columnDefs = columns;
	            $scope.gridOptionsOperBynoticuSameDate.data = rs.data.operTableList;

	            $scope.OperBynoticu.nonPlanICUNum = rs.data.nonPlanICUNum;
	            $scope.OperBynoticu.toICUOperTotal = rs.data.toICUOperTotal;
	            $scope.OperBynoticu.rate = rs.data.rate;

            	$scope.eOption.series[0].data = [
                    { value: rs.data.rate, name: '非计划转入ICU患者数' },
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