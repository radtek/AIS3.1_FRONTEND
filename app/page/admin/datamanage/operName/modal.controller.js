ModalInstanceCtrl.$inject = ['$uibModalInstance', '$scope', 'IHttp', 'toastr'];

module.exports = ModalInstanceCtrl;

function ModalInstanceCtrl($uibModalInstance, $scope, IHttp, toastr) {
    var opt = $scope.item.opt;

    $scope.obj = {
        "id": opt ? opt.id : '',
        "code": opt ? opt.code : '',
        "name": opt ? opt.name : '',
        "pinyin": opt ? opt.pinyin : '',
        "enable": opt ? opt.enable : 1,
        "beid": opt ? opt.beid : '',
        "beName": opt ? opt.beName : ''
    }

    IHttp.post('sys/selectBusForDropDown', {}).then(function(rs) {
        if (rs.data.resultCode != 1) return;
        $scope.hospital = rs.data.sysBusDropDown;
    });


    $scope.ok = function() {
        IHttp.post('bas/updateOperDef', $scope.obj).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            $scope.hospital = rs.data.sysBusDropDown;
        });
        $uibModalInstance.close();
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };
}
