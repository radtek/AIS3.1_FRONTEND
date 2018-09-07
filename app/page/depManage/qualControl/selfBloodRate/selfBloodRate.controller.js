SelfBloodRateCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'i18nService', 'uiGridConstants', '$timeout'];

module.exports = SelfBloodRateCtrl;

function SelfBloodRateCtrl( $rootScope, $scope, IHttp, i18nService, uiGridConstants, $timeout) {
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

    //术中自体血输注参数--上部分
    $scope.OperByAutoblood = {
    	autograftTotal: 0,
    	operTotal: 0,
    	rate: 0.0,
    };

    //术中自体血输注表格--上部分
    $scope.gridOptionsOperByAutoblood = {
    	paginationPageSizes: [5, 10],
    	paginationPageSize: 5,
        enableColumnMenus:false,//表头列的菜单按钮，默认fal
        resizable: true,
        rowHeight: 40,
        enableFiltering: false,
        enableGridMenu: true,
        exporterCsvFilename:'术中自体血输注率--麻醉中接受400ml及以上自体血包括自体血红细胞输注患者数.csv',
        exporterOlderExcelCompatibility: true,//为true时不使用utf-16编码
        onRegisterApi:function(gridApi){
            $scope.gridApiOperByAutoblood = gridApi;
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
                field:'bloodList',
                displayName:'输血项目',
                cellTooltip: function(row, col) {
            		return row.entity.bloodList;
        		}
            }
        ]

    };
    //术中自体血输注表格-下部分
    $scope.gridOptionsOperByAutoblooddown = {
		paginationPageSizes: [5, 10],
		paginationPageSize: 5,
        enableColumnMenus:false,//表头列的菜单按钮，默认fal
        resizable: true,
        rowHeight: 40,
        enableFiltering: false,
        enableGridMenu: true,
        exporterCsvFilename:'术中自体血输注率--同期接受400ml及以上输血治疗的患者总数.csv',
        exporterOlderExcelCompatibility: true,//为true时不使用utf-16编码
        onRegisterApi:function(gridApi){
            $scope.gridApiOperByAutoblooddown = gridApi;
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
                field:'bloodList',
                displayName:'输血项目',
                cellTooltip: function(row, col) {
            		return row.entity.bloodList;
        		}
            }
        ]

    };

	$scope.$on('query',function(ev, data){
		IHttp.post('qcMng/searchAutograftBloodTrans400mlInfo', data).then((rs) => {
		    if (rs.status === 200 && rs.data.resultCode === '1') {
               	$scope.gridOptionsOperByAutoblood.data = rs.data.autograftList;
               	$scope.gridOptionsOperByAutoblooddown.data = rs.data.operList;
				$scope.OperByAutoblood.autograftTotal = rs.data.autograftTotal;
				$scope.OperByAutoblood.operTotal = rs.data.operTotal;
				$scope.OperByAutoblood.rate = rs.data.rate;	

                $scope.eOption.series[0].data = [
                    { value: rs.data.rate, name: '接受400ml及以上自体血患者数' },
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