HoarsenessRateCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'i18nService', 'uiGridConstants', '$timeout'];

module.exports = HoarsenessRateCtrl;

function HoarsenessRateCtrl( $rootScope, $scope, IHttp, i18nService, uiGridConstants, $timeout) {
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
    $scope.GenAnesHoarse = {
	    extubatTotal: 0,
	    tubesTotal: 0,
	    rate: 0.0,
	};
    //全麻气管插管拔管后声音嘶哑发生率
	$scope.gridOptionsGenAnesHoarsetop = {
		paginationPageSizes: [5, 10],
		paginationPageSize: 5,
		enableColumnMenus:false,//表头列的菜单按钮，默认fal
	    resizable: true,
	    rowHeight: 40,
	    enableFiltering: false,
	    enableGridMenu: true,
	    exporterCsvFilename:'全麻气管插管拔管后声音嘶哑发生患者.csv',
	    exporterOlderExcelCompatibility: true,//为true时不使用utf-16编码
	    onRegisterApi:function(gridApi){
	        $scope.gridApiGenAnesHoarsetop = gridApi;
	    },
	    columnDefs:[
	        {
	            field:'name',
	            displayName:'患者姓名',
	            cellTooltip: function(row, col) {
	        		return row.entity.name;
	    		}
	        },{
	            field:'sex',
	            displayName:'性别',
	            cellTooltip: function(row, col) {
	        		return row.entity.sex;
	    		}
	        },{
	            field:'age',
	            displayName:'年龄',
	            cellTooltip: function(row, col) {
	        		return row.entity.age;
	    		}
	        },{
	            field:'hid',
	            displayName:'住院号',
	            cellTooltip: function(row, col) {
	        		return row.entity.hid;
	    		}
	        },{
	            field:'operaDate',
	            displayName:'手术日期',
	            cellTooltip: function(row, col) {
	        		return row.entity.operaDate;
	    		}
	        },{
	            field:'operatorName',
	            displayName:'手术医生',
	            cellTooltip: function(row, col) {
	        		return row.entity.operatorName;
	    		}
	        },{
	            field:'designedOptName',
	            displayName:'手术名称',
	            cellTooltip: function(row, col) {
	        		return row.entity.designedOptName;
	    		}
	        },{
	            field:'anaesMethodName',
	            displayName:'麻醉方法',
	            cellTooltip: function(row, col) {
	        		return row.entity.anaesMethodName;
	    		}
	        },{
	            field:'anesthetistName',
	            displayName:'麻醉医生',
	            cellTooltip: function(row, col) {
	        		return row.entity.anesthetistName;
	    		}
	        },{
	            field:'circunurseName',
	            displayName:'巡回护士',
	            cellTooltip: function(row, col) {
	        		return row.entity.circunurseName;
	    		}
	        },{
	            field:'hoarse',
	            displayName:'是否声音嘶哑',
	            cellTooltip: function(row, col) {
	        		return row.entity.hoarse;
	    		}
	        },
	    ]

	};

	$scope.gridOptionsGenAnesHoarse= {
		paginationPageSizes: [5, 10],
		paginationPageSize: 5,
		enableColumnMenus:false,//表头列的菜单按钮，默认fal
	    resizable: true,
	    rowHeight: 40,
	    enableFiltering: false,
	    enableGridMenu: true,
	    exporterCsvFilename:'同期入PACU患者总数-全麻气管插管拔管后声音嘶哑发生患者.csv',
	    exporterOlderExcelCompatibility: true,//为true时不使用utf-16编码
	    onRegisterApi:function(gridApi){
	        $scope.gridApiGenAnesHoarse = gridApi;
	    }
	};

	$scope.gridOptionsGenAnesHoarse.columnDefs = $scope.gridOptionsGenAnesHoarsetop.columnDefs;

	$scope.$on('query',function(ev, data){
		IHttp.post('qcMng/searchGenAnesHoarseRate', data).then((rs) => {
		    if (rs.status === 200 && rs.data.resultCode === '1') {
		    	$scope.gridOptionsGenAnesHoarsetop.data = rs.data.extubatList;

		    	$scope.GenAnesHoarse.extubatTotal = rs.data.extubatTotal;
		    	$scope.GenAnesHoarse.tubesTotal = rs.data.tubesTotal;
		    	$scope.GenAnesHoarse.rate = rs.data.rate;

		    	
		    	$scope.gridOptionsGenAnesHoarse.data = rs.data.tubesList;

    	    	$scope.eOption.series[0].data = [
    	            { value: rs.data.rate, name: '全麻气管插管拔管后声音嘶哑发生例数' },
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