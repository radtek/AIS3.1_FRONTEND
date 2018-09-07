OptFinanceCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$q', 'toastr', 'auth', 'anaesCheckOutServe', '$uibModalInstance'];

module.exports = OptFinanceCtrl;

function OptFinanceCtrl($rootScope, $scope, IHttp, $q, toastr, auth, anaesCheckOutServe, $uibModalInstance) {
    vm = this;
    vm.title="手术费用";
    let chargedType = '1', costType = '2';
    if ($scope.$parent.type === 'cl') {
        vm.title="耗材费用";
        chargedType = '2';
        costType = '1';
    }else if ($scope.$parent.type === 'ss') {
        vm.title="添加项目";
        chargedType = '1';
        costType = '1';
    }else if ($scope.$parent.type === 'mzcz') {
        vm.title="麻醉操作费用";
        chargedType = '3';
        costType = '1';
    }else if ($scope.$parent.type === 'mzfy') {
        vm.title="麻醉费用";
        chargedType = '1';
        costType = '1';
    }
    let regOptId = $rootScope.$stateParams.regOptId;
    $scope.docInfo = auth.loginUser();

    $scope.getChargeItemList = function(query) {
        return getChargeItemList_(query);
    }

    function getChargeItemList_(query) {
        var deferred = $q.defer(),
            param = {
                pageNo: 1,
                pageSize: 200,
                filters: [
                    {
                        "field": "pinYin",
                        "value": "" + query + ""
                    }, {
                        "field": "enable",
                        "value": "1"
                    }
                ]
            }
        IHttp.post('basedata/queryChargeItem', param).then((rs) => {
            if (rs.data.resultList.length > 0)
                deferred.resolve(rs.data.resultList);
            else
                deferred.resolve(param);
        })
        return deferred.promise;
    }

    $scope.getInstrumentList = function(query) {
        var deferred = $q.defer(),
        param = {pinYin: query, pageNo: 1, pageSize: 200};
        IHttp.post(url, param).then((rs) => {
            if (rs.data.resultList.length > 0)
                deferred.resolve(rs.data.resultList);
            else
                deferred.resolve([{ name: query }]);
        })
        return deferred.promise;
    }

    vm.save = function() {
        anaesCheckOutServe.addCharge({
            regOptId: regOptId,
            createUser: $scope.docInfo.userName,
            userType: $scope.docInfo.userType,
            chargeItemId: $scope.chargeItem.chargeItemId,
            chargeAmount: $scope.number,
            shouldSum: ($scope.number * $scope.chargeItem.price).toFixed(2),
            costType: costType,
            chargedType: chargedType  //计费类型--手术费用|材料费用
        }).then(function(rs) {
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
