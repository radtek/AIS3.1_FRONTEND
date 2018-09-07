ModifyPwdCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'auth', '$timeout', 'toastr'];

module.exports = ModifyPwdCtrl;

function ModifyPwdCtrl($rootScope, $scope, IHttp, auth, $timeout, toastr) {
	let loginName = auth.loginUser().userName;
	let vm = this;
	vm.oldPass = '';
	vm.newPass = '';
	vm.rePass = '';
	vm.pattern = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/;
	vm.patternMsg = '密码应该为数字加字母组合，至少 6 个字符';
	vm.inputType = 'password';
	vm.changeInputType = changeInputType;

	function changeInputType() {
	  vm.inputType = vm.inputType === 'password' ? 'text' : 'password';
	}

	// 提交修改密码
	$scope.save = function() {
        $scope.verify = verify();
        if (!$scope.verify) {
            return;
        }else if(vm.newPass != vm.rePass) {
            toastr.error('新密码与确认密码不一致');
            return;
        }
        $rootScope.btnActive = false;
		IHttp.post('sys/changeUserPassword', {
	      loginName: loginName,
	      password: vm.oldPass,
	      newPassword: vm.newPass
	    })
	    .then((rs) => {
        	$rootScope.btnActive = true;
	    	if (rs.status === 200 && rs.data.resultCode === '1') {
	    		toastr.success(rs.data.resultMessage);
	    	}
	    })
	}

    // 验证
    function verify() {
        return $scope.passInfo.$valid && !!($scope.vm.oldPass || $scope.vm.newPass || $scope.vm.rePass)
    }
}
