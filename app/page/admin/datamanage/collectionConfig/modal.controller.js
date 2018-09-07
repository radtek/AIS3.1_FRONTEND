ModalInstanceCtrl.$inject = ['$uibModalInstance', '$scope', 'IHttp', 'toastr'];

module.exports = ModalInstanceCtrl;

function ModalInstanceCtrl($uibModalInstance, $scope, IHttp, toastr) {

    var opt = $scope.item.opt;

    $scope.obj = {
        "eventId": opt ? opt.eventId : '',
        "eventName": opt ? opt.eventName : '',
        "precision": opt ? opt.precision : '',
        "frequency": opt ? opt.frequency : '',
        "max": opt ? opt.max : '',
        "min": opt ? opt.min : '',
        "amendFlag": opt ? opt.amendFlag : 1,
        "color": opt ? opt.color : '',
        "icon": opt ? opt.icon : '',
        "units": opt ? opt.units : '',
        "eventDesc": opt ? opt.eventDesc : '',
        "limitMax": opt ? opt.limitMax : '',
        "limitMin": opt ? opt.limitMin : '',
        "beid": opt ? opt.beid : ''
    }

    IHttp.post('sys/selectBusForDropDown', {}).then(function(rs) {
        if (rs.data.resultCode != 1) return;
        $scope.hospital = rs.data.sysBusDropDown;
    });

    $scope.ok = function() {
        var url = 'bas/addMonitorConfig';
        if(opt)
            url = 'bas/updateMonitorConfig';
        IHttp.post(url, $scope.obj).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            $scope.hospital = rs.data.sysBusDropDown;
        });
        $uibModalInstance.close();
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };
}
