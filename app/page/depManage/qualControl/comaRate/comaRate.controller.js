ComaRateCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'i18nService', 'uiGridConstants', '$timeout'];

module.exports = ComaRateCtrl;

function ComaRateCtrl( $rootScope, $scope, IHttp, i18nService, uiGridConstants, $timeout) {
	$scope.eConfig = {
        dataLoaded: true,
        resize: true
    };
    $scope.eOption = {
	    series: [{
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

	//麻醉后新发昏迷发生率---下部分参数
	$scope.OperByAnesComaRate = {
	    comaListTotal: 0,
	    operTotal: 0,
	    rate: 0.0,
	};

    //麻醉后新发昏迷发生率---下部分 excel
    $scope.gridOptionsOperByAnesComaRate = {
    	paginationPageSizes: [5, 10],
    	paginationPageSize: 5,
        enableColumnMenus:false,//表头列的菜单按钮，默认fal
	    resizable: true,
	    rowHeight: 40,
	    enableFiltering: false,
	    treeRowHeaderAlwaysVisible:false,
	    enableGridMenu: true,
	    exporterCsvFilename:'麻醉后新发昏迷发生率-同期麻醉总例数.csv',
	    exporterOlderExcelCompatibility: true,//为true时不使用utf-16编码
	    onRegisterApi:function(gridApi){  
	        $scope.gridApiOperByAnesComaRate = gridApi;
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
                field:'coma',
                displayName:'是否昏迷',
                cellTooltip: function(row, col) {
            		return row.entity.coma;
        		}
            },
        ]
	};

    $scope.gridOptionsOperByAnesComa = {
    	paginationPageSizes: [5, 10],
    	paginationPageSize: 5,
	    resizable: true,
        enableColumnMenus:false,//表头列的菜单按钮，默认fal
	    rowHeight: 40,
	    enableFiltering: false,
	    treeRowHeaderAlwaysVisible:false,
	    enableGridMenu: true,
	    exporterCsvFilename:'麻醉后新发昏迷发生例数.csv',
	    exporterOlderExcelCompatibility: true,//为true时不使用utf-16编码
	    onRegisterApi:function(gridApi){  
	        $scope.gridApiOperByAnesComa = gridApi;
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
                field:'coma',
                displayName:'是否昏迷',
                cellTooltip: function(row, col) {
            		return row.entity.coma;
        		}
            },
        ]
	};
			
	$scope.$on('query',function(ev, data){
		IHttp.post('qcMng/searchAnesComaRate', data).then((rs) => {
		    if (rs.status === 200 && rs.data.resultCode === '1') {
		    	$scope.gridOptionsOperByAnesComaRate.data = rs.data.operList;
		    	$scope.gridOptionsOperByAnesComa.data = rs.data.comaList;
		    	$scope.OperByAnesComaRate.operTotal = rs.data.operTotal;
		    	 $scope.OperByAnesComaRate.comaListTotal = rs.data.comaListTotal;
		    	$scope.OperByAnesComaRate.rate = rs.data.rate;
		    	$scope.eOption.series[0].data = [
		            { value: rs.data.rate, name: '麻醉后新发昏迷发生例数' },
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