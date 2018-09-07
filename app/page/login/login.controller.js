LoginCtrl.$inject = ['$rootScope', '$scope', 'auth', 'baseConfig'];

module.exports = LoginCtrl;

function LoginCtrl($rootScope, $scope, auth, baseConfig) {
    $scope.userInfo = { username: '', password: '', logionBeid: '', module: module == 'oprm' ? 'oprm' : 'ctrlcent' };
    $scope.beList = [{ id: "103", name: "沈阳本溪" },{ id: "104", name: "常德临澧" },{ id: "107", name: "永兴人民医院" },{ id: "109", name: "黔南洲人民医院" }, { id: "110", name: "黔南洲中医医院" }, { id: "111", name: "湖南航天医院" }];
    $scope.fieldList = [{ fieldname: "控制中心", name: "ctrlcent" }, { fieldname: "复苏室", name: "pacu" }, { fieldname: "手术室", name: "oprm" }];
    if(!!notPacu){
        $scope.fieldList = [{ fieldname: "控制中心", name: "ctrlcent" }, { fieldname: "手术室", name: "oprm" }];
    }

    if (localStorage.getItem("module")) {
        $scope.userInfo.module = localStorage.getItem("module");
    } else {
        $scope.userInfo.module = "ctrlcent";
    }
    $scope.changeModuleFn = function() {
        localStorage.setItem("module", $scope.userInfo.module);
    }
    $scope.changeModuleFn();
    $scope.auth = function(userInfo) {
        if (!userInfo.username) {
            $scope.errName = '用户名不能为空';
            return;
        } else if (!userInfo.password) {
            $scope.errPwd = '用户密码不能为空';
            return;
        }
        auth.login(userInfo).then(function(user) {
            auth.curModule(userInfo.module);
            if (user.data.resultCode == 1) {
                baseConfig.init();
                if (userInfo.module == 'ctrlcent') {
                    if (user.data.user.beid == '101')
                        $rootScope.$state.go('hospital');
                    else if(user.data.user.beid == '103' || user.data.user.beid == '110'|| user.data.user.beid == '104')
                        $rootScope.$state.go('index');
                    else{
                        $rootScope.$state.go('home');
                    }
                } else if (userInfo.module == 'oprm') {
                    $rootScope.$state.go('operroom');
                } else if (userInfo.module == 'pacu')
                    $rootScope.$state.go('pacuroom');
            } else if (user.data.resultCode == 20000001)
                $scope.errName = user.data.resultMessage;
            else if (user.data.resultCode == 20000002)
                $scope.errPwd = user.data.resultMessage;
        });
    }

    var watch = $scope.$watch('userInfo', function(c) {
        if (c.name)
            $scope.errName = '';
        if (c.pwd)
            $scope.errPwd = '';
    }, true);
}