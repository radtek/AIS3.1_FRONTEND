againStartOperCtrl.$inject = ['$rootScope', '$scope', 'toastr', '$uibModalInstance', 'select', 'anesRecordInter'];

module.exports = againStartOperCtrl;

function againStartOperCtrl($rootScope, $scope, toastr, $uibModalInstance, select, anesRecordInter) {
    var vm = this;
    select.operroom().then(rs => {
        vm.operRooms = rs.data.resultList;
    })
    vm.ok = function() {
        if (!vm.curRoomId) {
            toastr.warning('请先选择手术室')
            return;
        }
        anesRecordInter.againStartOper($scope.regOptId || $scope.item.regOptId, vm.curRoomId).then(rs => {
            if (rs.data.resultCode != 1) return;
            $uibModalInstance.close();
        })
    };
    vm.cancel = function() {
        $uibModalInstance.dismiss();
    };
}