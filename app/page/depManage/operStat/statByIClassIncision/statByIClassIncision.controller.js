StatByIClassIncisionCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'i18nService', 'uiGridConstants', '$timeout', 'toastr'];

module.exports = StatByIClassIncisionCtrl;

function StatByIClassIncisionCtrl( $rootScope, $scope, IHttp, i18nService, uiGridConstants, $timeout, toastr) {
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
                field:'行名',
                displayName:'统计类型',
            },{
                field:'2016-10 例数',
                displayName:'2016-10 例数',
            },{
                field:'2016-10 比例',
                displayName:'2016-10 比例',
            },{
                field:'2016-11 例数',
                displayName:'2016-11 例数',
            },{
                field:'2016-11 比例',
                displayName:'2016-11 比例',
            }
        ],
        onRegisterApi:function(gridApi){  
            $scope.gridApi = gridApi;
        }
	};

	$scope.$on('query',function(ev, data){
        $scope.gridOptions.data = [
    {
      "2016-10 例数": "4/20",
      "2016-10 比例": "20%",
      "行名": "I类切口（手术时间≤2小时）手术，预防性抗菌药使用比例",
      "2016-11 例数": "1/8",
      "2016-11 比例": "12.5%"
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