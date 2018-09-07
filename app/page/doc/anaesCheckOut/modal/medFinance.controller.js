MedFinanceCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$q', 'toastr', 'auth', 'anaesCheckOutServe', '$uibModalInstance'];

module.exports = MedFinanceCtrl;

function MedFinanceCtrl($rootScope, $scope, IHttp, $q, toastr, auth, anaesCheckOutServe, $uibModalInstance) {
    vm = this;
    vm.title="药品费用";
    let regOptId = $rootScope.$stateParams.regOptId;
    $scope.docInfo = auth.loginUser();

    $scope.getMedicineList = function(query) {
        return getMedicineList_(query);
    }

    function getMedicineList_(query) {
        var deferred = $q.defer(),
            param = { pinyin: query, pageNo: 1, pageSize: 200 }
        IHttp.post('basedata/getMedicineList', param).then((rs) => {
            if (rs.data.resultList.length > 0)
                deferred.resolve(rs.data.resultList);
            else
                deferred.resolve(param);
        })
        return deferred.promise;
    }

    $scope.$watch('medicineItem', function(n) {
        if (n === undefined) return;
        $scope.medicineItem.spec = n.spec;
        $scope.medicineItem.firm = n.firm;
        $scope.medicineItem.medicineId = n.medicineId;
        $scope.medicineItem.priceId = n.priceId;
        $scope.medicineItem.minPackageUnit = n.minPackageUnit;
    });

    vm.save = function() {
        $scope.medicineItem.packageTotalAmount = $scope.jjyl;
        $scope.medicineItem.regOptId = regOptId;
        $scope.medicineItem.createUser = $scope.docInfo.userName;
        $scope.medicineItem.userType = $scope.docInfo.userType;
        $scope.medicineItem.costType = '2';
        $scope.medicineItem.isCharged = 1;
        $scope.medicineItem.chargedType = '1';
        $scope.medicineItem.state = 'NO_FINISH';
        $scope.medicineItem.firmId = $scope.medicineItem.firmId;
        $scope.medicineItem.code = $scope.medicineItem.medicineId;
        $scope.medicineItem.shouldCost = ($scope.medicineItem.priceMinPackage * $scope.jjyl).toFixed(2);
        anaesCheckOutServe.addBilling([$scope.medicineItem]).then(function(rs) {
            if (rs.data.resultCode === '1') {
                $uibModalInstance.close('cancel');
            }
        });
    }
    
    vm.add = function() {
        IHttp.post('basedata/queryInstrsuitById',{
            instrsuitId: vm.selectedItem.instrsuitId
        }).then((rs) => {
            if (rs.status === 200 && rs.data.resultCode === '1') {
                var resultList = rs.data.resultList;
                for(var result of resultList) {
                    submit(result.instrumentId, vm.selectedItem.instrsuitId, result.type);
                }
                $uibModalInstance.close('success');
            } else {
                $uibModalInstance.dismiss('faild');
            }
        },(err) => {
            $uibModalInstance.dismiss(err);
        })
    }

    function submit (instrumentId, instrsuitId, type) {
        IHttp.post('document/insertInstrubillItem',{
            regOptId: $rootScope.$stateParams.regOptId,
            optNurseId: $scope.optNurseId,
            instrumentId: instrumentId,
            instrsuitId: instrsuitId,
            type: type
        }).then((rs) => {
            if (rs.status === 200 && rs.data.resultCode === '1') {
                $uibModalInstance.close('success');
            } else {
                $uibModalInstance.dismiss('faild');
            }
        },(err) => {
            $uibModalInstance.dismiss(err);
        })
    }

    vm.close = function() {
        $uibModalInstance.close('cancel');
    }

}
