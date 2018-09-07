SaveAsTempCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'toastr', 'auth', 'anaesCheckOutServe', '$uibModalInstance'];

module.exports = SaveAsTempCtrl;

function SaveAsTempCtrl($rootScope, $scope, IHttp, toastr, auth, anaesCheckOutServe, $uibModalInstance) {
    vm = this;
    let regOptId = $rootScope.$stateParams.regOptId;
    let user = auth.loginUser();
    let mark = '', text;

    let parent = $scope.$parent;
    mark = parent.mark;
    text = parent.text === undefined ? '' : parent.text;
    $scope.lvList = [{
        id: 1, name: '个人'
    }];
    $scope.lv = "1";
    if (user.roleType === 'ANAES_DIRECTOR' || user.roleType == 'HEAD_NURSE') {
        $scope.lvList.push({ id: 2, name: '科室' });
    }

    vm.save = function() {
        IHttp.post('basedata/updateLiquidTemp', {
            tempName: $scope.tempName,
            tempContent: text,
            createUser: user.userName,
            createName: user.name,
            createTime: new Date().getTime(),
            type: Number($scope.lv),
            remark: $scope.desc,
            tempType: $scope.tempType
        }).then(function(rs) {
            if (rs.data.resultCode === '1') {
                toastr.success(rs.data.resultMessage);
                $uibModalInstance.close('cancel');
            }
        });
    }

    vm.close = function() {
        $uibModalInstance.close('cancel');
    }

}
