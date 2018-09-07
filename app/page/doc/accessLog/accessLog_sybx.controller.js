AccessLogCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'toastr', 'select', '$filter', 'confirm', '$timeout', 'dateFilter', 'auth'];

module.exports = AccessLogCtrl;

function AccessLogCtrl($rootScope, $scope, IHttp, toastr, select, $filter, confirm, $timeout, dateFilter, auth) {
    let vm = this;
    $scope.docInfo = auth.loginUser();
    let beCode = $scope.docInfo.beCode;

    $scope.setting = $rootScope.$state.current.data;
    $scope.$emit('readonly', $scope.setting);
    $scope.saveActive = false;
    if (($scope.docInfo.roleType == 'NURSE' && beCode == 'hbgzb') || $scope.docInfo.roleType == 'HEAD_NURSE' || $scope.docInfo.roleType == 'ANAES_DIRECTOR') {
        $scope.saveActive = true;
    }
    $timeout(function() {
        $scope.$watch('prePostVisit.preAnaesSign', function(n, o) {//1
            $scope.hasSig_1 = false;
            $scope.eSignatureAnesthetist_1 = [];
            angular.forEach($scope.anesthetistList, function(item) {
                if (item.userName == n) {
                    $scope.hasSig_1 = item.picPath ? true : false;
                    $scope.eSignatureAnesthetist_1.push({ hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime() });
                }
            })
        }, true)

        $scope.$watch('prePostVisit.preNurseSign', function(n, o) {//2
            $scope.hasSig_2 = false;
            $scope.eSignatureAnesthetist_2 = [];
            angular.forEach($scope.preVisitorItem, function(item) {
                if (item.userName == n) {
                    $scope.hasSig_2 = item.picPath ? true : false;
                    $scope.eSignatureAnesthetist_2.push({ hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime() });
                }
            })
        }, 1000);
        $scope.$watch('prePostVisit.postAnaesSign', function(n, o) {//3
            $scope.hasSig_3 = false;
            $scope.eSignatureAnesthetist_3 = [];
            angular.forEach($scope.anesthetistList, function(item) {
                if (item.userName == n) {
                    $scope.hasSig_3 = item.picPath ? true : false;
                    $scope.eSignatureAnesthetist_3.push({ hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime() });
                }
            })
        }, true)

        $scope.$watch('prePostVisit.postNurseSign', function(n, o) {//4
            $scope.hasSig_4 = false;
            $scope.eSignatureAnesthetist_4 = [];
            angular.forEach($scope.preVisitorItem, function(item) {
                if (item.userName == n) {
                    $scope.hasSig_4 = item.picPath ? true : false;
                    $scope.eSignatureAnesthetist_4.push({ hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime() });
                }
            })
        }, 1000);
    }, 1000);

    function init(isDialogBack) {
        IHttp.post("document/searchPrePostVisit", { regOptId: $rootScope.$stateParams.regOptId }).then(function(rr) {
            rs = rr.data;
            if (rs.resultCode === '1') {
                if (isDialogBack) {
                    $scope.prePostVisitItemList = rs.prePostVisitItemList;
                } else {
                    $scope.bloodTypeList = rs.bloodTypeList;

                    $scope.prePostVisit = rs.prePostVisit;

                    //初始化时发送文书状态
                    $scope.processState = $scope.prePostVisit.processState;
                    $scope.$emit('processState', $scope.prePostVisit.processState);

                    if (!!$scope.prePostVisit.preVisitTime) {
                        if (beCode !== 'sybx') {
                            $scope.prePostVisit.preVisitTime = dateFilter(new Date($scope.prePostVisit.preVisitTime), 'yyyy-MM-dd');
                        } else {
                            $scope.prePostVisit.preVisitTime = dateFilter(new Date($scope.prePostVisit.preVisitTime), 'yyyy-MM-dd HH:mm');
                        }
                    }
                    if (!!$scope.prePostVisit.postVisitTime) {
                        if (beCode !== 'sybx') {
                            $scope.prePostVisit.postVisitTime = dateFilter(new Date($scope.prePostVisit.postVisitTime), 'yyyy-MM-dd');
                        } else {
                            $scope.prePostVisit.postVisitTime = dateFilter(new Date($scope.prePostVisit.postVisitTime), 'yyyy-MM-dd HH:mm');
                        }
                    }
                    $scope.searchRegOptByIdFormBean = rs.searchRegOptByIdFormBean;
                    $scope.prePostVisit.blood = $scope.prePostVisit.blood.toString();
                    if (beCode !== 'sybx') {
                        $scope.prePostVisit.briefHis_ = $scope.prePostVisit.briefHis ? JSON.parse($scope.prePostVisit.briefHis) : {};
                    }
                    $scope.prePostVisit.nurseProblem_ = $scope.prePostVisit.nurseProblem ? JSON.parse($scope.prePostVisit.nurseProblem) : {};
                    $scope.prePostVisit.psychological_ = $scope.prePostVisit.psychological ? JSON.parse($scope.prePostVisit.psychological) : {};
                    $scope.prePostVisitItemList = rs.prePostVisitItemList;
                }
            } else {
                toastr.error(rs.resultMessage);
            }
        });
    }

    init();

    select.getNurses().then((rs) => {
        $scope.preVisitorItem = rs.data.userItem;
    });

    select.getAnaesthetists().then((rs) => {
        $scope.anesthetistList = rs.data.userItem;
    });

    select.getOperators().then((rs) => {
        if (rs.length <= 0)
            return;
        $scope.operaList = rs;
    });

    $scope.clearOther = function(other) {
        eval('$scope.' + other + '=""');
    }

    function save(processState, type) {
        $scope.verify = processState == 'END';
        let content = '';
        if (processState === 'END' && (!$scope.prePostVisit.postVisitTime || !$scope.prePostVisit.preVisitTime)) {
            toastr.warning('请输入必填项信息');
            return;
        }
        if ($scope.prePostVisit.processState === 'END' && processState === 'END') {
            $scope.$emit('doc-print');
            return;
        }
        if (processState === 'END' && type !== 'print') {
            content = '提交的文书将归档，并且不可编辑，是否继续提交？';
            confirm.show(content).then(function(data) {
                submit(processState, type);
            });
        } else if (processState === 'END' && type === 'print') {
            if ($scope.prePostVisit.processState === 'END') {
                $scope.$emit('doc-print');
            } else {
                content = '打印的文书将归档，且不可编辑，是否继续打印？';
                confirm.show(content).then(function(data) {
                    submit(processState, type);
                });
            }
        } else {
            submit(processState);
        }
    }

    function submit(processState, state) {
        $rootScope.btnActive = false;
        $scope.prePostVisit.nurseProblem = JSON.stringify($scope.prePostVisit.nurseProblem_);
        $scope.prePostVisit.psychological = JSON.stringify($scope.prePostVisit.psychological_);
        $scope.prePostVisit.processState = processState === 'PRINT' ? 'END' : processState;
        let prePostVisit1 = angular.copy($scope.prePostVisit);
        if (beCode !== 'sybx') {
            prePostVisit1.briefHis = JSON.stringify($scope.prePostVisit.briefHis_);
        }
        if (beCode === 'sybx') {
            prePostVisit1.preVisitTime = new Date($filter('date')(new Date($scope.prePostVisit.preVisitTime), 'yyyy-MM-dd HH:mm')).getTime();
            prePostVisit1.postVisitTime = new Date($filter('date')(new Date($scope.prePostVisit.postVisitTime), 'yyyy-MM-dd HH:mm')).getTime();
        }
        IHttp.post("document/updatePrePostVisit", prePostVisit1).then(function(rr) {
            $rootScope.btnActive = true;
            rs = rr.data;
            if (rs.resultCode === '1') {
                toastr.success(rs.resultMessage);
                //操作完成后发送文书状态
                $scope.processState = $scope.prePostVisit.processState;
                if (state === 'print') {
                    $scope.$emit('end-print');
                } else {
                    $scope.$emit('processState', $scope.prePostVisit.processState);
                }
            } else {
                toastr.error(rs.resultMessage);
                $scope.prePostVisit.processState = 'NO_END';
            }
        });
    }

    $scope.$on('save', () => {
        if ($scope.saveActive && $scope.processState == 'END')
            submit('END');
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