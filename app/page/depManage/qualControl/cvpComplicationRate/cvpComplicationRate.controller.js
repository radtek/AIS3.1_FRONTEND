CvpComplicationRateCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'i18nService', 'uiGridConstants', 'toastr', '$filter', '$timeout'];

module.exports = CvpComplicationRateCtrl;

function CvpComplicationRateCtrl($rootScope, $scope, IHttp, i18nService, uiGridConstants, toastr, $filter, $timeout) {
	$scope.eConfig = {
        dataLoaded: true,
        resize: true
    };
	$scope.eOption = {
	    series: [{
	        name: '中心静脉穿刺严重并发症发生例数',
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
	//中心静脉穿刺严重并发症发生率---下部分参数
	$scope.OperByVenipunctyreRate = {
	    OperByDeath24Num: 0,
	    operTotal: 0,
	    rate: 0.0,
	};
	//中心静脉穿刺严重并发症发生率---下部分 excel 同期中心静脉穿刺总例数
	$scope.gridOptionsOperByVenipunctyreRate = {
		paginationPageSizes: [5, 10],
		paginationPageSize: 5,
	    resizable: true,
	    rowHeight: 40,
	    enableColumnMenus:false,//表头列的菜单按钮，默认fal
	    enableFiltering: false,
	    treeRowHeaderAlwaysVisible:false,
	    enableGridMenu: true,
	    exporterCsvFilename:'中心静脉穿刺严重并发症发生率-同期中心静脉穿刺总例数.csv',
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
	            displayName:'中心静脉穿刺严重并发症',
	            cellTooltip: function(row, col) {
	        		return row.entity.contents;
	    		}
	        },{
	            field:'allergicReactionTime',
	            displayName:'并发症发生时间',
	            cellTooltip: function(row, col) {
	        		return row.entity.allergicReactionTime;
	    		}
	        }
	    ]
	};

	$scope.gridOptionsOperByVenipunctyre = {
		paginationPageSizes: [5, 10],
		paginationPageSize: 5,
	    resizable: true,
	    enableColumnMenus:false,//表头列的菜单按钮，默认fal
	    rowHeight: 40,
	    enableFiltering: false,
	    treeRowHeaderAlwaysVisible:false,
	    enableGridMenu: true,
	    exporterCsvFilename:'中心静脉穿刺严重并发症发生例数.csv',
	    exporterOlderExcelCompatibility: true,//为true时不使用utf-16编码
	    onRegisterApi:function(gridApi){  
	        $scope.gridApiOperByVenipunctyre = gridApi;
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
                displayName:'中心静脉穿刺严重并发症',
                cellTooltip: function(row, col) {
            		return row.entity.contents;
        		}
            },{
                field:'allergicReactionTime',
                displayName:'并发症发生时间',
                cellTooltip: function(row, col) {
            		return row.entity.allergicReactionTime;
        		}
            }
        ]
	};
	$scope.$on('query',function(ev, data){
		if ($scope.queryObj.timeType === '4') {
	        if (!$scope.queryObj.startTime || !$scope.queryObj.endTime) {
	            toastr.warning("按日期范围查询时，请选择开始时间和结束时间！");
	        }
	    }
	    var stD = $filter('date')($scope.queryObj.startTime, 'yyyy-MM-dd');
	    var enD = $filter('date')($scope.queryObj.endTime, 'yyyy-MM-dd');
	    IHttp.post("qcMng/searchVenipunctyreRate", {
	        "timeType":$scope.queryObj.timeType,
	        "timeRang":$scope.queryObj["timeRange"+$scope.queryObj.timeType],
	        "startTime":stD,
	        "endTime":enD
	    }).then(function(rs) {
		    $scope.OperByVenipunctyreRate.OperByDeath24Num = rs.data.venListTotal;
		    $scope.OperByVenipunctyreRate.operTotal = rs.data.operTotal;
		    $scope.OperByVenipunctyreRate.rate = rs.data.rate;
	        $scope.gridOptionsOperByVenipunctyre.data = rs.data.venipunctyreList;
	        $scope.gridOptionsOperByVenipunctyreRate.data = rs.data.operList;
	    });

		$scope.gridOptionsOperByVenipunctyre.data = [];
    	$scope.eOption.series[0].data = [
            { value: 0, name: '中心静脉穿刺严重并发症发生例数' },
            { 
            	value: 0, 
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
	});

    $scope.export = function(type) {
        $scope[type].exporter.csvExport('all', 'all');
    };

	$scope.$emit('childInited');			

}