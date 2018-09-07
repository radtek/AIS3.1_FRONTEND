ModalInstanceCtrl.$inject = ['$uibModalInstance', '$scope', 'IHttp', 'toastr','auth'];

module.exports = ModalInstanceCtrl;

function ModalInstanceCtrl($uibModalInstance, $scope, IHttp, toastr,auth) {
     var  loginInfo = auth.loginUser();
    $scope.obj = $scope.item.entity;
    $scope.positionList = [{
        value: 0,
        label: '描点'
    }, {
        value: 1,
        label: '数字'
    }, {
        value: -1,
        label: '实时'
    }, ];
     $scope.interfaceTypeList = [{
        value: 1,
        label: 'TCP'
    }, {
        value: 2,
        label: '串口'
    }, {
        value: 3,
        label: 'UDP'
    },{
        value: 4,
        label: '组播'
    },{
        value: 5,
        label: 'TCP Server'
    }, ];
    $scope.deviceTypeList = [{
        value: 1,
        label: '手术室终端'
    }, {
        value: 2,
        label: '复苏室终端'
    }, {
        value: 3,
        label: '心电监护仪'
    }, {
        value: 4,
        label: '呼吸机'
    }, {
        value: 5,
        label: '麻醉机'
    }, ];
    $scope.mustShowList = [{
        value: 1,
        label: '必须显示'
    }, {
        value: '',
        label: '非必须显示'
    }];
    $scope.ok = function() {
        IHttp.post('basedata/saveBasMonitorConfig', $scope.obj).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            $uibModalInstance.close();
        })
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
}
