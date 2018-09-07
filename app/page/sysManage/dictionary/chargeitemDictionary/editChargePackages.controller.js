editChargeitemDictionary.$inject = ['$scope', 'IHttp', '$uibModalInstance', '$timeout', 'items', 'uiGridConstants', '$uibModal', 'confirm', 'toastr'];

module.exports = editChargeitemDictionary;

function editChargeitemDictionary($scope, IHttp, $uibModalInstance, $timeout, items, uiGridConstants, $uibModal, confirm, toastr) {
    var promise;
    $scope.params = {
        pageNo: 1,
        pageSize: 15,
        sort: '',
        orderBy: '',
        filters: []
    };

    $scope.chargePackages = items.row;
    //user group li
    var chargePkgId = $scope.chargePkgId;
    if (chargePkgId === 0) {
        $scope.lable = '新增收费项目包';
    } else {
        $scope.lable = '编辑收费项目包';
        IHttp.post("basedata/queryChargePackagesById", { 'chargePkgId': items.row.chargePkgId }).then(function(data) {
            if (data.data.resultCode !== '1') return;
            $scope.chargePackages = data.data.chargePackages;
            $scope.chargePackages.enable = $scope.chargePackages.enable + '';
        });
    }

    $scope.save = function() {
    	var params = {
    		chargePackages : $scope.chargePackages
    	};
        IHttp.post('basedata/updateChargePackages', params).then(function(rs) {
            if (rs.data.resultCode === '1') {
                $uibModalInstance.close();
                toastr.success(rs.data.resultMessage);
            }
        });
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };
}
