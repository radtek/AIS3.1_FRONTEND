saveAsTemp.$inject = ['$scope', 'IHttp', '$uibModalInstance', '$timeout', 'items', 'toastr', 'auth', '$filter'];

module.exports = saveAsTemp;

function saveAsTemp($scope, IHttp, $uibModalInstance, $timeout, items, toastr, auth, $filter) {
    var promise;
    var user = auth.loginUser();
    $scope.lvList = [{
        id: 1,
        name: '个人'
    }];

    $scope.lv = "1";

    if (user.roleType === 'ANAES_DIRECTOR') {
        $scope.lvList.push({ id: 2, name: '科室' });
    }
    if (items.szjcx) {
        var list = items.szjcx;
        for(var i=0; i<list.length; i++) {
            if (list[i].eventName === 'RESP' && list[i].realEventId) {
                list[i].eventId = list[i].realEventId;
            }
        }
    }

    $scope.save = function() {
        if (promise) {
            $timeout.cancel(promise);
        }
        promise = $timeout(function() {
            IHttp.post('basedata/addAnaesDoctemp', {
                createUser: user.userName,
                createName: user.userName,
                type: Number($scope.lv),
                remark: $scope.desc,
                medTempName: $scope.tempName,
                docType: 2,
                tempJson: JSON.stringify(items)
            }).then(function(rs) {
                if (rs.data.resultCode !== '1') return;
                toastr.info('添加模板成功');
                $uibModalInstance.dismiss();
            });
        }, 500);
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    }

}
