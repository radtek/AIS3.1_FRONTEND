ModalInstanceCtrl.$inject = ['$uibModalInstance', '$scope', 'IHttp', 'toastr'];

module.exports = ModalInstanceCtrl;

function ModalInstanceCtrl($uibModalInstance, $scope, IHttp, toastr) {

    var opt = $scope.item.opt;

    $scope.obj = {
        "id": opt ? opt.id : '',
        "name": opt ? opt.name : '',
        "scoValue": opt ? opt.scoValue : '',
        "optType": opt ? opt.optType - 0 : 1,
        "beid": opt ? opt.beid : ''
    }

    IHttp.post('sys/selectBusForDropDown', {}).then(function(rs) {
        if (rs.data.resultCode != 1) return;
        $scope.hospital = rs.data.sysBusDropDown;
    });


    $scope.ok = function() {
        IHttp.post('bas/saveBasDiagnoseSystemContrast', $scope.obj).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            $uibModalInstance.close();
        });
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };
}
