MaterialInputCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'toastr', '$uibModalInstance', 'select', '$filter', 'auth'];

module.exports = MaterialInputCtrl;

function MaterialInputCtrl($rootScope, $scope, IHttp, toastr, $uibModalInstance, select, $filter, auth) {
    vm = this;
    vm.title = "添加入库";
    vm.inOutWayList = [
        { 'value': '1', 'name': '批量入库' },
        { 'value': '2', 'name': '结余退还' }
    ]

    if ($scope.data.row) {
        vm.title = "编辑入库信息";
        $scope.medicalParams = $scope.data.row.entity;
        $scope.medicalParams.chargeItem = {
            chargeItemId: $scope.data.row.entity.chargeItemId,
            name: $scope.data.row.entity.name,
            pinYin: $scope.data.row.entity.pinYin,
            spec: $scope.data.row.entity.spec,
            unit: $scope.data.row.entity.minPackageUnit
        };
    } else {
        $scope.medicalParams = {
            businessSerialNumber: "",
            invoiceNumber: "",
            spec: "",
            firm: "",
            batch: "",
            operator: auth.loginUser().userName,
            priceStock: "",
            inOutAmount: "",
            inOutMoney: "",
            inOutWay: "",
            inOutType: "",
            inOutDate: $filter('date')(new Date(), 'yyyy-MM-dd'),
            name: "",
            minPackageUnit: "",
            materielType: "I",
            productionDate: $filter('date')(new Date(), 'yyyy-MM-dd'),
            expiryDate: $filter('date')(new Date(), 'yyyy-MM-dd'),
            nurse: "",
            chargeItemId: ""
        };
    }

    vm.close = function() {
        $uibModalInstance.close('cancel');
    }

    select.getChargeItemList().then((rs) => {
        if (rs.status === 200 && rs.data.resultCode === '1') {
            vm.chargeItemList = rs.data.resultList;
        }
    })

    $scope.save = function(type) {
        $scope.verify = verify();
        if (!$scope.verify)
            return;
        $rootScope.btnActive = false;
        $scope.medicalParams.inOutType = type;
        $scope.medicalParams.chargeItemId = $scope.medicalParams.chargeItem.chargeItemId;
        $scope.medicalParams.name = $scope.medicalParams.chargeItem.name;
        $scope.medicalParams.minPackageUnit = $scope.medicalParams.chargeItem.unit;
        $scope.medicalParams.spec = $scope.medicalParams.chargeItem.spec;

        IHttp.post('basedata/updateInOutInfo', $scope.medicalParams).then((rs) => {
            $rootScope.btnActive = true;
            if (rs.status === 200 && rs.data.resultCode === '1') {
                $uibModalInstance.close('success');
            } else {
                $uibModalInstance.dismiss('faild');
            }
        }, (err) => {
            $uibModalInstance.dismiss(err);
        });
    }

    // 验证
    function verify() {
        return $scope.BaseInfoForm.$valid && !!($scope.medicalParams.chargeItem || $scope.medicalParams.businessSerialNumber || $scope.medicalParams.invoiceNumber || $scope.medicalParams.firm || $scope.medicalParams.batch || $scope.medicalParams.inOutWay || $scope.medicalParams.priceStock || $scope.medicalParams.inOutAmount || $scope.medicalParams.inOutMoney || $scope.medicalParams.productionDate || $scope.medicalParams.expiryDate)
    }
}