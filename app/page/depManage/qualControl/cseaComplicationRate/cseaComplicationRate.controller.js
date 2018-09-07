CseaComplicationRateCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'i18nService', 'uiGridConstants', '$timeout'];

module.exports = CseaComplicationRateCtrl;

function CseaComplicationRateCtrl( $rootScope, $scope, IHttp, i18nService, uiGridConstants, $timeout) {
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
    $scope.SpinalAnaesNeuralComplicat = {
	    spinalComplicatTotal: 0,
	    spinalTotal: 0,
	    rate: 0.0,
	};
    //椎管内麻醉后严重神经并发症发生率
    $scope.gridOptionsSpinalAnaesNeuralComplicattop = {
    	paginationPageSizes: [5, 10],
    	paginationPageSize: 5,
	    resizable: true,
        enableColumnMenus:false,//表头列的菜单按钮，默认fal
	    rowHeight: 40,
	    enableFiltering: false,
	    enableGridMenu: true,
	    exporterCsvFilename:'椎管内麻醉后严重神经并发症发生患者.csv',
	    exporterOlderExcelCompatibility: true,//为true时不使用utf-16编码
	    onRegisterApi:function(gridApi){
	        $scope.gridApiSpinalAnaesNeuralComplicattop = gridApi;
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
                        displayName:'椎管内麻醉后严重神经并发症',
                        cellTooltip: function(row, col) {
                    		return row.entity.contents;
                		}
                    },
                ]

	};

	$scope.gridOptionsSpinalAnaesNeuralComplicat= {
		paginationPageSizes: [5, 10],
		paginationPageSize: 5,
	    resizable: true,
        enableColumnMenus:false,//表头列的菜单按钮，默认fal
	    rowHeight: 40,
	    enableFiltering: false,
	    enableGridMenu: true,
	    exporterCsvFilename:'同期入PACU患者总数-椎管内麻醉后严重神经并发症发生患者.csv',
	    exporterOlderExcelCompatibility: true,//为true时不使用utf-16编码
	    onRegisterApi:function(gridApi){
	        $scope.gridApiSpinalAnaesNeuralComplicat = gridApi;
	    }
	};

	$scope.$on('query',function(ev, data){
		IHttp.post('qcMng/searchSpinalAnaesNeuralComplicatRate', data).then((rs) => {
		    if (rs.status === 200 && rs.data.resultCode === '1') {
		    	$scope.gridOptionsSpinalAnaesNeuralComplicattop.data = rs.data.spinalComplicatList;

		    	$scope.SpinalAnaesNeuralComplicat.spinalComplicatTotal = rs.data.spinalComplicatTotal;
		    	$scope.SpinalAnaesNeuralComplicat.spinalTotal = rs.data.spinalTotal;
		    	$scope.SpinalAnaesNeuralComplicat.rate = rs.data.rate;

		    	$scope.gridOptionsSpinalAnaesNeuralComplicat.columnDefs = $scope.gridOptionsSpinalAnaesNeuralComplicattop.columnDefs;
		    	$scope.gridOptionsSpinalAnaesNeuralComplicat.data = rs.data.spinalList;

                $scope.eOption.series[0].data = [
                    { value: rs.data.rate, name: '椎管内麻醉后严重神经并发症发生例数' },
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