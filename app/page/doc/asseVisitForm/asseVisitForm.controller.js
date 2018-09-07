AsseVisitFormCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$timeout', '$state', 'toastr', 'confirm', 'auth', 'select'];

module.exports = AsseVisitFormCtrl;

function AsseVisitFormCtrl($rootScope, $scope, IHttp, $timeout, $state, toastr, confirm, auth, select) {
    let vm = this,
        regOptId = $rootScope.$state.params.regOptId;
    vm.docInfo = auth.loginUser();
    vm.saveActive = auth.getDocAuth();

    select.sysCodeBy('awareness').then((rs) => {
        vm.awarenessList = rs.data.resultList;
    })

    IHttp.post('document/searchPatPrevisitRecordByRegOptId', { 'regOptId': regOptId }).then(function(rs) {
        if (rs.data.resultCode != 1)
            return;
        vm.record = rs.data.docPatPrevisitRecord;
        vm.record.skinOther = vm.record.skinOther.split(',');
        vm.record.preVisitOther = vm.record.preVisitOther.split(',');
        vm.regOpt = rs.data.searchRegOptByIdFormBean;
        $scope.$emit('processState', vm.record.processState);
    });

    function save(processState, type) {
        vm.verify = processState == 'END';
        let content = '';
        if (processState === 'END') {
            if (type === 'print') {
                if (vm.record.processState === 'END') {
                    $scope.$emit('doc-print');
                } else {
                    content = '打印的文书将归档，且不可编辑。是否继续打印？';
                    confirm.show(content).then(function(data) {
                        submit(processState, type);
                    });
                }
            } else {
                content = '提交的文书将归档，并且不可编辑。是否继续提交？';
                confirm.show(content).then(function(data) {
                    submit(processState);
                });
            }
        } else {
            submit(processState);
        }
    }

    function submit(processState, type) {
        var record = angular.copy(vm.record);
        record.processState = processState;
        record.skinOther = record.skinOther.join(',');
        record.preVisitOther = record.preVisitOther.join(',');
        IHttp.post('document/updateDocPatPrevisitRecord', record).then(function(rs) { debugger;
            if (rs.data.resultCode === "1") {
                vm.record.processState = processState;
                toastr.success(rs.data.resultMessage);
                if (type === 'print') {
                    $scope.$emit('end-print');
                } else {
                    $scope.$emit('processState', vm.record.processState);
                }
            }
        });
    }

    $scope.$on('save', () => {
        save('NO_END');
    });

    $scope.$on('print', () => {
        save('END', 'print');
    });

    $scope.$on('submit', () => {
        save('END');
    })
}
