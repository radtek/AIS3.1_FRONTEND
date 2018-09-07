BadlyComplicationRateCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'i18nService', 'uiGridConstants', '$timeout'];

module.exports = BadlyComplicationRateCtrl;

function BadlyComplicationRateCtrl( $rootScope, $scope, IHttp, i18nService, uiGridConstants, $timeout) {
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

	//麻醉期间严重过敏反应发生率---下部分参数
	$scope.OperByAnesAllergicRate = {
	    allergicReactionTotal: 0,
	    anaesTotal: 0,
	    rate: 0.0,
	};


	//麻醉期间严重过敏反应发生率 excel
	$scope.gridOptionsOperByAnesAllergicRateTop = {
		paginationPageSizes: [5, 10],
		paginationPageSize: 5,
        enableColumnMenus:false,//表头列的菜单按钮，默认fal
	    resizable: true,
	    rowHeight: 40,
	    enableFiltering: false,
	    treeRowHeaderAlwaysVisible:false,
	    enableGridMenu: true,
	    exporterCsvFilename:'麻醉期间严重过敏反应发生例数.csv',
	    exporterOlderExcelCompatibility: true,//为true时不使用utf-16编码
	    onRegisterApi:function(gridApi){  
	        $scope.gridApiOperByAnesAllergicRateTop = gridApi;
	    }
	}
	$scope.gridOptionsOperByAnesAllergicRate = {
		paginationPageSizes: [5, 10],
		paginationPageSize: 5,
	    resizable: true,
        enableColumnMenus:false,//表头列的菜单按钮，默认fal
	    rowHeight: 40,
	    enableFiltering: false,
	    treeRowHeaderAlwaysVisible:false,
	    enableGridMenu: true,
	    exporterCsvFilename:'同期麻醉总例数.csv',
	    exporterOlderExcelCompatibility: true,//为true时不使用utf-16编码
	    onRegisterApi:function(gridApi){  
	        $scope.gridApiOperByVenipunctyreRate = gridApi;
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
                field:'contents',
                displayName:'严重过敏反应',
                cellTooltip: function(row, col) {
            		return row.entity.contents;
        		}
            },{
                field:'allergicReactionTime',
                displayName:'严重过敏反应发生时间',
                cellTooltip: function(row, col) {
            		return row.entity.allergicReactionTime;
        		}
            }
        ]
	};
			
	$scope.$on('query',function(ev, data){
		IHttp.post('qcMng/searchAnesAllergicRecatRate', data).then((rs) => {
		    if (rs.status === 200 && rs.data.resultCode === '1') {
		    	$scope.gridOptionsOperByAnesAllergicRate.data = rs.data.anaesList;
		    	$scope.OperByAnesAllergicRate.anaesTotal = rs.data.anaesTotal;
		    	$scope.OperByAnesAllergicRate.rate = rs.data.rate;
		    	$scope.OperByAnesAllergicRate.allergicReactionTotal = rs.data.allergicReactionTotal;
		    	$scope.gridOptionsOperByAnesAllergicRateTop.columnDefs = $scope.gridOptionsOperByAnesAllergicRate.columnDefs;
		    	$scope.gridOptionsOperByAnesAllergicRateTop.data = rs.data.allergicReactionList;	

                $scope.eOption.series[0].data = [
                    { value: rs.data.rate, name: '麻醉期间严重过敏反应发生例数' },
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