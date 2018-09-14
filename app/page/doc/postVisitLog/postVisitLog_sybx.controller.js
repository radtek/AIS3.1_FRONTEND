PostVisitLogCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$state', '$timeout', 'confirm', 'anesRecordServe', 'select', 'toastr', 'auth', '$filter'];

module.exports = PostVisitLogCtrl;

function PostVisitLogCtrl($rootScope, $scope, IHttp, $state, $timeout, confirm, anesRecordServe, select, toastr, auth, $filter) {
    var promise,
        regOptId = $rootScope.$stateParams.regOptId, timer_rt,
        rows = 3,
        rows1 = 3;
    $scope.docInfo = auth.loginUser();
    $scope.docUrl = auth.loginUser().titlePath;
    $scope.saveActive = false;
    $scope.setting = $rootScope.$state.current.data;
    $scope.$emit('readonly', $scope.setting);
    if ($scope.docInfo.roleType == 'HEAD_NURSE' || $scope.docInfo.roleType == 'ANAES_DIRECTOR' || $scope.docInfo.roleType == 'ANAES_DOCTOR' && $scope.beCode == 'hbgzb') {
        $scope.saveActive = true;
    }

    if ($scope.docInfo.beCode == 'qnzrmyy') {
        rows = 1;
        rows1 = 1;
    }

    var currRouteName = $rootScope.$state.current.name;
    $scope.$on('$stateChangeStart', function() {
        anesRecordServe.stopTimerRt();
    });

    //术中启动定时监测
    if (currRouteName == 'midPostVisitLog_sybx') {
        start_rt();

        function rtData() {
            anesRecordServe.rtData(regOptId, function(msg, list) {
                start_rt();
            });
        }

        function start_rt() {
            if (timer_rt)
                clearTimeout(timer_rt);
            timer_rt = setTimeout(rtData, 1000);
        }
    }
    $scope.lv = [{ key: 0, val: 0 }, { key: 1, val: 1 }, { key: 2, val: 2 }, { key: 3, val: 3 }, { key: 4, val: 4 }, { key: 5, val: 5 }, { key: 6, val: 6 }, { key: 7, val: 7 }, { key: 8, val: 8 }, { key: 9, val: 9 }, { key: 10, val: 10 }];

    select.getAnaesthetists().then((rs) => {
        $scope.anesthetistList = rs.data.userItem;
    });

    $timeout(function() {
        $scope.$watch('postFollowRecord.anesthetistId', function(n, o) {
            $scope.hasSig = false;
            $scope.eSignatureAnaestheitist = [];
            angular.forEach($scope.anesthetistList, function(item) {
                if (item.userName == n) {
                    $scope.hasSig = item.picPath ? true : false;
                    $scope.eSignatureAnaestheitist.push({ hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime() });
                }
            })
        }, true)
        $scope.$watch('postFollowRecord.postDoctorAdviceMap', function(n, o) {
            if (!n) return;
            if (n.a == 1 || n.b == 1 || n.c == 1) {
                $scope.postFollowRecord.postDoctorAdviceFlag = 0;
            } else {
                $scope.postFollowRecord.postDoctorAdviceFlag = 1;
                $scope.postFollowRecord.postDoctorAdviceOther = '';
            }

        }, true)
        $scope.$watch('postFollowRecord.cognitiveDisorders', function(n, o) {
            if (!n) return;
            if (n != 2) {
                $scope.postFollowRecord.cognitiveDisordersOther = '';
                $scope.postFollowRecord.cognitiveDisorders = 1;
            }
        }, true)
        $scope.$watch('postFollowRecord.intraoperAware', function(n, o) {
            if (!n) return;
            if (n != 2) {
                $scope.postFollowRecord.intraoperAwareOther = '';
                $scope.postFollowRecord.intraoperAware = 1;
            }
        }, true)
    }, 1000);

    // 查询
    IHttp.post('document/getPostFollowRecord', { regOptId: regOptId }).then(function(rs) {
        var rs = rs.data
        if (rs.resultCode != 1)
            return;
        $scope.rs = rs;
        var analType;
        if ($scope.docInfo.beCode == 'qnzrmyy' || $scope.docInfo.beCode == 'yxyy') {
            if (rs.analgesicMethod == 0)
                $scope.analType = '无';
            else if (rs.analgesicMethod == 1)
                $scope.analType = 'PCIA';
            else if (rs.analgesicMethod == 2)
                $scope.analType = 'PCEA';
            else if (rs.analgesicMethod == 3)
                $scope.analType = 'PCSA';
            else if (rs.analgesicMethod == 4)
                $scope.analType = 'PCNA';
        } else {
            if (rs.analgesicType)
                analType = JSON.parse(rs.analgesicType);

            if (typeof(analType) == 'object') {
                if (analType.check == '1')
                    $scope.analType = '有';
                else
                    $scope.analType = '无';

                if (analType.value == '1')
                    $scope.analType = '静脉';
                else if (analType.value == '2')
                    $scope.analType = '椎管内';
                else if (analType.value == '3')
                    $scope.analType = '局部';
            }
        }

        // 主表
        $scope.postFollowRecord = rs.postFollowRecord.postFollowRecord;

        if ($scope.docInfo.beCode == 'qnzrmyy') {
            $scope.postFollowRecord.anesthetistId = rs.anesthetistId;
        }

        $scope.processState = $scope.postFollowRecord.processState;
        $scope.$emit('processState', $scope.postFollowRecord.processState);

        if ($scope.postFollowRecord.deathTime)
            $scope.postFollowRecord.deathTime = $filter('date')(new Date($scope.postFollowRecord.deathTime), 'yyyy-MM-dd HH:mm')
        if ($scope.postFollowRecord.intubatTime)
            $scope.postFollowRecord.intubatTime = $filter('date')(new Date($scope.postFollowRecord.intubatTime), 'yyyy-MM-dd HH:mm')

        // 脉搏
        if ($scope.postFollowRecord.bloodPressure) {
            var bloodPressure = $scope.postFollowRecord.bloodPressure.split('/');
            $scope.postFollowRecord.bloodPressureL = bloodPressure[0] - 0;
            $scope.postFollowRecord.bloodPressureR = bloodPressure[1] - 0;
        }
        if ($scope.postFollowRecord.breath)
            $scope.postFollowRecord.breath = $scope.postFollowRecord.breath - 0;
        if ($scope.postFollowRecord.heartrate)
            $scope.postFollowRecord.heartrate = $scope.postFollowRecord.heartrate - 0;
        if ($scope.postFollowRecord.spo2)
            $scope.postFollowRecord.spo2 = $scope.postFollowRecord.spo2 - 0;
        if ($scope.postFollowRecord.pulse)
            $scope.postFollowRecord.pulse = $scope.postFollowRecord.pulse - 0;

        // 全麻
        $scope.postFollowGeneralInfo = rs.postFollowRecord.postFollowGeneralInfo;
        if ($scope.postFollowGeneralInfo && $scope.postFollowGeneralInfo.length > 0) {
            for (var i = 0; i < $scope.postFollowGeneralInfo.length; i++) {
                if ($scope.postFollowGeneralInfo[i].observeTime)
                    $scope.postFollowGeneralInfo[i].observeTime = $filter('date')(new Date($scope.postFollowGeneralInfo[i].observeTime), $scope.docInfo.beCode == 'qnzrmyy' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm');
            }
        } else {
            for (var a = 0; a < rows; a++) {
                $scope.postFollowGeneralInfo.push({
                    observeTime: '',
                    intraAware: '',
                    nausea: '',
                    vomit: '',
                    soreThroat: '',
                    hoarse: '',
                    cognitObstacle: '',
                    consciousness: '',
                    vistorId: ''
                });
            }
        }

        // 椎管
        $scope.postFollowSpinalInfo = rs.postFollowRecord.postFollowSpinalInfo;
        if ($scope.postFollowSpinalInfo && $scope.postFollowSpinalInfo.length > 0) {
            for (var i = 0; i < $scope.postFollowSpinalInfo.length; i++) {
                if ($scope.postFollowSpinalInfo[i].observeTime)
                    $scope.postFollowSpinalInfo[i].observeTime = $filter('date')(new Date($scope.postFollowSpinalInfo[i].observeTime), $scope.docInfo.beCode == 'qnzrmyy' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm');
            }
        } else {
            for (var a = 0; a < rows; a++) {
                $scope.postFollowSpinalInfo.push({
                    observeTime: '',
                    lumbago: '',
                    nausea: '',
                    vomit: '',
                    limbsFeelImp: '',
                    leftLimbsFeelImp: '',
                    limbsMoveImp: '',
                    leftMoveFeelImp: '',
                    rightMoveFeelImp: '',
                    cognitObstacle: '',
                    severeHeadache: '',
                    consciousness: '',
                    vistorId: ''
                });
            }
        }

        // 镇痛
        $scope.postFollowAnalgesicInfo = rs.postFollowRecord.postFollowAnalgesicInfo;
        if ($scope.postFollowAnalgesicInfo && $scope.postFollowAnalgesicInfo.length > 0) {
            for (var i = 0; i < $scope.postFollowAnalgesicInfo.length; i++) {
                if ($scope.postFollowAnalgesicInfo[i].observeTime)
                    $scope.postFollowAnalgesicInfo[i].observeTime = $filter('date')(new Date($scope.postFollowAnalgesicInfo[i].observeTime), $scope.docInfo.beCode == 'qnzrmyy' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm');
            }
        } else {
            for (var a = 0; a < rows1; a++) {
                $scope.postFollowAnalgesicInfo.push({
                    observeTime: '',
                    quietScore: '',
                    activScore: '',
                    nausea: '',
                    vomit: '',
                    ltch: '',
                    vistorId: ''
                });
            }
        }

        $scope.$watch('postFollowRecord.isDeath', function(n, o) {
            if (n != 2)
                $scope.postFollowRecord.deathTime = '';
        })

        $scope.$watch('postFollowRecord.secondIntubat', function(n, o) {
            if (n != 2)
                $scope.postFollowRecord.intubatTime = '';
        })



    });


    function save(type, isPrint) {
        $scope.verify = type == 'END';

        if (type == 'END') {
            if (!$scope.postFollowRecord.anesthetistId) {
                toastr.warning('请输入必填项信息');
                return;
            }
            if (isPrint === 'PRINT' && $scope.postFollowRecord.processState == 'END')
                $scope.$emit('doc-print');
            else if (isPrint === 'PRINT')
                confirm.show('打印的文书将归档，且不可编辑。').then(function(data) { submit(type, isPrint); });
            else
                confirm.show('提交的文书将归档，并且不可编辑。').then(function(data) { submit(type); });
        } else
            submit(type, isPrint)
    }

    function submit(type, isPrint) {
        $scope.postFollowRecord.processState = type;
        $scope.postFollowRecord.bloodPressure = $scope.postFollowRecord.bloodPressureL + '/' + $scope.postFollowRecord.bloodPressureR;
        var postFollowRecord = angular.copy($scope.postFollowRecord);

        if (postFollowRecord.deathTime)
            postFollowRecord.deathTime = new Date(postFollowRecord.deathTime).getTime();
        if (postFollowRecord.intubatTime)
            postFollowRecord.intubatTime = new Date(postFollowRecord.intubatTime).getTime();

        var para = {
            postFollowRecord: postFollowRecord,
            postFollowGeneralInfo: angular.copy($scope.postFollowGeneralInfo).map(function(item) {
                if (item.observeTime)
                    item.observeTime = new Date(item.observeTime).getTime();
                return item;
            }),
            postFollowSpinalInfo: angular.copy($scope.postFollowSpinalInfo).map(function(item) {
                if (item.observeTime)
                    item.observeTime = new Date(item.observeTime).getTime();
                return item;
            }),
            postFollowAnalgesicInfo: angular.copy($scope.postFollowAnalgesicInfo).map(function(item) {
                if (item.observeTime)
                    item.observeTime = new Date(item.observeTime).getTime();
                return item;
            })
        };

        IHttp.post("document/savePostFollowRecord", para).then(function(res) {
            $scope.processState = type
            if (res.data.resultCode != 1) {
                $scope.postFollowRecord.processState = "END";
                return;
            }
            toastr.success(res.data.resultMessage);
            if (isPrint === 'PRINT')
                $scope.$emit('end-print');
            else
                $scope.$emit('processState', $scope.postFollowRecord.processState);
        });
    }
    $timeout(function() {
        $scope.$watch('postFollowRecord.anesthetistId', function(n, o) {
            $scope.hasSig = false;
            $scope.eSignatureAnesthetist = [];
            angular.forEach($scope.anesthetistList, function(item) {
                if (item.userName == n) {
                    $scope.hasSig = item.picPath ? true : false;
                    $scope.eSignatureAnesthetist.push({ hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime() });
                }
            })
        }, true)
    }, 1000);
    $scope.clearItem = function(type, item) {
        for (var a in item) {
            if (typeof(item[a]) == 'object')
                item[a] = null;
            else
                item[a] = '';
        }
    }

    $scope.ck = function(type, item) {
        switch (type) {
            case 'limbsFeelImp':
                item.leftLimbsFeelImp = item.rightLimbsFeelImp = '';
                break;
            case 'leftLimbsFeelImp':
                item.limbsFeelImp = '';
                break;
            case 'limbsMoveImp':
                item.leftMoveFeelImp = item.rightMoveFeelImp = '';
                break;
            case 'leftMoveFeelImp':
                item.limbsMoveImp = '';
                break;
        }
    }

    $scope.changeVistor = function(item) {
        if (!item.observeTime)
            return;
        item.vistorId = angular.copy($scope.rs.anesthetistId);
    }

    $scope.$on('save', () => {
        if ($scope.saveActive && $scope.processState == 'END')
            submit('END');
        else
            save('NO_END');
    });

    $scope.$on('print', () => {
        save('END', 'PRINT');
    });

    $scope.$on('submit', () => {
        save('END');
    })
    $scope.checkFn = function(flag) {
        switch (flag) {
            case 'postDoctorAdviceFlag':
                if ($scope.postFollowRecord.postDoctorAdviceFlag == 1) {
                    $scope.postFollowRecord.postDoctorAdviceMap = {};
                    $scope.postFollowRecord.postDoctorAdviceOther = '';
                }
                break;
        }
    }
}