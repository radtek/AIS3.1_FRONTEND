anaesMedicineCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$window', '$timeout', '$state', '$q', 'toastr', 'confirm', 'auth', '$filter', 'dateFilter', 'select'];

module.exports = anaesMedicineCtrl;

function anaesMedicineCtrl($rootScope, $scope, IHttp, $window, $timeout, $state, $q, toastr, confirm, auth, $filter, dateFilter, select) {
    var vm = this;
    let regOptId = $rootScope.$stateParams.regOptId;
    $scope.setting = $rootScope.$state.current.data;
    $scope.docInfo = auth.loginUser();

    $scope.$emit('readonly', $scope.setting);
    $scope.saveActive = auth.getDocAuth();

    select.getAnaesthetists().then(function(rs) {
        if (rs.data.resultCode != 1)
            return;
        $scope.anesthetistList = rs.data.userItem;
    });

    $timeout(function() {
        $scope.$watch('vm.anaesMedicineAccede.anaestheitistId', function(n, o) {
            $scope.eSignatureAnaestheitist = [];
            angular.forEach($scope.anesthetistList, function(item) {
                if (item.userName == n) {
                    $scope.eSignatureAnaestheitist.push(item.picPath + '?t=' + new Date().getTime());
                }
            })
        }, true)
    }, 1000);

    var params = {
        analgesicRecord: {},
        analgesicPostFlup: [],
        analgesicRecipe: []
    }
    IHttp.post('document/searchAnaesMedicineAccede', { 'regOptId': regOptId }).then(function(rs) {
        if (rs.data.resultCode !== '1') return;
        vm.regOpt = rs.data.regOptItem;
        vm.anaesMedicineAccede = rs.data.anaesMedicineAccede;
        //初始化时发送文书状态
        $scope.processState = vm.anaesMedicineAccede.processState;
        $scope.$emit('processState', vm.anaesMedicineAccede.processState);
    });

    function submit(processState, state) {
        var params = angular.copy(vm.anaesMedicineAccede);
        params.processState = processState;
        IHttp.post('document/updateAnaesMedicineAccede', params).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            toastr.success(rs.data.resultMessage);
            vm.anaesMedicineAccede.processState = processState;
            $scope.processState = processState;
            if(state == 'print')
                $scope.$emit('end-print');
            else
                $scope.$emit('processState', processState);
        });
    }

    function save(type, state) {
        $scope.verify = type == 'END';
        if (type == 'END') {
            if (!vm.anaesMedicineAccede.anaestheitistId) {
                toastr.warning('请输入必填项信息');
                return;
            }
            if(state == 'print') {
                if(vm.anaesMedicineAccede.processState == 'END')
                    $scope.$emit('doc-print');
                else
                    confirm.show('打印的文书将归档，且不可编辑。是否继续打印？').then(function(data) { submit(type, state); });
            } else {
                if(vm.anaesMedicineAccede.processState == 'END')
                    submit(type);
                else
                    confirm.show('提交的文书将归档，并且不可编辑。是否继续提交？').then(function(data) { submit(type); });
            }
        } else
            submit(type);
        // if (vm.anaesMedicineAccede.processState == 'END' && type === 'END') {
        //     $scope.$emit('doc-print');
        //     return;
        // }
        // let content = '';
        // if (type === 'END' && state !== 'print') {
        //     content = '提交的文书将归档，并且不可编辑，是否继续提交？';
        //     confirm.show(content).then(function(data) {
        //         submit(type, state);
        //     });
        // } else if (type === 'END' && state === 'print') {
        //     if (vm.anaesMedicineAccede.processState === 'END') {
        //         $scope.$emit('doc-print');
        //     } else {
        //         content = '打印的文书将归档，且不可编辑，是否继续打印？';
        //         confirm.show(content).then(function(data) {
        //             submit(type, state);
        //         });
        //     }
        // } else {
        //     submit(type);
        // }
    }

    $scope.$on('save', () => {
        if ($scope.saveActive && $scope.processState == 'END')
            save('END');
        else
            save('NO_END');
    });

    $scope.$on('print', () => {
        save('END', 'print');
    });

    $scope.$on('submit', () => {
        save('END');
    })
}