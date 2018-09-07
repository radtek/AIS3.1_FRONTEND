OutRoomTimeCtrl.$inject = ['$scope', 'IHttp', '$uibModalInstance', '$filter', 'toastr'];

module.exports = OutRoomTimeCtrl;

function OutRoomTimeCtrl($scope, IHttp, $uibModalInstance, $filter, toastr) {
	var curDate = new Date();
	curDate.setDate(curDate.getDate() + 1);
	var maxDate = new Date(curDate).getTime(),
        endOperTime = $scope.endOperTime;

    $scope.params = {
        outRoomTime: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm')
    };

    $scope.save = function() {
    	var curDate = new Date($scope.params.outRoomTime).getTime();
    	if(curDate > maxDate) {
    		toastr.warning('出室时间的修改不能大于24小时');
    		return;
    	}
        if(endOperTime && curDate < endOperTime) {
            toastr.warning('出室时间不能小于手术结束时间');
            return;
        }
        $uibModalInstance.close($scope.params);
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };

}
