StatUlcersCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'i18nService', 'uiGridConstants', '$timeout', 'toastr'];

module.exports = StatUlcersCtrl;

function StatUlcersCtrl( $rootScope, $scope, IHttp, i18nService, uiGridConstants, $timeout, toastr) {
	$scope.gridOptions = {
        resizable: true,
        rowHeight: 40,
        enableFiltering: false,
        treeRowHeaderAlwaysVisible:false,
        enableGridMenu: true,
        enableColumnMenus:false,//表头列的菜单按钮，默认fal
        exporterCsvFilename:'出院患者压疮统计登记表',
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
                    }
                ],
        onRegisterApi:function(gridApi){  
            $scope.gridApi = gridApi;
        }
	};

	$scope.$on('query',function(ev, data){
        $scope.gridOptions.data = [
                {name:'王伟',sex:'男',age:'34',hid:'95627',operaDate:'2016-09-05'},
                {name:'李晓飞',sex:'女',age:'26',hid:'55982',operaDate:'2016-05-07'},
                {name:'张萍',sex:'女',age:'25',hid:'42686',operaDate:'2016-01-03'}
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