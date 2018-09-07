hospitaldialogCtrl.$inject = ['$rootScope', '$scope', '$filter', '$uibModal', '$uibModalInstance', '$timeout', 'IHttp', 'toastr'];

module.exports = hospitaldialogCtrl;

function hospitaldialogCtrl($rootScope, $scope, $filter, $uibModal, $uibModalInstance, $timeout, IHttp, toastr) {
    var vm = this;
    var promise;
    // 获取系统时间
    vm.date = $filter('date')(new Date(), 'yyyy/MM/dd HH:mm:ss');
    if ($scope.item != undefined) {
        vm.title = "编辑设备信息";
        vm.bus = $scope.item;

    } else {
        vm.title = "添加设备信息";
    }
    $scope.interfaceTypeList =[{
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

    vm.save = function(type) {
        if (promise) {
            $timeout.cancel(promise);
        }
        var url = "basedata/saveDeviceSpecification";
        promise = $timeout(function() {
            if(!vm.bus.beid){
                vm.bus.beid='';
            }
            IHttp.post(url, vm.bus)
                .then(
                    function(rs) {
                        var data = rs.data;
                        if (data.resultCode === "1") {
                            $uibModalInstance.close();
                        }
                    }
                );
        }, 500);
    }

    vm.close = function() {
        $uibModalInstance.dismiss('cancel');
    }

}
