StatPostInfectionCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'i18nService', 'uiGridConstants', '$timeout', 'toastr'];

module.exports = StatPostInfectionCtrl;

function StatPostInfectionCtrl( $rootScope, $scope, IHttp, i18nService, uiGridConstants, $timeout, toastr) {
	$scope.gridOptions = {
        resizable: true,
        rowHeight: 40,
        enableFiltering: false,
        enableColumnMenus:false,//表头列的菜单按钮，默认fal
        treeRowHeaderAlwaysVisible:false,
        enableGridMenu: true,
        exporterCsvFilename:'手术后感染例数.csv',
        exporterOlderExcelCompatibility: true,//为true时不使用utf-16编码
        columnDefs:[
                    {
                        field:'dateName',
                        displayName:'日期',
                    },{
                        field:'keyOperationNum',
                        displayName:'手术后感染例数',
                    }
                ],
        onRegisterApi:function(gridApi){  
            $scope.gridApi = gridApi;
        }
	};

	$scope.$on('query',function(ev, data){
        $scope.gridOptions.data = [
    {
      "dateName": "日期",
      "keyOperationNum": "手术后感染例数",
      "deathNum": "死亡例数",
      "returnNum": "术后非计划重返再次手术例数"
    },{
      "dateName": "2016-11",
      "keyOperationNum": "8",
      "deathNum": "0",
      "returnNum": "1"
    },
    {
      "dateName": "2016-12",
      "keyOperationNum": "5",
      "deathNum": "0",
      "returnNum": "1"
    },
    {
      "dateName": "2016-10",
      "keyOperationNum": "5",
      "deathNum": "0",
      "returnNum": "1"
    }
  ];
		// delete data.operRoomId;
		// IHttp.post('statistics/searchHospPatientOperateList', data).then((rs) => {
		//     if (rs.status === 200 && rs.data.resultCode === '1') {
		//     	$scope.gridOptions.data = rs.data.hospPatientList;
		//     }
		// });
	});

    $scope.$on('export', () => {
        $scope.gridApi.exporter.csvExport('all', 'all');
    })

	$scope.$emit('childInited');
}