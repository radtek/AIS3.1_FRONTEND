RiskAsseLogCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'select', 'toastr', 'confirm', '$window', 'auth', '$timeout'];

module.exports = RiskAsseLogCtrl;

function RiskAsseLogCtrl($rootScope, $scope, IHttp, select, toastr, confirm, $window, auth, $timeout) {
    let vm = this;
    $scope.setting = $rootScope.$state.current.data;
    $scope.$emit('readonly', $scope.setting);
    $scope.docInfo = auth.loginUser();
    $scope.docUrl = auth.loginUser().titlePath;
    let beCode = $scope.docInfo.beCode;

    select.getAnaesthetists().then((rs) => {
        if (rs.data.resultCode != 1)
            return;
        $scope.anaesthetistList = rs.data.userItem;
    });

    select.getOperators().then((rs) => {
        if (rs.length <= 0)
            return;
        $scope.operatorList = rs;
    })

    select.getNurses().then((rs) => {
        if (rs.data.resultCode != 1)
            return;
        $scope.nurseList = rs.data.userItem;
    })

    select.getAllUser().then((rs) => {
        if (rs.data.resultCode != 1)
            return;
        $scope.userList = rs.data.userItem;
    })

    $timeout(function() {
        $scope.$watch('vm.optRiskEva.anesthesName', function(n, o) {
            $scope.eSignatureAnesthetist = [];
            angular.forEach($scope.userList, function(item) {
                if (item.userName == n) {
                    $scope.eSignatureAnesthetist.push(item.picPath + '?t=' + new Date().getTime());
                }
            })
        }, true);
        $scope.$watch('vm.optRiskEva.tourNurseName', function(n, o) {
            $scope.eSignatureTourNurse = [];
            angular.forEach($scope.userList, function(item) {
                if (item.userName == n) {
                    $scope.eSignatureTourNurse.push(item.picPath + '?t=' + new Date().getTime());
                }
            })
        }, true);
        $scope.$watch('vm.optRiskEva.doctorName', function(n, o) {
            $scope.eSignatureDoctor = [];
            angular.forEach($scope.operatorList, function(item) {
                if (item.userName == n) {
                    $scope.eSignatureDoctor.push(item.picPath + '?t=' + new Date().getTime());
                }
            })
        }, true);
        $scope.$watch('vm.optRiskEva.anesthesName', function(n, o) {
            $scope.hasSig_1 = false;
            $scope.eSignatureAnesthetist_1 = [];
            angular.forEach($scope.anaesthetistList, function(item) {
                if (item.userName == n) {
                    $scope.hasSig_1 = item.picPath ? true : false;
                    $scope.eSignatureAnesthetist_1.push({ hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime() });
                }
            })
        }, true)
        $scope.$watch('vm.optRiskEva.tourNurseName', function(n, o) {
            $scope.hasSig_2 = false;
            $scope.eSignatureAnesthetist_2 = [];
            angular.forEach($scope.nurseList, function(item) {
                if (item.userName == n) {
                    $scope.hasSig_2 = item.picPath ? true : false;
                    $scope.eSignatureAnesthetist_2.push({ hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime() });
                }
            })
        }, true)
    }, 1000)

    function initPage(callback, type) {
        IHttp.post('document/searchOptRiskEvaluationByRegOptId', { regOptId: $rootScope.$stateParams.regOptId })
            .then((rs) => {
                vm.regOpt = rs.data.regOpt;
                vm.optRiskEva = rs.data.optRiskEvaluation;
                $scope.processState = vm.optRiskEva.processState;
                $scope.$emit('processState', vm.optRiskEva.processState);
                // 手术切口清洁程度
                $scope.$watch('vm.optRiskEva.incisionCleanliness', function(n, o) {
                    if (n === undefined) return;
                    computeTotal();
                });
                // 麻醉分级
                $scope.$watch('vm.optRiskEva.asa', function(n, o) {
                    if (n === undefined) return;
                    computeTotal();
                });
                // 手术持续时间
                $scope.$watch('vm.optRiskEva.durationSurgery', function(n, o) {
                    if (n === undefined) return;
                    computeTotal();
                });
            });
    }

    function computeTotal() {
        vm.incisionCleanlinessScore = 0;
        vm.asaScore = 0;
        vm.durationSurgeryScore = 0;
        if (vm.optRiskEva.incisionCleanliness == 3 || vm.optRiskEva.incisionCleanliness == 4)
            vm.incisionCleanlinessScore = 1;

        if (vm.optRiskEva.asa == 3 || vm.optRiskEva.asa == 4 || vm.optRiskEva.asa == 5 || vm.optRiskEva.asa == 6)
            vm.asaScore = 1;

        if (vm.optRiskEva.durationSurgery == 2) {
            vm.durationSurgeryScore = 1;
        }

        if (vm.optRiskEva.incisionCleanliness || vm.optRiskEva.asa || vm.optRiskEva.durationSurgery)
            vm.optRiskEva.nnis = vm.incisionCleanlinessScore + vm.asaScore + vm.durationSurgeryScore;
        else
            vm.optRiskEva.nnis = '';
        if (beCode === 'nhfe') {
            vm.optRiskEva.riskEvaluation = vm.optRiskEva.nnis;
            if (typeof(vm.optRiskEva.nnis) === 'number') {
                vm.optRiskEva.nnis += 1;
            }
        } else {
            if (typeof(vm.optRiskEva.nnis) === 'number')
                vm.optRiskEva.riskEvaluation = vm.optRiskEva.nnis + 1;
        }
    }

    // 提交
    function submit(procState, type) {
        vm.optRiskEva.processState = procState;
        IHttp.post('document/saveOptRiskEvaluation', vm.optRiskEva).then(function(res) {
            if (res.data.resultCode === '1') {
                toastr.success(res.data.resultMessage);
                $scope.processState = vm.optRiskEva.processState;
                if (type === 'print') {
                    $scope.$emit('end-print');
                } else {
                    $scope.$emit('processState', vm.optRiskEva.processState);
                }
            } else {
                toastr.error(res.data.resultMessage);
            }
        });
    }

    function save(processState, type) {
        $scope.verify = processState == 'END';

        if (processState === 'END' && beCode === 'nhfe' && (!vm.optRiskEva.incisionCleanliness || !vm.optRiskEva.doctorName || !vm.optRiskEva.asa || !vm.optRiskEva.anesthesName || !vm.optRiskEva.durationSurgery || !vm.optRiskEva.tourNurseName)) {
            toastr.warning('请输入必填项信息');
            return;
        }
        if (processState === 'END' && beCode !== 'sybx' && (!vm.optRiskEva.incisionCleanliness || !vm.optRiskEva.doctorName || !vm.optRiskEva.asa || !vm.optRiskEva.anesthesName || !vm.optRiskEva.durationSurgery)) {
            toastr.warning('请输入必填项信息');
            return;
        }
        if (processState === 'END' && beCode === 'sybx' && (!vm.optRiskEva.doctorName || !vm.optRiskEva.anesthesName || !vm.optRiskEva.tourNurseName)) {
            toastr.warning('请输入必填项信息');
            return;
        }
        if (vm.optRiskEva.processState === 'END' && processState === 'END') {
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
            if (vm.optRiskEva.processState === 'END') {
                $scope.$emit('doc-print');
            } else {
                content = '打印的文书将归档，且不可编辑，是否继续打印？';
                confirm.show(content).then(function(data) {
                    submit(processState, type);
                });
            }
        } else {
            submit();
        }
    }

    initPage();

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