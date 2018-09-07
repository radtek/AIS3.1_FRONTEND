OutRoomTimeCtrl.$inject = ['$scope', 'IHttp', '$uibModalInstance', '$filter'];

module.exports = OutRoomTimeCtrl;

function OutRoomTimeCtrl($scope, IHttp, $uibModalInstance, $filter) {
    $scope.params = {
        outRoomTime: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm')
    };

    $scope.save = function() {
        $uibModalInstance.close($scope.params);
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };

}
