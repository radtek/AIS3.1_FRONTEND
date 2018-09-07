StatAntibacterialCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'i18nService', 'uiGridConstants', '$timeout', 'toastr'];

module.exports = StatAntibacterialCtrl;

function StatAntibacterialCtrl( $rootScope, $scope, IHttp, i18nService, uiGridConstants, $timeout, toastr) {
	$scope.gridOptions = {
        resizable: true,
        rowHeight: 40,
        enableFiltering: false,
        enableColumnMenus:false,//表头列的菜单按钮，默认fal
        treeRowHeaderAlwaysVisible:false,
        enableGridMenu: true,
        exporterCsvFilename:'围术期预防性抗菌药的使用情况登记表.csv',
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
        $scope.gridOptions.data = [{"regOptId":"201612071039580208","name":"hk-test2","sex":"男","age":"30岁","ageMon":"10","ageDay":10,"hid":"1454196464","operaDate":"2016-12-07","bed":"151654","regionName":"产科病房","optLatterDiag":"","optRealOper":"","anaesTime":"","anaesDoc":"程望","shiftAnaesDoc":"","deptName":"儿科","designedAnaesMethodName":"","designedOptName":"","operatorName":"冯晓慧","realAnaesMethod":"","isLocalAnaes":"","operTime":0.0},{"regOptId":"201612071117540030","name":"cs003","sex":"男","age":"111岁","ageMon":"","ageDay":"","hid":"","operaDate":"2016-12-07","bed":"","regionName":"","optLatterDiag":"","optRealOper":"","anaesTime":"","anaesDoc":"程望","shiftAnaesDoc":"","deptName":"","designedAnaesMethodName":"","designedOptName":"","operatorName":"叶晓莲","realAnaesMethod":"","isLocalAnaes":"","operTime":0.0},{"regOptId":"201612071625390001","name":"blbg","sex":"男","age":"35岁","ageMon":"","ageDay":"","hid":"","operaDate":"2016-12-07","bed":"","regionName":"","optLatterDiag":"(先天性)(遗传性)卵形性红细胞增多症","optRealOper":"3/4喉切除术及喉功能重建术","anaesTime":"","anaesDoc":"程望","shiftAnaesDoc":"","deptName":"","designedAnaesMethodName":"","designedOptName":"","operatorName":"陈志鹏","realAnaesMethod":"","isLocalAnaes":"","operTime":0.02},{"regOptId":"201612061517430002","name":"cs001","sex":"男","age":"111岁","ageMon":"","ageDay":"","hid":"","operaDate":"2016-12-06","bed":"","regionName":"","optLatterDiag":"1型糖尿病性增殖性出血性视网膜病","optRealOper":"“钮孔畸形”游离肌腱固定术","anaesTime":"","anaesDoc":"程望","shiftAnaesDoc":"","deptName":"","designedAnaesMethodName":"","designedOptName":"","operatorName":"杨遂萍","realAnaesMethod":"","isLocalAnaes":"","operTime":0.0}];
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