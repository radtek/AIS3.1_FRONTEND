DocTotalDetail.$inject = ['$scope', 'IHttp', '$uibModalInstance', '$q', '$timeout', '$filter', 'toastr', 'auth'];

module.exports = DocTotalDetail;

function DocTotalDetail($scope, IHttp, $uibModalInstance, $q, $timeout, $filter, toastr, auth) {
    var vm = this,
        systemInfo = auth.loginUser();
    vm.param = {
        beid: systemInfo.beid,
        year: '',
        month: '',
        amount: '',
        recordMonth: ''
    };

    $scope.gridOptions = {
        paginationPageSizes: [5, 10],
        paginationPageSize: 5,
        resizable: true,
        enableFiltering: false,
        enableGridMenu: true,
        enableColumnMenus:false,
        rowHeight: 40,
        exporterCsvFilename: '医师总数.csv',
        exporterOlderExcelCompatibility: true,
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
        },
        columnDefs: [{
            field: 'recordMonth',
            name: '日期'
        }, {
            field: 'amount',
            name: '医师总数'
        }, {
            name: '操作',
            enableSorting: false,
            enableFiltering: false,
            width: 120,
            cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.edit(row.entity)">编辑</a> | <a ng-click="grid.appScope.del(row.entity)">删除</a></div>',
        }]
    };

    function initData() {
        IHttp.post('basedata/selectAllAnaesDoctorAmount', {beid: systemInfo.beid}).then(function(rs) {
            if (rs.data.resultCode !== '1') return;
            $scope.gridOptions.data = rs.data.resultList;
            $scope.gridOptions.totalItems = rs.data.resultList.length;
        });
    }
    initData();

    $scope.del = function(param) {
        IHttp.post('basedata/deleteAnaesDoctorAmount', param).then(function(rs) {
            if (rs.data.resultCode !== '1') return;
            toastr.success(rs.data.resultMessage);
            initData();
        });
    }

    $scope.save = function() {
        vm.param.recordMonth = vm.param.year + '-' + vm.param.month;
        IHttp.post('basedata/updateAnaesDoctorAmount', vm.param).then(function(rs) {
            if (rs.data.resultCode !== '1') return;
            toastr.success(rs.data.resultMessage);
            initData();
        });
    }

    $scope.edit = function(entity) {
        vm.param = angular.copy(entity);
        if (entity.recordMonth) {
            vm.param.year = entity.recordMonth.split('-')[0];
            vm.param.month = entity.recordMonth.split('-')[1];
        }
    }

    $scope.cancel = function() {
        $uibModalInstance.close();
    }
}