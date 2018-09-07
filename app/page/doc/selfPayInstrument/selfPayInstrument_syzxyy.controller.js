SelfPayInstrumentCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$window', '$timeout', '$state', '$q', 'toastr', 'confirm', 'auth', '$filter', 'dateFilter', 'select'];

module.exports = SelfPayInstrumentCtrl;

function SelfPayInstrumentCtrl($rootScope, $scope, IHttp, $window, $timeout, $state, $q, toastr, confirm, auth, $filter, dateFilter, select) {
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

    // 巡回护士
    select.getNurses().then(function(rs) {
        if (rs.data.resultCode != 1)
            return;
        $scope.nurseList = rs.data.userItem;
    });
    $timeout(function() {
        $scope.$watch('vm.selfPayInstrumentAccede.anaestheitistId', function(n, o) {
            $scope.hasSig1 = false;
            $scope.eSignatureAnaestheitist = [];
            angular.forEach($scope.anesthetistList, function(item) {
                if (item.userName == n) {
                    $scope.hasSig1 = item.picPath ? true : false;
                    $scope.eSignatureAnaestheitist.push({hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime()});
                }
            })
        }, true)
        $scope.$watch('vm.selfPayInstrumentAccede.nurseId', function(n, o) {
            $scope.hasSig2 = false;
            $scope.eSignatureNurse = [];
            angular.forEach($scope.nurseList, function(item) {
                if (item.userName == n) {
                    $scope.hasSig2 = item.picPath ? true : false;
                    $scope.eSignatureNurse.push({hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime()});
                }
            })
        }, true)
    }, 1000);

    var selectedLength = 0;
    IHttp.post('document/searchSelfPayInstrumentAccede', { 'regOptId': regOptId }).then(function(rs) {
        if (rs.data.resultCode !== '1') return;
        vm.regOpt = rs.data.regOptItem;
        vm.selfPayInstrumentAccede = rs.data.selfPayInstrumentAccede;
        vm.selfPayInstrumentItems = rs.data.selfPayInstrumentItems;
        vm.selfPayLeft = [];
        vm.selfPayMid = [];
        vm.selfPayRight = [];
        for (var item of vm.selfPayInstrumentItems) {
            if (item.type == '1') {
                vm.selfPayLeft.push(item);
            } else if (item.type == '2') {
                vm.selfPayMid.push(item);
            } else if (item.type == '3') {
                vm.selfPayRight.push(item);
            }
        }
        //初始化时发送文书状态
        $scope.processState = vm.selfPayInstrumentAccede.processState;
        $scope.$emit('processState', $scope.processState);
    });

    function submit(processState, type) {
        var params = angular.copy(vm.selfPayInstrumentAccede);
        params.processState = processState;
        IHttp.post('document/updateSelfPayInstrumentAccede', params).then(function(rs) {
            if(rs.data.resultCode != 1) return;
            toastr.success(rs.data.resultMessage);
            vm.selfPayInstrumentAccede.processState = processState;
            $scope.processState = processState;
            if (type == 'print')
                $scope.$emit('end-print');
            else
                $scope.$emit('processState', processState);
        });
    }

    function save(processState, type) {
        $scope.verify = processState == 'END';
        if (processState == 'END') {
            if (!vm.selfPayInstrumentAccede.anaestheitistId) {
                toastr.warning('请输入必填项信息');
                return;
            }
            if (type == 'print') {
                if (vm.selfPayInstrumentAccede.processState == 'END')
                    $scope.$emit('doc-print');
                else
                    confirm.show('打印的文书将归档，且不可编辑。是否继续打印？').then(function(data) { submit(processState, type); });
            } else {
                if (vm.selfPayInstrumentAccede.processState == 'END')
                    submit(processState);
                else
                    confirm.show('提交的文书将归档，并且不可编辑。是否继续提交？').then(function(data) { submit(processState); });
            }
        } else
            submit(processState);
    }

    vm.saveItems = function(item) {
        let params = angular.copy(item);
        params.isSelect = params.isSelect ? 1 : 0;
        IHttp.post('document/updateSelfPayInstrumentItem', params).then(function(rs) {});
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