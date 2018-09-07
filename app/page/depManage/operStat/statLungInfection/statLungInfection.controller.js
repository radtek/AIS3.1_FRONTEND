StatLungInfectionCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'i18nService', 'uiGridConstants', '$timeout', 'toastr'];

module.exports = StatLungInfectionCtrl;

function StatLungInfectionCtrl( $rootScope, $scope, IHttp, i18nService, uiGridConstants, $timeout, toastr) {
	$scope.gridOptions = {
        resizable: true,
        rowHeight: 40,
        enableFiltering: false,
        enableColumnMenus:false,//表头列的菜单按钮，默认fal
        treeRowHeaderAlwaysVisible:false,
        enableGridMenu: true,
        exporterCsvFilename:'择期手术患者肺部感染统计及明细登记表.csv',
        exporterOlderExcelCompatibility: true,//为true时不使用utf-16编码
        columnDefs:[
                    {
                        field:'name',
                        displayName:'患者姓名',
                    },{
                        field:'sex',
                        displayName:'性别',
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
                {name:'冯晓慧',sex:'女',age:'42',hid:'98657',operaDate:'2016-12-09',anesthetistName:'程望'},
                {name:'陈志鹏',sex:'男',age:'44',hid:'85627',operaDate:'2016-11-05',anesthetistName:'程望'},
                {name:'叶小莲',sex:'男',age:'28',hid:'45982',operaDate:'2016-10-07',anesthetistName:'程望'},
                {name:'杨亿萍',sex:'女',age:'22',hid:'32586',operaDate:'2016-08-03',anesthetistName:'程望'}
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