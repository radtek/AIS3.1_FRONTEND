OptFinanceCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'toastr', 'auth', 'anaesCheckOutServe', '$uibModalInstance'];

module.exports = OptFinanceCtrl;

function OptFinanceCtrl($rootScope, $scope, IHttp, toastr, auth, anaesCheckOutServe, $uibModalInstance) {
    vm = this;
    let regOptId = $rootScope.$stateParams.regOptId;
    let user = auth.loginUser();
    let mark = '', chargePayList = [], medChargeList = [], list;

    let parent = $scope.$parent;
    mark = parent.mark;
    list = parent.list;
    $scope.lvList = [{
        id: 2, name: '部门'
    }];
    $scope.lv = '2';

    $scope.list.forEach(function(item) {
        if (item._type == 'ss' || item._type == 'cl' || item._type == 'mzcz' || item._type == 'mz') {
            chargePayList.push({
                chargeItemId: item.chargeItemId,
                valamt: item.chargeAmount,
                chargedType: item.chargedType
            });
        } else {
            medChargeList.push({
                medicineId: $scope.mark == '收费包' ? item.medicineId : item.code,
                valamt: item.packageTotalAmount,
                firmId: item.firmId,
                chargedType: item.chargedType
            });
        }
    });

    vm.save = function() {
        var params = {
            tempName: $scope.tempName,
            createUser: user.userName,
            createName: user.name,
            createTime: new Date().getTime(),
            type: Number($scope.lv),
            remark: $scope.desc,
            tempType: $scope.userType == 'N' ? 2 : 1 // 1:医生  2：护士
        }
        var options = { tmpPriChargeMedTemp: params, tmpChargePayTempList: chargePayList, tmpMedPayTempList: medChargeList }
        IHttp.post('basedata/saveChargeMedTemp', options).then(function (rs){
            if (rs.data.resultCode === '1') {
                toastr.success(rs.data.resultMessage);
                vm.close('success');
            }
        });
    }

    vm.close = function(message) {
        $uibModalInstance.close(message);
    }

}
