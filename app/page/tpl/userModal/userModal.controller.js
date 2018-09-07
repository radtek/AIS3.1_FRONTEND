DocModalCtrl.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'IHttp', 'toastr', 'auth'];

module.exports = DocModalCtrl;

function DocModalCtrl($rootScope, $scope, $uibModalInstance, IHttp, toastr, auth) {
    var curUser = auth.loginUser();
    $scope.userInfo = { username: '', password: '', logionBeid: curUser.beid, module: curUser.module == 'oprm' ? 'oprm' : 'ctrlcent' };

    $scope.ok = function(userInfo) {
        var curUserName = curUser.userName
            username = $scope.userInfo.username;
        if (!userInfo.username) {
            $scope.errName = '用户名不能为空';
            return;
        } else if (!userInfo.password) {
            $scope.errPwd = '用户密码不能为空';
            return;
        }
        curUserName = curUserName.toLowerCase();
        username = username.toLowerCase();
        if (curUserName != username) {
            toastr.error('验证用户非当前用户，操作失败！');
            return;
        }
        IHttp.login(userInfo).then(function(user) {
            if (user.data.resultCode == 1) {
                $uibModalInstance.close();
            } else if (user.data.resultCode == 20000001)
                $scope.errName = user.data.resultMessage;
            else if (user.data.resultCode == 20000002)
                $scope.errPwd = user.data.resultMessage;
        });
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };
}
