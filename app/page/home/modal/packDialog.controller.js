PackDialogCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$q', 'toastr', 'auth', '$uibModalInstance'];

module.exports = PackDialogCtrl;

function PackDialogCtrl($rootScope, $scope, IHttp, $q, toastr, auth, $uibModalInstance) {
    vm = this;
    vm.title="一键替换";
    let parent = $scope.$parent;
    var costType = parent.costType,
        item = parent.item;

    $scope.opt = {
        name: costType == 1 ? item.name : item.chargeItemName,
        spec: costType == 1 ? item.spec : '',
        price: costType == 1 ? item.priceMinPackage : item.basicUnitPrice
    }

    $scope.getItems = function(query) {
        var deferred = $q.defer(),
            url = costType == 1 ? 'queryHisMedicinePriceDetailList' : 'queryHisChargeItemList',
            param = costType == 1 ? { name: query } : { pinyin: query };
        IHttp.post("interfacedata/" + url, param).then(function(rs) {
            return deferred.resolve(rs.data.rsList);
        });
        return deferred.promise;
    }

    vm.replace = function() {
        var curObj = {};
        if (costType == 1) {
            curObj.fromMedId = item.medicineId;
            curObj.fromFirmId = item.firmId;
            curObj.toMedId = $scope.cur.medicineId;
            curObj.toFirmId = $scope.cur.firmId;                
        } else if (costType == 2) {
            curObj = angular.copy($scope.cur);
            curObj.fromChargeItemId = item.chargeItemId;
        }
        curObj.costType = costType;
        IHttp.post('basedata/batchReplaceChargeTempDetailData', curObj).this(function(rs) {
            $uibModalInstance.close('cancel');
        });
    };

    vm.close = function() {
        $uibModalInstance.close('cancel');
    }

}
