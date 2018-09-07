InfoConsCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'toastr', 'auth', 'confirm', 'select'];

module.exports = InfoConsCtrl;

function InfoConsCtrl($rootScope, $scope, IHttp, toastr, auth, confirm, select) {
    var vm = this;
    $scope.setting = $rootScope.$state.current.data;
    let regOptId = $rootScope.$state.params.regOptId;
    $scope.$emit('readonly', $scope.setting);
    $scope.docInfo = auth.loginUser();
    $scope.saveActive = auth.getDocAuth();
    vm.accedeItem = { other: "" };
    // 
    select.sysCodeBy('anaes_assist_measure').then((rs) => {
        $scope.anaes_assist_measure = rs.data.resultList;
    })
    $scope.init = function() {
        IHttp.post('document/searchAccedeByRegOptId', { 'regOptId': regOptId }).then(function(rs) {
            if (rs.data.resultCode != 1)return;
            $scope.regOptItem = rs.data.regOptItem;
            vm.accedeItem = rs.data.accedeItem;
            if(!vm.accedeItem.selectedList.length)vm.accedeItem.selectedList = ['0', '0', '0', '0', '0', '0', '0', '0', '0', '1', '1', '1', '1', '1','0'];
            vm.accedeInformedList = rs.data.accedeInformedList;
            $scope.processState = vm.accedeItem.processState;
            $scope.$emit('processState', rs.data.accedeItem.processState);
        });
    }
    $scope.init();
    $scope.$watch('vm.accedeItem.selectedList[14]',function(n,o){
        if(!n)return;
        if(n!='1')vm.accedeItem.other='';
    })
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
                // confirm.show('提交的文书将归档，且不可编辑，是否继续提交？').then(function(data) {
                submit(processState);
                // });
            }
        } else {
            submit(processState);
        }
    }

    function submit(processState, action) {
        vm.accedeItem.processState = processState;
        if (vm.accedeItem.anaesMethodList.length == 0) {
            vm.accedeItem.anaesMethodList = [];
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
            $scope.init()
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