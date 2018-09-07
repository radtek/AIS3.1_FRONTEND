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

    $timeout(function() {
        $scope.$watch('vm.selfPayInstrumentAccede.anaestheitistId', function(n, o) {
            $scope.eSignatureAnaestheitist = [];
            angular.forEach($scope.anesthetistList, function(item) {
                if (item.userName == n) {
                    $scope.eSignatureAnaestheitist.push(item.picPath + '?t=' + new Date().getTime());
                }
            })
        }, true)
    }, 1000);

    vm.appendNo = function(index, item) {
        let noStr = '';
        angular.forEach(vm.selfPayLeft, function(item, no) {
            if (item.isSelect) {
                noStr += noStr !== '' ? ',' + (no + 1) : (no + 1);
            }
        });
        angular.forEach(vm.selfPayRight, function(item, no) {
            if (item.isSelect) {
                noStr += noStr !== '' ? ',' + (vm.selfPayLeft.length + no + 1) : (vm.selfPayLeft.length + no + 1);
            }
        });
        $('.appendNo').html(noStr);
        vm.selfPayInstrumentAccede.select = noStr;
    }

    var numArray = new Array();
    vm.initNum = function(index, item) {
        if (item.isSelect) {
            numArray.push(index);
        }
        var str = sortArray(numArray);
        vm.selfPayInstrumentAccede.select = str.join();
    }

    function sortArray(numArray1) {
        for (var i = 0; i < numArray1.length; i++) {
            for (var j = i + 1; j < numArray1.length; j++) {
                if (numArray1[i] > numArray1[j]) {
                    var tmp = numArray1[i];
                    numArray1[i] = numArray1[j];
                    numArray1[j] = tmp;
                }
            }
        }
        return numArray1;
    }

    var selectedLength = 0;
    IHttp.post('document/searchSelfPayInstrumentAccede', { 'regOptId': regOptId }).then(function(rs) {
        if (rs.data.resultCode !== '1') return;
        vm.regOpt = rs.data.regOptItem;
        vm.selfPayInstrumentAccede = rs.data.selfPayInstrumentAccede;
        vm.selfPayInstrumentItems = rs.data.selfPayInstrumentItems;
        vm.selfPayLeft = [];
        vm.selfPayRight = [];
        $('.appendNo').html(vm.selfPayInstrumentAccede.select);
        for (var item of vm.selfPayInstrumentItems) {
            item.isSelect = item.isSelect == 1 ? true : false;
            if (item.type == '1') {
                vm.selfPayLeft.push(item);
            } else if (item.type == '2') {
                vm.selfPayRight.push(item);
            }
            if (item.isSelect)
                selectedLength += 1;
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