StatByDeptCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'i18nService', 'uiGridConstants', '$timeout', 'toastr'];

module.exports = StatByDeptCtrl;

function StatByDeptCtrl( $rootScope, $scope, IHttp, i18nService, uiGridConstants, $timeout, toastr) {
	$scope.gridOptions = {
        resizable: true,
        rowHeight: 40,
        enableFiltering: false,
        enableColumnMenus:false,//表头列的菜单按钮，默认fal
        treeRowHeaderAlwaysVisible:false,
        enableGridMenu: true,
        exporterCsvFilename:'分科手术登记表.csv',
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
                        field:'operatorName',
                        displayName:'手术名称'
                    },{
                        field:'anaesDoc',
                        displayName:'麻醉医生'
                    }
                ],
        onRegisterApi:function(gridApi){  
            $scope.gridApi = gridApi;
        }
	};

	$scope.$on('query',function(ev, data){
		IHttp.post('statistics/queryOperateDetailByDept', data).then((rs) => {
		    if (rs.status === 200 && rs.data.resultCode === '1') {
		    	$scope.gridOptions.data = rs.data.operateDetailByDeptList;
		    }
		});
	});

    $scope.$on('export', () => {
        $scope.gridApi.exporter.csvExport('all', 'all');
    })

	$scope.$emit('childInited');
}