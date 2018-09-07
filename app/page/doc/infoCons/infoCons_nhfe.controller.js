InfoConsCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'toastr', 'auth', 'confirm'];

module.exports = InfoConsCtrl;

function InfoConsCtrl($rootScope, $scope, IHttp, toastr, auth, confirm) {
    var vm = this;
    $scope.setting = $rootScope.$state.current.data;
    let regOptId = $rootScope.$state.params.regOptId;
    $scope.$emit('readonly', $scope.setting);
    $scope.docInfo = auth.loginUser();
    $scope.saveActive = auth.getDocAuth();
    vm.accedeItem={other:""};

    IHttp.post('document/searchAccedeByRegOptId', { 'regOptId': regOptId }).then(function(rs) {
        if (rs.data.resultCode != 1)
            return;
        $scope.regOptItem = rs.data.regOptItem;
        vm.accedeItem = rs.data.accedeItem;        
        vm.accedeInformedList=rs.data.accedeInformedList;
        $scope.processState = vm.accedeItem.processState;
        $scope.$emit('processState', rs.data.accedeItem.processState);
    });

    function save(processState, action) {
        if (processState == 'END') {
            if (action == 'print') {
                if (vm.accedeItem.processState == 'END') {
                    $scope.$emit('doc-print');
                    return;
                } else {
                    confirm.show('打印的文书将归档，且不可编辑，是否继续打印？').then(function(data) {
                        submit(processState, action);
                    });
                }
            } else {
                confirm.show('提交的文书将归档，且不可编辑，是否继续提交？').then(function(data) {
                    submit(processState);
                });
            }
        }else {            
            submit(processState);
        }
    }

    function submit(processState, action) {
        vm.accedeItem.processState = processState;
        if (vm.accedeItem.anaesMethodList.length == 0) {
            vm.accedeItem.anaesMethodList = [];
        }
        if (vm.accedeItem.anaesAssistMeasureList.length == 0) {
            vm.accedeItem.anaesAssistMeasureList = [];
        }
        var params = {
            accedeInformedList: vm.accedeInformedList,
            accede: vm.accedeItem
        };
        IHttp.post('document/updateAccede', params).then(function(rs) {
            if (rs.data.resultCode != 1)
                return;
            vm.accedeItem.processState = processState;
            toastr.success(rs.data.resultMessage);
            $scope.processState = processState;
            if (action == 'print') {
                $scope.$emit('end-print');
            } else {
                $scope.$emit('processState', vm.accedeItem.processState);
            }
        });
    }

    $scope.$on('print', () => {
        save('END', 'print');
    });

    $scope.$on('submit', () => {
        save('END');
    })

    $scope.$on('save', () => {
        if ($scope.processState == 'END')
            save('END');
        else
            save('NO_END');
    });
}