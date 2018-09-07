StatSpecialCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'i18nService', 'uiGridConstants', '$timeout', 'toastr'];

module.exports = StatSpecialCtrl;

function StatSpecialCtrl( $rootScope, $scope, IHttp, i18nService, uiGridConstants, $timeout, toastr) {
	$scope.gridOptions = {
        resizable: true,
        rowHeight: 40,
        enableFiltering: false,
        treeRowHeaderAlwaysVisible:false,
        enableColumnMenus:false,//表头列的菜单按钮，默认fal
        enableGridMenu: true,
        exporterCsvFilename:'住院重点手术总例数、死亡例数、术后非计划重返再次手术例数.csv',
        exporterOlderExcelCompatibility: true,//为true时不使用utf-16编码
        columnDefs:[
                    {
                        field:'dateName',
                        displayName:'日期',
                    },{
                        field:'keyOperationNum',
                        displayName:'重点手术总例数',
                    },{
                        field:'deathNum',
                        displayName:'死亡例数'
                    },{
                        field:'returnNum',
                        displayName:'术后非计划重返再次手术例数',
                    }
                ],
        onRegisterApi:function(gridApi){  
            $scope.gridApi = gridApi;
        }
	};

	$scope.$on('query',function(ev, data){
		delete data.operRoomId;
		IHttp.post('statistics/searchHospitalKeyOperationNum', data).then((rs) => {
		    if (rs.status === 200 && rs.data.resultCode === '1') {
		    	$scope.gridOptions.data = rs.data.tabList;
		    }
		});
	});

    $scope.$on('export', () => {
        $scope.gridApi.exporter.csvExport('all', 'all');
    })

	$scope.$emit('childInited');
}