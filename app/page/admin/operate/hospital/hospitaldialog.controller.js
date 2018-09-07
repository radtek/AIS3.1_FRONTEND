hospitaldialogCtrl.$inject = ['$rootScope', '$scope', '$filter', '$uibModal', '$uibModalInstance', '$timeout', 'IHttp', 'toastr'];

module.exports = hospitaldialogCtrl;

function hospitaldialogCtrl($rootScope, $scope, $filter, $uibModal, $uibModalInstance, $timeout, IHttp, toastr) {
    var vm = this;
    var promise;
    // 获取系统时间
    vm.date = $filter('date')(new Date(), 'yyyy/MM/dd HH:mm:ss');
    vm.flag = $scope.flag;
    if ($scope.item != undefined) {
        vm.title = "编辑局点信息";
        vm.bus = $scope.item;
        vm.bus.enable = "" + vm.bus.enable;
        vm.bus.beid = parseInt(vm.bus.beid);

    } else {
        vm.title = "添加局点信息";
    }

    vm.save = function(type) {
        if (promise) {
            $timeout.cancel(promise);
        }
        var url = "sys/updateBusEntity";
        if ($scope.item == undefined) {
            url = "sys/saveBusEntity";
        }
        promise = $timeout(function() {
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
