UnexpectedSpileAgainRateCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'i18nService', 'uiGridConstants', '$timeout'];

module.exports = UnexpectedSpileAgainRateCtrl;

function UnexpectedSpileAgainRateCtrl( $rootScope, $scope, IHttp, i18nService, uiGridConstants, $timeout) {
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

    $scope.AnesSecondIntubatRate = {
	    secondIntubatTotal: 0,
	    extubatTotal: 0,
	    rate: 0,
	};

    //非计划二次气管插管率
    $scope.gridOptionsAnesSecondIntubatRatetop = {
    	paginationPageSizes: [5, 10],
    	paginationPageSize: 5,
        enableColumnMenus:false,//表头列的菜单按钮，默认fal
	    resizable: true,
	    rowHeight: 40,
	    enableFiltering: false,
	    enableGridMenu: true,
	    exporterCsvFilename:'非计划二次气管插管患者.csv',
	    exporterOlderExcelCompatibility: true,//为true时不使用utf-16编码
	    onRegisterApi:function(gridApi){
	        $scope.gridApiAnesSecondIntubatRatetop = gridApi;
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
                field:'secondIntubat',
                displayName:'二次插管',
                cellTooltip: function(row, col) {
            		return row.entity.secondIntubat;
        		}
            },{
                field:'intubatTime',
                displayName:'二次插管时间',
                cellTooltip: function(row, col) {
            		return row.entity.intubatTime;
        		}
            }
        ]

	};

	$scope.gridOptionsAnesSecondIntubatRate= {
		paginationPageSizes: [5, 10],
		paginationPageSize: 5,
        enableColumnMenus:false,//表头列的菜单按钮，默认fal
	    resizable: true,
	    rowHeight: 40,
	    enableFiltering: false,
	    enableGridMenu: true,
	    exporterCsvFilename:'同期入PACU患者总数-非计划二次气管插管患者.csv',
	    exporterOlderExcelCompatibility: true,//为true时不使用utf-16编码
	    onRegisterApi:function(gridApi){
	        $scope.gridApiAnesSecondIntubatRate = gridApi;
	    }
	};

	$scope.$on('query',function(ev, data){
		IHttp.post('qcMng/searchAnesSecondIntubatRate', data).then((rs) => {
		    if (rs.status === 200 && rs.data.resultCode === '1') {
		    	$scope.gridOptionsAnesSecondIntubatRatetop.data = rs.data.secondIntubatList;

		    	$scope.AnesSecondIntubatRate.extubatTotal = rs.data.extubatTotal;
		    	$scope.AnesSecondIntubatRate.secondIntubatTotal = rs.data.secondIntubatTotal;
		    	$scope.AnesSecondIntubatRate.rate = rs.data.rate;
		    	$scope.gridOptionsAnesSecondIntubatRate.columnDefs = $scope.gridOptionsAnesSecondIntubatRatetop.columnDefs;
		    	$scope.gridOptionsAnesSecondIntubatRate.data = rs.data.extubatList;

                $scope.eOption.series[0].data = [
                    { value: rs.data.rate, name: '非计划二次气管插管患者数' },
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