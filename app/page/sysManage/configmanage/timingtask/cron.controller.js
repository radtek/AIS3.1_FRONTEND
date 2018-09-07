cron.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModalInstance', 'select', 'confirm', 'toastr', '$timeout'];

module.exports = cron;

function cron($rootScope, $scope, IHttp, $uibModalInstance, select, confirm, toastr, $timeout) {
		var id=$scope.id;
		var cronExpression=angular.copy($scope.cronExpression);
		sessionStorage.setItem('cronExpression', cronExpression);
	$scope.cancel = function() {
        $uibModalInstance.dismiss();
    };

    $scope.saveOperationRoom = function(row) {
    	var cronval=sessionStorage.getItem('cronval');
        var params={};
        if(angular.equals(cronExpression,cronval)){
            toastr.error("未进行任何编辑");
            return;
        }
        params.id=id;
        params.cronExpression=cronval;
        promise = $timeout(function() {
            IHttp.post("sys/updateTaskSchedule",params).then(function(rs) {
                $rootScope.btnActive = true;
                if (rs.data.resultCode === '1') {
                    $uibModalInstance.close();
                    toastr.success(rs.data.resultMessage);
                }
            });
        }, 500);
    }

}