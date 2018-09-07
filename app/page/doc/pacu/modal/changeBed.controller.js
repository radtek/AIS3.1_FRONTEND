againStartOperCtrl.$inject = ['$rootScope', '$scope', 'toastr', '$uibModalInstance', 'select', 'anesRecordInter', 'IHttp', 'confirm'];

module.exports = againStartOperCtrl;

function againStartOperCtrl($rootScope, $scope, toastr, $uibModalInstance, select, anesRecordInter, IHttp, confirm) {
    var vm = this,
        obj,
        newObj;

    initBed();

    vm.ok = function() {
        if (!vm.curBedId) {
            toastr.warning('请先选择床位')
            return;
        }

        if (vm.beds.indexOf(vm.curBedId) > -1) {
            confirm.show('该床位已有患者，您是否要继续进行换床!').then(res => {
                IHttp.post('document/changeBedByPacuRec', {
                    sourceBed: obj.bedId,
                    sourceRegOptId: obj.regOptId,
                    targetBed: vm.curBedId
                }).then(rs => {
                    if (rs.data.resultCode != '1') return;
                    $uibModalInstance.close(vm.curBedId);
                });
            });
        } else {
            IHttp.post('document/changeBedByPacuRec', {
                sourceBed: obj.bedId,
                sourceRegOptId: obj.regOptId,
                targetBed: vm.curBedId
            }).then(rs => {
                if (rs.data.resultCode != '1') return;
                $uibModalInstance.close(vm.curBedId);
            });
        }
    };

    vm.cancel = function() {
        $uibModalInstance.dismiss();
    };

    function initBed() {
        vm.beds = "";
        IHttp.post('document/getAnaesPacuRecCard', {}).then(function(rs) {
            if (rs.status === 200 && rs.data.resultCode === '1') {
                vm.cardItems = rs.data.anaesPacuRecCard;
                vm.cardItems.forEach(item => {
                    if (item.regOptId == $scope.regOptId)
                        obj = item;
                    if (item.id) {
                        vm.beds += item.bedId + '、';
                    }
                })
            }
        });
    }
}