AnaesthesiaMethodsRateCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'i18nService', 'uiGridConstants', '$timeout'];

module.exports = AnaesthesiaMethodsRateCtrl;

function AnaesthesiaMethodsRateCtrl( $rootScope, $scope, IHttp, i18nService, uiGridConstants, $timeout) {
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

	$scope.AnesthMethod = {
	    anesthMethodNum: 0,
	    anesTypeTotal:[],
	    operTotal: 0,
	    rate: [],
	};

	//各类麻醉方式比例
	$scope.gridOptionsAnesthMethodtop = {
		paginationPageSizes: [5, 10],
		paginationPageSize: 5,
		enableColumnMenus:false,//表头列的菜单按钮，默认fal
	    resizable: true,
	    rowHeight: 40,
	    enableFiltering: false,
	    treeRowHeaderAlwaysVisible:false,
	    enableGridMenu: true,
	    exporterCsvFilename:'麻醉科完成麻醉患者.csv',
	    exporterOlderExcelCompatibility: true,//为true时不使用utf-16编码
	    onRegisterApi:function(gridApi){
	        $scope.gridApiAnesthMethodtop = gridApi;
	    }
	};
	//各类麻醉方式比例
	$scope.gridOptionsAnesthMethod = {
		paginationPageSizes: [5, 10],
		paginationPageSize: 5,
		enableColumnMenus:false,//表头列的菜单按钮，默认fal
	    resizable: true,
	    rowHeight: 40,
	    enableFiltering: false,
	    treeRowHeaderAlwaysVisible:false,
	    enableGridMenu: true,
	    exporterCsvFilename:'同期麻醉科完成麻醉患者.csv',
	    exporterOlderExcelCompatibility: true,//为true时不使用utf-16编码
	    onRegisterApi:function(gridApi){
	        $scope.gridApiAnesthMethod = gridApi;
	    }
	};

	$scope.$on('query',function(ev, data){
		IHttp.post('qcMng/searchAnesthMethodRate', data).then((rs) => {
		    if (rs.status === 200 && rs.data.resultCode === '1') {
	            let columns = [];
	            let columnArr = rs.data.columnAry;

	             if (columnArr.length > 0) {

	                columns[0] = {
	                    field: '麻醉方法',
	                    displayName: '麻醉方法',
	                    grouping: {
	                    	groupPriority: 0
	                    },
	                    cellTemplate: '<div><div ng-if="!col.grouping || col.grouping.groupPriority === undefined || col.grouping.groupPriority === null || ( row.groupHeader && col.grouping.groupPriority === row.treeLevel )" class="ui-grid-cell-contents" title="TOOLTIP">{{COL_FIELD CUSTOM_FILTERS}}</div></div>',
	                    sort: {priority:0,direction:'asc'}

	                };
	            }

	            if (columnArr.indexOf('麻醉方法') > -1) {
	            	columnArr.splice(columnArr.indexOf('麻醉方法'),1);
	            }
	            for (let i = 0; i < columnArr.length; i++) {
	                let column = {
	                    field: columnArr[i],
	                    displayName:columnArr[i]
	                };
	                columns[i + 1] = column;
	            }
	            
	            $scope.gridOptionsAnesthMethod.columnDefs = columns;
	            $scope.gridOptionsAnesthMethod.data = rs.data.operTableList;

	            $scope.gridOptionsAnesthMethodtop.columnDefs = columns;
	            $scope.gridOptionsAnesthMethodtop.data = rs.data.anesTableList;

	            $scope.AnesthMethod.anesthMethodNum = rs.data.anesthMethodNum;
	            $scope.AnesthMethod.operTotal = rs.data.operTotal;
	            $scope.AnesthMethod.rate = rs.data.rate;
	            $scope.AnesthMethod.anesTypeTotal= rs.data.anesTypeTotal;


	            var lev1=rs.data.anesTypeTotal['复合麻醉'];
	            var lev2=rs.data.anesTypeTotal['非插管全麻'];
	            var lev3=rs.data.anesTypeTotal['椎管内麻醉'];
	            var lev4=rs.data.anesTypeTotal['其他麻醉方式'];
	            var lev5=rs.data.anesTypeTotal['插管全麻'];
	            var other= rs.data.operTotal-lev1-lev2-lev3-lev4-lev5;

		        $scope.AnesthMethodlabels = ['复合麻醉', '非插管全麻', '椎管内麻醉', '其他麻醉方式', '插管全麻','同比少'];
		        $scope.AnesthMethoddata =[lev1, lev2, lev3,lev4,lev5,other];

	        	$scope.eOption.series[0].data = [
	                { value: lev1, name: '复合麻醉' },
	                { value: lev2, name: '非插管全麻' },
	                { value: lev3, name: '椎管内麻醉' },
	                { value: lev4, name: '其他麻醉方式' },
	                { value: lev5, name: '插管全麻' },
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