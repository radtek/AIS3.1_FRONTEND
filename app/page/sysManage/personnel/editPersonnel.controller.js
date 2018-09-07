editPersonnel.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModalInstance', 'select', 'confirm', 'toastr', '$timeout'];

module.exports = editPersonnel;

function editPersonnel($rootScope, $scope, IHttp, $uibModalInstance, select, confirm, toastr, $timeout) {
    var promise;
    $scope.user = {};
    var url = '';

    if ($scope.userName) {
        $scope.tag = "编辑";
        url = 'sys/updateUser';
        IHttp.post('sys/searchBasUserById', { userName: $scope.userName }).then(function(data) {
            $scope.user = data.data.entity;
            $scope.image = $scope.user.picPath + '?' + new Date().getTime();
            $scope.user.enable = $scope.user.enable + '';
        });
    } else {
        $scope.tag = "新增";
        url = 'sys/createUser';
        $scope.user.locked = 0;
    }

    select.getProfessionalTitle().then(function(data) {
    	$scope.professionalTitleList = data.data.resultList;
    });
    select.getExecutiveLevel().then(function(data) {
    	$scope.executiveLeveleList = data.data.resultList;
    });
    select.getUserType().then(function(data) {
    	$scope.userTypeList = data.data.resultList;
    });
    select.getRoleGroup().then(function(data) {
    	$scope.roleList = data.data.resultList;
    });

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    }

    $scope.save = function() {
        $scope.verify = verify();
        if (!$scope.verify) {
            return;
        }
        $rootScope.btnActive = false;
        if (promise) {
            $timeout.cancel(promise);
        }
        if (!$scope.user.picPath || $scope.image.indexOf($scope.user.picPath) === -1) {
            $scope.user.dzqm = $scope.image;
        } else {
            $scope.user.dzqm = '';
        }
        promise = $timeout(function() {
            IHttp.post(url, $scope.user).then(function(rs) {
                $rootScope.btnActive = true;
                if (rs.data.resultCode === '1') {
                    $uibModalInstance.close();
                    toastr.success(rs.data.resultMessage);
                }
            });
        }, 500);
    }

    // 验证
    function verify() {
        return $scope.userform.$valid && !!($scope.user.userName || $scope.user.name || $scope.user.userType || $scope.user.roleType || $scope.user.professionalTitle || $scope.user.roleId || $scope.user.enable)
    }
}
