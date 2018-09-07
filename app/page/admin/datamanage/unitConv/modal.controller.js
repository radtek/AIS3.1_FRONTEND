ModalInstanceCtrl.$inject = ['$uibModalInstance', '$scope', 'IHttp', 'toastr'];

module.exports = ModalInstanceCtrl;

function ModalInstanceCtrl($uibModalInstance, $scope, IHttp, toastr) {
    var opt = $scope.item.opt;

    $scope.obj = {
        "id": opt ? opt.id : '',
        "baseUnit": opt ? opt.baseUnit : '',
        "transUnit": opt ? opt.transUnit : '',
        "transProp": opt ? opt.transProp : ''
    }

    $scope.ok = function() {
        IHttp.post('bas/saveBasUnitTrans', $scope.obj).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            $uibModalInstance.close();
        });
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };
}
