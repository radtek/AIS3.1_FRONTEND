CvpComplicationRateCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'uiGridConstants', '$timeout', 'toastr'];

module.exports = CvpComplicationRateCtrl;

function CvpComplicationRateCtrl( $rootScope, $scope, IHttp, uiGridConstants, $timeout, toastr) {
	$scope.eConfig = {
        dataLoaded: true,
        resize: true
    };
	$scope.eOption = {
	    series: [{
	        name: '访问来源',
	        type: 'pie',
	        radius: '55%',
	        data: [
	            { value: 235, name: '视频广告' },
	            { value: 274, name: '联盟广告' },
	            { value: 310, name: '邮件营销' },
	            { value: 335, name: '直接访问' },
	            { value: 400, name: '搜索引擎' }
	        ],
            itemStyle: {
                normal: {
                    shadowBlur: 200,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
	    }]
	};

	$scope.ASALevel = {
	    asaLevelTotal: {},
	    operTotal: 0,
	    rate: {},
	};

	$scope.gridOptionsASALevel = {
		paginationPageSizes: [5, 10],
		paginationPageSize: 5,
		enableColumnMenus:false,//表头列的菜单按钮，默认fal
	    resizable: true,
	    rowHeight: 40,
	    enableFiltering: false,
	    treeRowHeaderAlwaysVisible:false,
	    enableGridMenu: true,
	    exporterCsvFilename:'各ASA分级麻醉患者.csv',
	    exporterOlderExcelCompatibility: true,//为true时不使用utf-16编码
	    onRegisterApi:function(gridApi){
	        $scope.gridApiASALevel = gridApi;
	    }
	};

	$scope.gridOptionsASALevelOper = {
		paginationPageSizes: [5, 10],
		paginationPageSize: 5,
	    resizable: true,
	    enableColumnMenus:false,//表头列的菜单按钮，默认fal
	    rowHeight: 40,
	    enableFiltering: false,
	    treeRowHeaderAlwaysVisible:false,
	    enableGridMenu: true,
	    exporterCsvFilename:'各ASA分级麻醉患者总数.csv',
	    exporterOlderExcelCompatibility: true,//为true时不使用utf-16编码
	    onRegisterApi:function(gridApi){
	        $scope.gridApiASALevelOper = gridApi;
	    }
	};

	$scope.$on('query',function(ev, data){
		IHttp.post('qcMng/searchASALevelRate', data).then((rs) => {
		    if (rs.status === 200 && rs.data.resultCode === '1') {
		    	let columns = [];
		    	let columnArr = rs.data.columnAry;
		    	if (columnArr.length > 0) {

		    	    columns[0] = {
		    	        field: '级别',
		    	        displayName: '级别',
		    	        grouping: {
		    	        	groupPriority: 0
		    	        },
		    	        cellTemplate: '<div><div ng-if="!col.grouping || col.grouping.groupPriority === undefined || col.grouping.groupPriority === null || ( row.groupHeader && col.grouping.groupPriority === row.treeLevel )" class="ui-grid-cell-contents" title="TOOLTIP">{{COL_FIELD CUSTOM_FILTERS}}</div></div>',
		    	        sort: {priority:0,direction:'asc'}

		    	    };
		    	    columns[1] = {
		    	    	field: '行名',
		    	    	displayName: '序号',
		    	    	visible: false
		    	    }
		    	}
		    	
		    	for (let i = 0; i < columnArr.length; i++) {
		    	    let column = {
		    	        field: columnArr[i],
		    	        displayName:rs.data.columnAry[i]
		    	    };
		    	    columns[i + 1] = column;
		    	}

	            $scope.gridOptionsASALevel.columnDefs = columns;
	            $scope.gridOptionsASALevel.data = rs.data.asaTableList;

	            $scope.gridOptionsASALevelOper.columnDefs = angular.copy(columns);
	            $scope.gridOptionsASALevelOper.columnDefs.splice(0,2,{field:'患者姓名',displayName:'患者姓名'});
	            $scope.gridOptionsASALevelOper.data = rs.data.operTableList;

	            $scope.ASALevel.asaLevelTotal = rs.data.asaLevelTotal;
	            $scope.ASALevel.operTotal = rs.data.operTotal;
	            $scope.ASALevel.rate = rs.data.rate;



	            let lev1=rs.data.asaLevelTotal['1级'];
	            let lev2=rs.data.asaLevelTotal['2级'];
	            let lev3=rs.data.asaLevelTotal['3级'];
	            let lev4=rs.data.asaLevelTotal['4级'];
	            let lev5=rs.data.asaLevelTotal['5级'];
	            let levo=rs.data.asaLevelTotal['其他']?rs.data.asaLevelTotal['其他']:0;
	            let other=rs.data.operTotal-lev1-lev2-lev3-lev4-lev5-levo;

	          

		        $scope.ASALevellabels = ["I级", "II级", "III级","IV级", "V级", "其他","同比少"];
		        $scope.ASALeveldata =[lev1, lev2, lev3,lev4,lev5,levo,other];

            	$scope.eOption.series[0].data = [
                    { value: lev1, name: '1级' },
                    { value: lev2, name: '2级' },
                    { value: lev3, name: '3级' },
                    { value: lev4, name: '4级' },
                    { value: lev5, name: '5级' },
                    { value: levo, name: '其他' },
                    { 
                    	value: other, 
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