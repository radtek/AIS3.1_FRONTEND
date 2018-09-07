consumableStatDialogCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$timeout', 'toastr','$uibModal', '$uibModalInstance', 'select', '$filter', 'auth', 'uiGridServe'];

module.exports = consumableStatDialogCtrl;

function consumableStatDialogCtrl($rootScope, $scope, IHttp, $timeout, toastr,$uibModal, $uibModalInstance, select, $filter, auth, uiGridServe) {
    vm = this;
    vm.title = "查看明细";
    var promise,
        params = uiGridServe.params(),
        entity = $scope.data.row.entity;

    if ($scope.data.row) {
        vm.title = "查看记账药品明细";
        getPage($scope.data)
    }

    $scope.gridOptions = uiGridServe.option({
        columnDefs: [{
            field: 'medicineName',
            displayName: '药品',
            width: 260,
            cellTooltip: function(row, col) {
                return row.entity.medicineName;
            }
        }, {
            field: 'name',
            displayName: '病人姓名',
            cellTooltip: function(row, col) {
                return row.entity.name;
            }
        }, {
            field: 'deptName',
            displayName: '科室',
            cellTooltip: function(row, col) {
                return row.entity.deptName;
            }
        }, {
            field: 'spec',
            displayName: '规格',
            cellTooltip: function(row, col) {
                return row.entity.spec;
            }
        }, {
            field: 'chargeAmount',
            displayName: '记账数量',
            cellTooltip: function(row, col) {
                return row.entity.chargeAmount;
            }
        }, {
            field: 'receiveName',
            displayName: '记账人',
            cellTooltip: function(row, col) {
                return row.entity.receiveName;
            }
        }]
    },getPage);

    function getPage(data) {
        var startTime = data.startTime;
        var endTime = data.endTime;
        var medicineName = $scope.data.row.entity.medicineName;
        var firm = $scope.data.row.entity.firm;
        var spec = $scope.data.row.entity.spec;
        var receiveName = data.row.entity.receive;
        var instrumentName=$scope.data.row.entity.instrumentName;
        var instrumentId=$scope.data.row.entity.instrumentId;
        var medicineCode=$scope.data.row.entity.medicineCode;
        params.filters = [
            { field: "startTime", value: startTime },
            { field: "endTime", value: endTime },
            { field: "receive", value: receiveName },
            { field: "medicineCode", value: medicineCode },
        ];
        IHttp.post('basedata/queryChargeAmountDetailByMedId', params).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            for (var i = 0; i < rs.data.resultList.length; i++) {
                rs.data.resultList[i].medicineName = entity.medicineName;
            }
            $scope.gridOptions.data = rs.data.resultList;
            $scope.gridOptions.totalItems = rs.data.total;
        });
    }

    vm.close = function() {
        $uibModalInstance.close('cancel');
    }
}