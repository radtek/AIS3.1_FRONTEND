myStockInfoCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$timeout', 'toastr','$uibModal', '$uibModalInstance', 'select', '$filter', 'auth', 'uiGridServe'];

module.exports = myStockInfoCtrl;

function myStockInfoCtrl($rootScope, $scope, IHttp, $timeout, toastr,$uibModal, $uibModalInstance, select, $filter, auth, uiGridServe) {
    vm = this;
    vm.title = "查看明细";
    var promise,
        params = uiGridServe.params();

    if ($scope.data.row) {
        vm.title = "查看个人物资明细";
        getPage($scope.data)
    }

    $scope.gridOptions = uiGridServe.option({
        columnDefs: [{
            field: 'name',
            displayName: '患者姓名',
            cellTooltip: function(row, col) {
                return row.entity.name;
            }
        },
        //  {
        //     field: 'firm',
        //     displayName: '厂家名称',
        //     cellTooltip: function(row, col) {
        //         return row.entity.firm;
        //     }
        // }, 
        {
            field: 'spec',
            displayName: '规格',
            cellTooltip: function(row, col) {
                return row.entity.spec;
            }
        }, 
        {
            field: 'deptName',
            displayName: '科室',
            cellTooltip: function(row, col) {
                return row.entity.deptName;
            }
        },
        //  {
        //     field: 'inOutMoney',
        //     displayName: '类型',
        //     cellTooltip: function(row, col) {
        //         return row.entity.inOutMoney;
        //     }
        // }, 
        {
            field: 'chargeDate',
            displayName: '计费时间',
             width:250,
            cellTooltip: function(row, col) {
                return row.entity.chargeDate;
            }
        }, 
        {
            field: 'chargeAmount',
            displayName: '数量',
            cellTooltip: function(row, col) {
                return row.entity.chargeAmount;
            }
        }, {
            field: 'unit',
            displayName: '单位',
            cellTooltip: function(row, col) {
                return row.entity.unit;
            }
        }, 
        //  {
        //     field: 'outTime1',
        //     displayName: '取耗材时间',
        //     width: 140,
        //     cellTooltip: function(row, col) {
        //         return row.entity.outTime1;
        //     }
        // }, 
        // {
        //     field: 'id',
        //     displayName: '关联操作',
        //     enableFiltering: false,
        //     enableSorting: false,
        //     cellTemplate: '<div class="ui-grid-cell-contents" ><a href="" ng-click=grid.appScope.showIn(row)>查看明细</a></div>'
        // }
        ]
    },getPage);
     $scope.showIn = function(row) {
        alert("last")
    }
    function getPage(data) {
         var startTime = data.startTime;
        var endTime = data.endTime;
        var medicineName = $scope.data.row.entity.medicineName;
        var firm = $scope.data.row.entity.firm;
        var spec = $scope.data.row.entity.spec;
        var receiveName = data.row.entity.receive;
        var instrumentName=$scope.data.row.entity.instrumentName;
        var instrumentId=$scope.data.row.entity.instrumentId;
        params.filters = [{ "field": "startTime", "value": startTime },
            { "field": "endTime", "value": endTime },
            { "field": "receive", value: receiveName },
            // { "field": "firm", "value": firm },
            // { "field": "medicineName", "value": medicineName },
            // { "field": "spec", "value": spec }
            // { "field": "instrumentName", value: instrumentName },
            { "field": "instrumentId", value: instrumentId },
        ];
        IHttp.post('basedata/queryChargeAmountDetailByChargeId', params).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            $scope.gridOptions.totalItems = rs.data.total;
            for (var i = 0; i < rs.data.resultList.length; i++) {
                rs.data.resultList[i].outTime1 = $filter('date')(rs.data.resultList[i].outTime, 'yyyy-MM-dd HH:mm');
            }
            $scope.gridOptions.data = rs.data.resultList;
        });
    }

    vm.close = function() {
        $uibModalInstance.close('cancel');
    }
}