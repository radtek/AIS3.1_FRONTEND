AllPackDialogCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$q', 'toastr', 'auth', '$uibModalInstance'];

module.exports = AllPackDialogCtrl;

function AllPackDialogCtrl($rootScope, $scope, IHttp, $q, toastr, auth, $uibModalInstance) {
    vm = this;
    vm.title="一键替换";
    let parent = $scope.$parent;

    $scope.costType = 1;
    $scope.medicineItem = {};
    $scope.$watch('costType', function(n, o){
        $scope.cur = '';
        $scope.obj = '';
        $scope.curText = '';
        $scope.objText = '';
    })

    $scope.searchList = function(query) {
        var deferred = $q.defer(),
            url = $scope.costType == 1 ? 'queryChargeTempMedicineItemByPy' : 'queryChargeTempPayItemByPy',
            param = $scope.costType == 1 ? { name: query } : { pinyin: query };
        IHttp.post("basedata/" + url, param).then(function(rs) {
            return deferred.resolve(rs.data.rsList);
        });
        return deferred.promise;
    }

    $scope.searchRepList = function(query) {
        var deferred = $q.defer(),
            url = $scope.costType == 1 ? 'queryHisMedicinePriceDetailList' : 'queryHisChargeItemList',
            param = $scope.costType == 1 ? { name: query } : { pinyin: query };
        IHttp.post("interfacedata/" + url, param).then(function(rs) {
            return deferred.resolve(rs.data.rsList);
        });
        return deferred.promise;
    }

    vm.replace = function() {
        if(angular.equals($scope.cur, $scope.obj)) {
            toastr.warning('相同的两项收费包添加项不能替换！');
            return;
        }
        var curObj = { };
        if ($scope.costType == 1) {
            curObj.fromMedId = $scope.cur.medicineId;
            curObj.fromFirmId = $scope.cur.firmId;
            curObj.toMedId = $scope.obj.medicineId;
            curObj.toFirmId = $scope.obj.firmId;
        } else if ($scope.costType == 2) {
            curObj = angular.copy($scope.obj);
            curObj.fromChargeItemId = $scope.cur.chargeItemId;
        }
        curObj.costType = $scope.costType;
        IHttp.post($rootScope.baseUrl + '/basedata/batchReplaceChargeTempDetailData', curObj).then(function(rs) {
            $uibModalInstance.close('cancel');
        });
    };

    vm.close = function() {
        $uibModalInstance.close('cancel');
    }

}
