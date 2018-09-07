MaterialOutputCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'toastr', '$uibModalInstance', '$filter', 'auth'];

module.exports = MaterialOutputCtrl;

function MaterialOutputCtrl($rootScope, $scope, IHttp, toastr, $uibModalInstance, $filter, auth) {
    vm = this;
    vm.title = "出库信息";
    $scope.medicalInOutWay = [
        { 'value': '1', 'name': '发放出库' },
        { 'value': '2', 'name': '废弃出库' },
        { 'value': '3', 'name': '失效出库' },
        { 'value': '4', 'name': '报损出库' },
        { 'value': '5', 'name': '退库出库' },
        { 'value': '6', 'name': '交换出库' },
        { 'value': '7', 'name': '结算出库' },
        { 'value': '8', 'name': '其它出库' }
    ]

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

    vm.close = function() {
        $uibModalInstance.close('cancel');
    }

    $scope.save = function(type) {
        $scope.verify = verify();
        if (!$scope.verify)
            return;

        $rootScope.btnActive = false;
        $scope.medicalParams.inOutType = type;

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

    IHttp.post('basedata/searchOutAndInventory', { id: $scope.data.tagId, type: $scope.data.tag }).then((rs) => {
        $scope.medicalParams = rs.data.resultData;
        $scope.medicalParams.materielType = "I";
        if (!rs.data.resultData.inOutDate)
            $scope.medicalParams.inOutDate = $filter('date')(new Date(), 'yyyy-MM-dd');
    });

    // 验证
    function verify() {
        return $scope.BaseInfoForm.$valid && !!($scope.medicalParams.name || $scope.medicalParams.inOutAmount || $scope.medicalParams.inOutMoney || $scope.medicalParams.inOutWay || $scope.medicalParams.inOutDate || $scope.medicalParams.nurse)
    }
}