MaterialInputCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'toastr', '$timeout', '$uibModalInstance', 'uiGridServe'];

module.exports = MaterialInputCtrl;

function MaterialInputCtrl($rootScope, $scope, IHttp, toastr, $timeout, $uibModalInstance, uiGridServe) {
    vm = this;
    vm.title = "出库明细";

    var promise,
        params = uiGridServe.params({
            filters: [{
                field: "chargeItemId",
                value: $scope.data.chargeItemId
            }, {
                field: "batch",
                value: $scope.data.batch
            }, {
                field: "inOutType",
                value: "O"
            }]
        });

    initPage();

    $scope.gridOptions = uiGridServe.option({
        columnDefs: [{
            field: 'name',
            displayName: '物资名称',
            cellTooltip: function(row, col) {
                return row.entity.name;
            }
        }, {
            field: 'inOutWayName',
            displayName: '出库方式',
            width: 95
        }, {
            field: 'inOutAmount',
            displayName: '出库数量',
            width: 85
        }, {
            field: 'minPackageUnit',
            displayName: '单位',
            width: 70
        }, {
            field: 'operator',
            displayName: '经办人',
            visible: false
        }, {
            field: 'inOutDate',
            displayName: '出库日期',
            width: 95
        }, {
            field: 'chargeItemId',
            displayName: '收费项目ID',
            visible: false
        }, {
            field: 'spec',
            displayName: '规格',
            visible: false
        }, {
            field: 'firm',
            displayName: '厂家',
            visible: false
        }, {
            field: 'priceStock',
            displayName: '出库价',
            width: 85
        }, {
            field: 'inOutMoney',
            displayName: '出库金额',
            width: 85
        }, {
            field: 'nurse',
            displayName: '发放人',
            width: 90
        }]
    });

    vm.close = function() {
        $uibModalInstance.close('cancel');
    }

    function initPage() {
        IHttp.post("basedata/searchOutInfo", params).then((rs) => {
            if (rs.data.resultCode != 1) return;
            $scope.gridOptions.totalItems = rs.data.total;
            $scope.gridOptions.data = rs.data.resultList;
        });
    };
}