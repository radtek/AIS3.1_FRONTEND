consumableStatDialogCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$timeout', 'toastr','$uibModal', '$uibModalInstance', 'select', '$filter', 'auth', 'uiGridServe'];

module.exports = consumableStatDialogCtrl;

function consumableStatDialogCtrl($rootScope, $scope, IHttp, $timeout, toastr,$uibModal, $uibModalInstance, select, $filter, auth, uiGridServe) {
    vm = this;
    vm.title = "查看明细";
    var promise,
        params = uiGridServe.params(),
        entity = $scope.data.row.entity;

    if ($scope.data.row) {
        vm.title = "查看记账耗材明细";
        getPage($scope.data)
    }

    $scope.gridOptions = uiGridServe.option({
        columnDefs: [{
            field: 'instrumentName',
            displayName: '耗材',
            width: 260,
            cellTooltip: function(row, col) {
                return row.entity.instrumentName;
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
        var instrumentId=$scope.data.row.entity.instrumentId;
        params.filters = [
            { field: "startTime", value: startTime },
            { field: "endTime", value: endTime },
            { field: "receive", value: receiveName },
            { field: "instrumentId", value: instrumentId },
        ];
        IHttp.post('basedata/queryChargeAmountDetailByChargeId', params).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            $scope.gridOptions.totalItems = rs.data.total;
            for (var i = 0; i < rs.data.resultList.length; i++) {
                rs.data.resultList[i].instrumentName = entity.instrumentName;
            }
            $scope.gridOptions.data = rs.data.resultList;
        });
    }

    vm.close = function() {
        $uibModalInstance.close('cancel');
    }
}