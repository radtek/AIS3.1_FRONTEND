editAnnouncementDictionary.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModalInstance', 'toastr', '$timeout'];

module.exports = editAnnouncementDictionary;

function editAnnouncementDictionary($rootScope, $scope, IHttp, $uibModalInstance, toastr, $timeout) {
    var promise;
    //user group li
    var id = $scope.id;
    if (id === 0) {
        $scope.lable = '发布公告信息';
    } else {
        $scope.lable = '编辑公告信息';
    }

    $scope.save = function() {
        $scope.verify = verify();
        if (!$scope.verify) {
            return;
        }
        $rootScope.btnActive = false;
        promise = $timeout(function() {
            IHttp.post("basedata/saveAnnouncement", $scope.announcement).then(function(rs) {
                if (rs.data.resultCode === '1') {
                    $uibModalInstance.close();
                    toastr.success(rs.data.resultMessage);
                }
                $rootScope.btnActive = true;
            });
        }, 500);
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };

    // 验证
    function verify() {
        return $scope.form.$valid && !!($scope.announcement.title)
    }
}
