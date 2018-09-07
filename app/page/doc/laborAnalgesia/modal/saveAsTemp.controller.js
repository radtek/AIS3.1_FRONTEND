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
        id: 1, name: '个人'
    }];
    $scope.lv = "1";
    if (user.administrativeLeve === 'ANAES_DIRECTOR' || user.administrativeLeve == 'OPERROOM_HEAD_NURSE') {
        $scope.lvList.push({ id: 2, name: '科室' });
    }

    // tempType=1 药品模板 2 输液模板 3 收费项目模板
    if (mark == '核算单' || mark == '收费包') {
        list.forEach(function(item) {
            console.log(item);
            if (item._type == 'ss' || item._type == 'cl' || item._type == 'mzfy' || item._type == 'mzcz') {
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
    }

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
                vm.close();
            }
        });
    }

    vm.close = function() {
        $uibModalInstance.close('cancel');
    }

}
