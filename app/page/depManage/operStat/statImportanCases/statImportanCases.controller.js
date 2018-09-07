StatImportanCasesCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'i18nService', 'uiGridConstants', '$timeout', 'toastr'];

module.exports = StatImportanCasesCtrl;

function StatImportanCasesCtrl( $rootScope, $scope, IHttp, i18nService, uiGridConstants, $timeout, toastr) {
	$scope.gridOptions = {
        resizable: true,
        rowHeight: 40,
        enableFiltering: false,
        enableColumnMenus:false,//表头列的菜单按钮，默认fal
        treeRowHeaderAlwaysVisible:false,
        enableGridMenu: true,
        exporterCsvFilename:'重要手术情况统计表（死亡率、2-31天重返率、住院日、医疗费用等情况）.csv',
        exporterOlderExcelCompatibility: true,//为true时不使用utf-16编码
        columnDefs:[
                    {
                        field:'name',
                        displayName:'患者姓名'
                    },{
                        field:'sex',
                        displayName:'性别'
                    },{
                        field:'age',
                        displayName:'年龄'
                    },{
                        field:'hid',
                        displayName:'住院号',
                    },{
                        field:'operaDate',
                        displayName:'手术日期'
                    },{
                        field:'anesthetistName',
                        displayName:'麻醉医生'
                    }
                ],
        onRegisterApi:function(gridApi){  
            $scope.gridApi = gridApi;
        }
	};

	$scope.$on('query',function(ev, data){
        $scope.gridOptions.data = [
                {name:'陈夏',sex:'女',age:'24',hid:'95627',operaDate:'2016-09-05',anesthetistName:'刘奎'},
                {name:'杨红梅',sex:'女',age:'36',hid:'55982',operaDate:'2016-05-07',anesthetistName:'刘奎'},
                {name:'张萍',sex:'女',age:'25',hid:'42686',operaDate:'2016-01-03',anesthetistName:'刘奎'}
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