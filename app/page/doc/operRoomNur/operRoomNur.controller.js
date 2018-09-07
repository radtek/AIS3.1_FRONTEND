OperRoomNurCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'select', 'toastr', '$timeout', '$filter', 'dateFilter', 'auth', 'confirm'];

module.exports = OperRoomNurCtrl;

function OperRoomNurCtrl($rootScope, $scope, IHttp, select, toastr, $timeout, $filter, dateFilter, auth, confirm) {
    let vm = this;
    var regOptId = $rootScope.$stateParams.regOptId;
    $scope.setting = $rootScope.$state.current.data;
    $scope.$emit('readonly', $scope.setting);
    $scope.docInfo = auth.loginUser();
    $scope.saveActive = auth.getDocAuth();
    var beCode = $scope.docInfo.beCode;

    IHttp.post('document/searchNurseInterviewRecord', { regOptId: regOptId }).then(function(rs) {
        if (rs.data.resultCode != 1)
            return;
        vm.regOptItem = rs.data.regOptItem;
        vm.bean = rs.data.bean;
        if (angular.isObject(vm.bean)) {
            vm.bean.medicalRecord = vm.bean.medicalRecord ? JSON.parse(vm.bean.medicalRecord) : {};
            vm.bean.conditionIntroduce = vm.bean.conditionIntroduce ? JSON.parse(vm.bean.conditionIntroduce) : {};
            vm.bean.prePrepareCase = vm.bean.prePrepareCase ? JSON.parse(vm.bean.prePrepareCase) : {};
            vm.bean.preOperExplain = vm.bean.preOperExplain ? JSON.parse(vm.bean.preOperExplain) : {};
            vm.bean.operPressureSore = vm.bean.operPressureSore ? JSON.parse(vm.bean.operPressureSore) : {};
            vm.bean.preventPressureMeasure = vm.bean.preventPressureMeasure ? JSON.parse(vm.bean.preventPressureMeasure) : {};
            if (vm.bean.interviewTime) {
                vm.bean.interviewTime = dateFilter(new Date(vm.bean.interviewTime), 'yyyy-MM-dd HH:mm');
            }
            $scope.processState = vm.bean.processState;
            $scope.$emit('processState', $scope.processState);
        }
    });

    // 巡回护士
    select.getNurses().then(function(rs) {
        if (rs.data.resultCode != 1)
            return;
        $scope.circunurseList = rs.data.userItem;
    });

    $timeout(function (){
        $scope.$watch('vm.bean.interviewUser', function(n, o) {
            $scope.hasSig = false;
            $scope.eSignatureCircuNurse = [];
            angular.forEach($scope.circunurseList, function(item) {
                if (item.userName == n) {
                    $scope.hasSig = item.picPath ? true : false;
                    $scope.eSignatureCircuNurse.push({hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime()});
                }
            })
        }, true)
    }, 1000);

    function save(processState, type) {
        $scope.verify = processState == 'END';
        if (processState === 'END' && (!vm.bean.interviewUser || !vm.bean.interviewTime)) {
            toastr.warning('请输入必填项信息');
            return;
        }
        if (vm.bean.processState === 'END' && processState === 'END') {
            $scope.$emit('doc-print');
            return;
        }
        let content = '';
        if (processState === 'END' && type !== 'print') {
            content = '提交的文书将归档，并且不可编辑，是否继续提交？';
            confirm.show(content).then(function(data) {
                submit(processState, type);
            });
        } else if (processState === 'END' && type === 'print') {
            if(vm.bean.processState === 'END') {
                $scope.$emit('doc-print');
            }else {
                content = '打印的文书将归档，且不可编辑，是否继续打印？';
                confirm.show(content).then(function(data) {
                    submit(processState, type);
                });
            }
        } else {
            submit();
        }
    }

    function submit(processState, type) {
        vm.bean.processState = processState;
        let saveParams = angular.copy(vm.bean);
        saveParams.interviewTime = new Date($filter('date')(new Date(vm.bean.interviewTime), 'yyyy-MM-dd HH:mm')).getTime();
        IHttp.post('document/updateNurseInterviewRecord', saveParams).then((rs) => {
            if(rs.data.resultCode != 1)
                return;
            toastr.success(rs.data.resultMessage);
            $scope.processState = (processState==='END')?'END':processState;
            if (type === 'print') {
                $scope.$emit('end-print');
            } else {
                $scope.$emit('processState', vm.bean.processState);
            }
        });
    }

    $scope.$on('save', function() {
        save('NO_END');
    });

    $scope.$on('submit', function() {
        save('END');
    });

    $scope.$on('print', function() {
        save('END', 'print');
    });
}
