SafetyVerifLogCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'select', 'toastr', 'auth', '$timeout', 'confirm'];

module.exports = SafetyVerifLogCtrl;

function SafetyVerifLogCtrl($rootScope, $scope, IHttp, select, toastr, auth, $timeout, confirm) {
    var vm = this;
    var regOptId = $rootScope.$stateParams.regOptId;
    var crumbsLen = $rootScope.crumbs.length;
    $scope.setting = $rootScope.$state.current.data;
    $scope.$emit('readonly', $scope.setting);
    $scope.docInfo = auth.loginUser();

    $scope.docUrl = auth.loginUser().titlePath;
    $scope.saveActive = auth.getDocAuth();

    var beCode = $scope.docInfo.beCode;
    if ($rootScope.crumbs[crumbsLen - 1])
        $scope.docInfo.docName = $rootScope.crumbs[crumbsLen - 1].name;

    // 麻醉医师
    select.getAnaesthetists().then(function(rs) {
        if (rs.data.resultCode != 1)
            return;
        $scope.anesthetistList = rs.data.userItem;
    });

    // 手术医师
    select.getOperators().then(function(rs) {
        if (rs.length <= 0)
            return;
        $scope.operatorList = rs;
    });

    // 巡回护士
    select.getNurses().then(function(rs) {
        if (rs.data.resultCode != 1)
            return;
        $scope.circunurseList = rs.data.userItem;
    });

    function initData() {
        IHttp.post('document/searchSafeCheckByRegOptId', { regOptId: regOptId }).then(function(rs) {
            if (rs.data.resultCode != 1)
                return;
            $scope.safeCheck = rs.data.safeCheck;
            // 基本信息
            $scope.regOpt = rs.data.regOptItem;
            
            $scope.baseData = rs.data.safeCheckFormBean;
            $scope.anaesDoc = rs.data.anaesDoc;
            var symbol = '';
            if (rs.data.circunurse && rs.data.instrnurse) symbol = ',';
            $scope.circunurse = rs.data.circunurse + symbol + rs.data.instrnurse;
            $scope.operatDoc = rs.data.operatDoc;
            // 麻醉实施前
            $timeout(function (){
                $scope.anaesBeforeSafeCheck = rs.data.anaesBeforeSafeCheck;
                // 手术开始前
                $scope.operBeforeSafeCheck = rs.data.operBeforeSafeCheck;
                // 出手术室
                $scope.exitOperSafeCheck = rs.data.exitOperSafeCheck;
            }, 200);

            $scope.processState = rs.data.safeCheck.processState;
        });
    }
    initData();

    $timeout(function (){
        $scope.$watch('anaesBeforeSafeCheck.anesthetistIdList', function(signName, o) {
            $scope.hasAnaesSig1 = false;
            $scope.eSignatureAnanesthetist1 = [];
            angular.forEach($scope.anesthetistList, function(item) {
                for (var sign of signName) {
                    if (item.userName == sign) {
                        if (!$scope.hasAnaesSig1)
                            $scope.hasAnaesSig1 = item.picPath ? true : false;
                        $scope.eSignatureAnanesthetist1.push({hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime()});
                    }
                }
            })
        }, true);
        $scope.$watch('operBeforeSafeCheck.anesthetistIdList', function(signName, o) {
            $scope.hasAnaesSig2 = false;
            $scope.eSignatureAnanesthetist2 = [];
            angular.forEach($scope.anesthetistList, function(item) {
                for (var sign of signName) {
                    if (item.userName == sign) {
                        if (!$scope.hasAnaesSig2)
                            $scope.hasAnaesSig2 = item.picPath ? true : false;
                        $scope.eSignatureAnanesthetist2.push({hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime()});
                    }
                }
            })
        }, true);
        $scope.$watch('exitOperSafeCheck.anesthetistIdList', function(signName, o) {
            $scope.hasAnaesSig3 = false;
            $scope.eSignatureAnanesthetist3 = [];
            angular.forEach($scope.anesthetistList, function(item) {
                for (var sign of signName) {
                    if (item.userName == sign) {
                        if (!$scope.hasAnaesSig3)
                            $scope.hasAnaesSig3 = item.picPath ? true : false;
                        $scope.eSignatureAnanesthetist3.push({hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime()});
                    }
                }
            })
        }, true);
        $scope.$watch('anaesBeforeSafeCheck.circunurseIdList', function(signName, o) {
            $scope.hasNurseSig1 = false;
            $scope.eSignatureCircuNurse1 = [];
            angular.forEach($scope.circunurseList, function(item) {
                for (var sign of signName) {
                    if (item.userName == sign) {
                        if (!$scope.hasNurseSig1)
                            $scope.hasNurseSig1 = item.picPath ? true : false;
                        $scope.eSignatureCircuNurse1.push({hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime()});
                    }
                }
            })
        }, true);
        $scope.$watch('operBeforeSafeCheck.circunurseIdList', function(signName, o) {
            $scope.hasNurseSig2 = false;
            $scope.eSignatureCircuNurse2 = [];
            angular.forEach($scope.circunurseList, function(item) {
                for (var sign of signName) {
                    if (item.userName == sign) {
                        if (!$scope.hasNurseSig2)
                            $scope.hasNurseSig2 = item.picPath ? true : false;
                        $scope.eSignatureCircuNurse2.push({hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime()});
                    }
                }
            })
        }, true);
        $scope.$watch('exitOperSafeCheck.circunurseIdList', function(signName, o) {
            $scope.hasNurseSig3 = false;
            $scope.eSignatureCircuNurse3 = [];
            angular.forEach($scope.circunurseList, function(item) {
                for (var sign of signName) {
                    if (item.userName == sign) {
                        if (!$scope.hasNurseSig3)
                            $scope.hasNurseSig3 = item.picPath ? true : false;
                        $scope.eSignatureCircuNurse3.push({hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime()});
                    }
                }
            })
        }, true);
        // $scope.$watch('anaesBeforeSafeCheck.operatorIdList', function(signName, o) {
        //     $scope.eSignatureOperator1 = [];
        //         angular.forEach($scope.operatorList, function(item) {
        //             if (item.operatorId == signName) {
        //                 $scope.eSignatureOperator1.push(item.picPath + '?t=' + new Date().getTime());
        //             }
        //         })
        // }, true);
        // $scope.$watch('operBeforeSafeCheck.operatorIdList', function(signName, o) {
        //     $scope.eSignatureOperator2 = [];
        //         angular.forEach($scope.operatorList, function(item) {
        //             if (item.operatorId == signName) {
        //                 $scope.eSignatureOperator2.push(item.picPath + '?t=' + new Date().getTime());
        //             }
        //         })
        // }, true);
        // $scope.$watch('exitOperSafeCheck.operatorIdList', function(signName, o) {
        //     $scope.eSignatureOperator3 = [];
        //         angular.forEach($scope.operatorList, function(item) {
        //             if (item.operatorId == signName) {
        //                 $scope.eSignatureOperator3.push(item.picPath + '?t=' + new Date().getTime());
        //             }
        //         })
        // }, true);
        $scope.$watch('safeCheck.circunurseIdList', function(signName, o) {
            $scope.hasNurseSig = false;
            $scope.eSignatureCircuNurse = [];
            angular.forEach($scope.circunurseList, function(item) {
                for (var sign of signName) {
                    if (item.userName == sign) {
                        if (!$scope.hasNurseSig)
                            $scope.hasNurseSig = item.picPath ? true : false;
                        $scope.eSignatureCircuNurse.push({hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime()});
                    }
                }
            })
        }, true);
    }, 1000)

    function save(processState, state) {
        $scope.verify = processState == 'END';
        if (processState == 'END') {
            if (state == 'print') {
                if ($scope.safeCheck.processState == 'END')
                    $scope.$emit('doc-print');
                else
                    confirm.show('打印的文书将归档，且不可编辑。是否继续打印？').then(function(data) { submit(processState, state); });
            } else {
                if ($scope.safeCheck.processState == 'END')
                    submit(processState);
                else
                    confirm.show('提交的文书将归档，并且不可编辑。是否继续提交？').then(function(data) { submit(processState); });
            }
        } else
            submit(processState);
    }
    function submit(processState, type) {
        $scope.safeCheck.processState = processState;
        var circunurseId = '',
            circunurseIdArr = $scope.safeCheck.circunurseIdList;
        for(var i=0; i<circunurseIdArr.length; i++) {
            if (circunurseId === '')
                circunurseId = circunurseIdArr[i];
            else
                circunurseId += ',' + circunurseIdArr[i];
        }
        $scope.safeCheck.circunurseId = circunurseId;
        var params = {
            anaesBeforeSafeCheck: $scope.anaesBeforeSafeCheck,
            exitOperSafeCheck: $scope.exitOperSafeCheck,
            operBeforeSafeCheck: $scope.operBeforeSafeCheck,
            safeCheck:$scope.safeCheck

        }
        if (beCode === 'nhfe' || beCode === 'qnzzyyy') {
            var operatorList = [];
            var anesthetistList = [];
            var circunurseList = [];
            operatorList.push($scope.operBeforeSafeCheck.operatorId);
            anesthetistList.push($scope.operBeforeSafeCheck.anesthetistId);
            circunurseList.push($scope.operBeforeSafeCheck.circuNurseId);
            params.operBeforeSafeCheck.operatorList = operatorList;
            params.operBeforeSafeCheck.anesthetistList = anesthetistList;
            params.operBeforeSafeCheck.circunurseList = circunurseList;

        }
        IHttp.post('document/updateSafeCheck', params).then((rs) => {
            if (rs.data.resultCode != 1)
                return;
            toastr.success(rs.data.resultMessage);
            $scope.safeCheck.processState = processState
            $scope.processState = processState
            if (type === 'print') {
                $scope.$emit('end-print');
            } else {
                $scope.$emit('processState', $scope.processState);
            }
        });
    }
    $scope.$watch('processState', function(n) {
        if (n == undefined)
            return;
        $scope.$emit('processState', n);
    }, true);

    $scope.$on('save', function() {
       if ($scope.saveActive && $scope.processState == 'END')
            save('END');
        else
            save('NO_END');

    });

    $scope.$on('submit', function() {
        save('END');
    });

    $scope.$on('print', function() {
        save('END', 'print');
    });
}