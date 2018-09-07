ModalCtrl.$inject = ['$rootScope', '$scope', 'toastr', '$uibModalInstance', 'IHttp'];

module.exports = ModalCtrl;

function ModalCtrl($rootScope, $scope, toastr, $uibModalInstance, IHttp) {

    $scope.ok = function() {
        var url = $scope.tit == '激活' ? 'operation/activeRegOpt' : 'operation/cancelRegOpt';
        var regOptId = $scope.regOptId;
        if (!regOptId) {
            regOptId = $scope.$parent.data.items.regOptId;
        }
        IHttp.post(url, { regOptId: regOptId, reasons: $scope.reasons }).then(function(rs) {
            if (rs.data.resultCode != 1)
                return;
            $uibModalInstance.close('success');
        });
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };
}
