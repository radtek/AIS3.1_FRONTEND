saveTplCtrl.$inject = ['$scope', 'IHttp', '$uibModalInstance', '$timeout', 'toastr', 'auth'];

module.exports = saveTplCtrl;

function saveTplCtrl($scope, IHttp, $uibModalInstance, $timeout, toastr, auth) {
    var vm = this,
        promise,
        user = auth.loginUser(),
        tplJson = $scope.data;

    vm.save = function() {
        if (promise) {
            $timeout.cancel(promise);
        }
        tplJson.forEach(item => {
            item.id = '';
            item.startTime = '';
            item.endTime = '';
        })
        promise = $timeout(function() {
            IHttp.post('basedata/addAnaesDoctemp', {
                createUser: user.userName,
                createName: user.userName,
                type: Number(vm.tplState),
                remark: vm.tplRemark,
                medTempName: vm.tplName,
                docType: 2,
                tempJson: JSON.stringify(tplJson)
            }).then(function(rs) {
                if (rs.data.resultCode != '1') return;
                toastr.info('添加模板成功');
                $uibModalInstance.close();
            });
        }, 500);
    }

    vm.cancel = function() {
        $uibModalInstance.dismiss();
    }
}