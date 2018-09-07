module.exports = confirm;

confirm.$inject = ['$uibModal', '$timeout'];

function confirm($uibModal, $timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                var message = attrs.ngReallyMessage || "是否确定此操作？";
                var modalHtml = '<h4 class="modal-header" style="color: #fff; margin-top: 0; margin-bottom: 0;">警告</h4><div class="modal-body">' + message + '</div>';
                modalHtml += '<div class="modal-footer"><button class="btn btn-primary" ng-click="ok()">确定</button><button class="btn" ng-click="cancel()">取消</button></div>';
                var modalInstance = $uibModal.open({
                    template: modalHtml,
                    size: 'sm',
                    controller: ['$scope', '$uibModalInstance', ModalInstanceCtrl]
                });
                modalInstance.result.then(function() {
                    $timeout(function() {
                        scope.$apply(attrs.confirm);
                    });
                });
            });
        }
    }

    function ModalInstanceCtrl($scope, $uibModalInstance) {
        $scope.ok = function() {
            $uibModalInstance.close();
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    };
}
