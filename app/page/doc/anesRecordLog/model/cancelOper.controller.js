CancelOperCtrl.$inject = ['$rootScope', '$scope', 'toastr', '$uibModalInstance', 'IHttp'];

module.exports = CancelOperCtrl;

function CancelOperCtrl($rootScope, $scope, toastr, $uibModalInstance, IHttp) {

    $scope.ok = function() {
        $uibModalInstance.close($scope.reasons);
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };
}
