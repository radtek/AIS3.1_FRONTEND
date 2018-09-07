PreVisitLogCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$window', 'anesRecordServe', '$timeout', '$state', '$q', 'toastr', 'confirm', 'auth', '$filter', 'select'];

module.exports = PreVisitLogCtrl;

function PreVisitLogCtrl($rootScope, $scope, IHttp, $window, anesRecordServe, $timeout, $state, $q, toastr, confirm, auth, $filter, select) {
    $scope.setting = $rootScope.$state.current.data;
    $scope.$emit('readonly', $scope.setting);
    $scope.docInfo = auth.loginUser();

    var optid = $rootScope.$stateParams.regOptId,
        timer_rt;

    var currRouteName = $rootScope.$state.current.name;
    $scope.$on('$stateChangeStart', function() {
        // clearTimeout(timer_rt);
        anesRecordServe.stopTimerRt();
    });

    //术中启动定时监测
    if (currRouteName == 'midVisitLog_sybx') {
        start_rt();

        function rtData() {
            anesRecordServe.rtData(optid, function(msg, list) {
                start_rt();
            });
        }

        function start_rt() {
            if (timer_rt)
                clearTimeout(timer_rt);
            timer_rt = setTimeout(rtData, 1000);
        }
        // anesRecordServe.startTimerRt(optid);
    }
    $timeout(function() {
    $scope.$watch('preVisitItem.anaestheitistId', function(n, o) {
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
    function init() {
        IHttp.post('document/searchPreVisitByRegOptId', { 'regOptId': optid }).then(function(res) {
            if (res.data.resultCode != 1)
                return;
            //初始化时发送文书状态
            $scope.processState = res.data.preVisitItem.processState;
            $scope.$emit('processState', $scope.processState);

            //赋值
            $scope.regOptItem = res.data.regOptItem;
            $scope.preVisitItem = res.data.preVisitItem;
            $scope.preVisitItem.heartBoolRegion = Number($scope.preVisitItem.heartBoolRegion);
            $scope.preVisitItem.ef = $scope.preVisitItem.ef && Number($scope.preVisitItem.ef);
            if (!$scope.preVisitItem.signDate)
                $scope.preVisitItem.signDate = $filter('date')(new Date(), 'yyyy-MM-dd');
        });
    }

    init();

    function submit(processState, state) {
        $rootScope.btnActive = false;
        let postData = angular.copy($scope.preVisitItem);
        postData.processState = processState;
        postData.anaesMethodList = [];

        IHttp.post('document/updatePreVisit', postData).then((res) => {
            $rootScope.btnActive = true;
            if (res.data.resultCode != 1)
                return;
            toastr.success(res.data.resultMessage);
            $scope.preVisitItem.processState = processState;
            $scope.processState = $scope.preVisitItem.processState;
            if (state == 'print')
                $scope.$emit('end-print');
            else
                $scope.$emit('processState', $scope.preVisitItem.processState);
        });
    }

    //保存 提交文书
    function save(type, state) {
        $scope.verify = type == 'END';
        if ($scope.preVisitItem.processState == undefined) {
            toastr.error('操作失败，无效的数据！');
            return;
        }
        if (type == 'END') {
            if (!$scope.preVisitItem.asa || !$scope.preVisitItem.nyha || !$scope.preVisitItem.mallampatis ) {//|| !$scope.preVisitItem.leaveTo
                toastr.warning('请输入必填项信息');
                return;
            }
            if (state == 'print') {
                if ($scope.preVisitItem.processState == 'END') {
                    $scope.$emit('doc-print');
                } else {
                    confirm.show('打印的文书将归档，且不可编辑。').then(function(data) {
                        submit(type, state);
                    });
                }
            } else {
                confirm.show('提交的文书将归档，并且不可编辑。').then(function(data) {
                    submit(type);
                });
            }
        } else {
            submit(type);
        }
    }

    select.getAnaesthetists().then((rs) => {
        $scope.anesthetistList = rs.data.userItem;
    });

    $scope.$on('save', () => {
        save('NO_END');
    });

    $scope.$on('print', () => {
        save('END', 'print');
    });

    $scope.$on('submit', () => {
        save('END');
    })

    $scope.$watch('preVisitItem.briefHisMap', function(n) {
        if (n == undefined) return;
        if (!n.d)
            $scope.preVisitItem.gestationTime = '';
        if (!n.g)
            $scope.preVisitItem.otherBriefHisCond = '';
        if (!n.h)
            $scope.preVisitItem.anaesCond = '';
    }, true)

    $scope.$watch('preVisitItem.heartBoolCondMap', function(n) {
        if (n == undefined) return;
        if (!n.i) {
            n.j = false;
            $scope.preVisitItem.heartBoolRegion = '';
        }
    }, true)

    $scope.$watch('preVisitItem.lungbreathCondMap', function(n) {
        if (n == undefined) return;
        if (!n.h)
            $scope.preVisitItem.lungbreathOther = '';
    }, true)

    $scope.$watch('preVisitItem.brainNerveMap', function(n) {
        if (n == undefined) return;
        if (!n.g)
            n.c = '0';
        if (!n.e)
            n.f = '0';
        if (!n.n)
            $scope.preVisitItem.brainNerveOther = '';
    }, true)

    $scope.$watch('preVisitItem.spineLimbMap', function(n) {
        if (n == undefined) return;
        if (!n.a)
            $scope.preVisitItem.paraplegia = '';
        if (!n.f)
            $scope.preVisitItem.spineLimbOther = '';
        if (!n.e)
            $scope.preVisitItem.kidneyOther = '';
    }, true)

    // $scope.$watch('preVisitItem.bloodMap', function(n) {
    //     if (n == undefined) return;
    //     if (!n.h)
    //         $scope.preVisitItem.bloodOther = '';
    // }, true)

    // $scope.$watch('preVisitItem.digestionMap', function(n) {
    //     if (n == undefined) return;
    //     if (!n.f)
    //         $scope.preVisitItem.digestionOther = '';
    // }, true)

    $scope.$watch('preVisitItem.endocrineMap', function(n) {
        if (n == undefined) return;
        if (!n.b) {
            n.c = false;
            n.e = false;
        }
        if (!n.f)
            $scope.preVisitItem.endocrineOther = '';
    }, true)

    $scope.$watch('preVisitItem.kidney', function(n) {
        if (n == undefined) return;
        if (!n)
            $scope.preVisitItem.kidneyCond = '';
    }, true)

    $scope.$watch('preVisitItem.infectiousMap', function(n) {
        if (n == undefined) return;
        if (!n.g)
            $scope.preVisitItem.infectiousOther = '';
    }, true)

    $scope.$watch('preVisitItem.drugAddictionCond', function(n) {
        if (n == undefined) return;
        if (n != 2)
            $scope.preVisitItem.drugAddiction = '';
    }, true)

    $scope.$watch('preVisitItem.vitalSignsAbnormal', function(n) {
        if (n == undefined) return;
        if (n != 2)
            $scope.preVisitItem.awareness = '';
    }, true)

    $scope.$watch('preVisitItem.assayAbnormal', function(n) {
        if (n == undefined) return;
        if (n != 2) {
            $scope.preVisitItem.assayAbnormalMap.a = false;
            $scope.preVisitItem.assayAbnormalMap.b = false;
            $scope.preVisitItem.assayAbnormalMap.c = false;
            $scope.preVisitItem.assayAbnormalMap.d = false;
            $scope.preVisitItem.assayAbnormalMap.e = false;
            $scope.preVisitItem.assayAbnormalMap.f = false;
            $scope.preVisitItem.assayAbnormalMap.g = false;
            $scope.preVisitItem.assayAbnormalMap.h = false;
        }
    }, true)

    $scope.$watch('preVisitItem.analgesic', function(n) {
        if (n == undefined) return;
        if (n != 2) {
            $scope.preVisitItem.analgesicMap.c = false;
            $scope.preVisitItem.analgesicMap.d = false;
            $scope.preVisitItem.analgesicMap.e = false;
            $scope.preVisitItem.analgesicMap.f = false;
        }
    }, true)
    $scope.$watch('preVisitItem.briefHisMap', function(n) {
        if (n.a == 2 || n.b == 3) {
            $scope.preVisitItem.allergic = 0;
        } else {
            $scope.preVisitItem.allergic = 1;
            $scope.preVisitItem.allergicCond = '';
        }
    }, true)
    $scope.$watch('preVisitItem.allergicCond', function(n) {
        if (n == undefined) return;
        if (n) {
            $scope.preVisitItem.allergic = 0;
        } else {
            $scope.preVisitItem.allergic = 1;
            $scope.preVisitItem.allergicCond = '';
        }
    }, true)
    $scope.$watch('preVisitItem.anaesCondMap', function(n) {
        if (n == undefined) return;
        if (n.a == 2 || n.b == 3 || n.c == 4 || n.d == 5) {
            $scope.preVisitItem.anaes = 0;
        } else {
            $scope.preVisitItem.anaes = 1;
        }
    }, true)
    $scope.$watch('preVisitItem.drugAbuseCondMap', function(n) {
        if (n == undefined) return;
        if (n.a == 2 || n.b == 3 || n.c == 4) {
            $scope.preVisitItem.drugAddiction = 0;
        } else {
            $scope.preVisitItem.drugAddiction = 1;
        }
    }, true)
    $scope.$watch('preVisitItem.specialTreatmentCondMap', function(n) {
        if (n == undefined) return;
        if (n.a == 2 || n.b == 3 || n.c == 4 || n.d == 5 || n.e == 6 || n.f == 7) {
            $scope.preVisitItem.specialTreatment = 0;
        } else {
            $scope.preVisitItem.specialTreatment = 1;
        }
    }, true)
    $scope.$watch('preVisitItem.heartBoolCondMap', function(n) {
        if (n == undefined) return;
        if (n.a == 1 || n.b == 1 || n.d == 1 || n.e == 1 || n.z == 1 || n.f == 1 || n.g == 1 || n.h == 1 || n.i == 1 || n.j == 1) {
            $scope.preVisitItem.heartBoolHave = 0;
        } else {
            $scope.preVisitItem.heartBoolHave = 1;
            $scope.preVisitItem.heartBoolCondMap = {};
            $scope.preVisitItem.heartBoolRegion = '';
            $scope.preVisitItem.heartBoolOther = '';
        }
    }, true)
    $scope.$watch('preVisitItem.lungbreathCondMap', function(n) {
        if (n == undefined) return;
        if (n.a == 1 || n.b == 1 || n.c == 1 || n.d == 1 || n.h == 1) {
            $scope.preVisitItem.lungbreathHave = 0;
        } else {
            $scope.preVisitItem.lungbreathHave = 1;
        }
    }, true)
    $scope.$watch('preVisitItem.brainNerveMap', function(n) {
        if (n == undefined) return;
        if (n.a == 1 || n.b == 1 || n.g == 1 || n.c == 1 || n.e == 1 || n.f == 1 || n.l == 1 || n.m == 1 || n.n == 1) {
            $scope.preVisitItem.brainNerveHave = 0;
        } else {
            $scope.preVisitItem.brainNerveHave = 1;
            $scope.preVisitItem.brainNerveOther = '';
        }
    }, true)
    $scope.$watch('preVisitItem.spineLimbMap', function(n) {
        if (n == undefined) return;
        if (n.a == 1 || n.c == 1 || n.d == 1 || n.f == 1) {
            $scope.preVisitItem.spineLimbHave = 0;
        } else {
            $scope.preVisitItem.spineLimbHave = 1;
            $scope.preVisitItem.paraplegia = $scope.preVisitItem.spineLimbOther = '';
        }
    }, true)
    $scope.$watch('preVisitItem.bloodMap', function(n) {
        if (n == undefined) return;
        if (n.a == 1 || n.b == 1 || n.c == 1 || n.h == 1) {
            $scope.preVisitItem.bloodHave = 0;
        } else {
            $scope.preVisitItem.bloodHave = 1;
            $scope.preVisitItem.bloodOther = '';
        }
    }, true)
    $scope.$watch('preVisitItem.kidney', function(n) {
        if (n == undefined) return;
        if ($scope.preVisitItem.kidney == 1 || $scope.preVisitItem.kidneyCond == 1 || $scope.preVisitItem.spineLimbMap.e == 1) {
            $scope.preVisitItem.kidneyHave = 0;
        } else {
            $scope.preVisitItem.kidneyHave = 1;
            $scope.preVisitItem.kidneyCond = $scope.preVisitItem.kidneyOther = '';
            $scope.preVisitItem.spineLimbMap.e = $scope.preVisitItem.kidney = 2;

        }
    }, true)
    $scope.$watch('preVisitItem.kidneyCond', function(n) {
        if (n == undefined) return;
        if ($scope.preVisitItem.kidney == 1 || $scope.preVisitItem.kidneyCond == 1 || $scope.preVisitItem.spineLimbMap.e == 1) {
            $scope.preVisitItem.kidneyHave = 0;
        } else {
            $scope.preVisitItem.kidneyHave = 1;
            $scope.preVisitItem.kidney = '';
            $scope.preVisitItem.spineLimbMap.e = 2;
        }
    }, true)
    $scope.$watch('preVisitItem.spineLimbMap.e', function(n) {
        if (n == undefined) return;
        if ($scope.preVisitItem.kidney == 1 || $scope.preVisitItem.kidneyCond == 1 || $scope.preVisitItem.spineLimbMap.e == 1) {
            $scope.preVisitItem.kidneyHave = 0;
        } else {
            $scope.preVisitItem.kidneyHave = 1;
            $scope.preVisitItem.kidneyOther = '';
        }
    }, true)
    $scope.$watch('preVisitItem.digestionMap', function(n) {
        if (n == undefined) return;
        if (n.a == 1 || n.b == 1 || n.c == 1 || n.d == 1|| n.e == 1|| n.f == 1) {
            $scope.preVisitItem.digestionHave = 0;
        } else {
            $scope.preVisitItem.digestionHave = 1;
            $scope.preVisitItem.digestionOther = '';
        }
    }, true)
    $scope.$watch('preVisitItem.endocrineMap', function(n) {
        if (n == undefined) return;
        if (n.a == 1 || n.b == 1 || n.c == 1 || n.d == 1|| n.e == 1|| n.f == 1|| n.g == 1) {
            $scope.preVisitItem.endocrineHave = 0;
        } else {
            $scope.preVisitItem.endocrineHave = 1;
            $scope.preVisitItem.endocrineOther = '';
        }
    }, true)
    $scope.$watch('preVisitItem.infectiousMap', function(n) {
        if (n == undefined) return;
        if (n.a == 1 || n.b == 1 || n.c == 1 || n.d == 1|| n.e == 1|| n.g == 1) {
            $scope.preVisitItem.infectiousHave = 0;
        } else {
            $scope.preVisitItem.infectiousHave = 1;
            $scope.preVisitItem.infectiousOther = '';
        }
    }, true)
    $scope.checkFn = function(flag) {
        switch (flag) {
            case 'specialTreatment':
                if ($scope.preVisitItem.specialTreatment == 1) {
                    $scope.preVisitItem.specialTreatmentCondMap = {};
                    $scope.preVisitItem.specialTreatmentOther = '';
                }
                break;
            case 'heartBoolHave':
                if ($scope.preVisitItem.heartBoolHave == 1) {
                    $scope.preVisitItem.heartBoolCondMap = {};
                    $scope.preVisitItem.heartBoolRegion = '';
                    $scope.preVisitItem.heartBoolOther = '';
                }
                break;
            case 'lungbreathHave':
                if ($scope.preVisitItem.lungbreathHave == 1) {
                    $scope.preVisitItem.lungbreathCondMap = {};
                    $scope.preVisitItem.lungbreathOther = '';
                }
                break;
            case 'brainNerveHave':
                if ($scope.preVisitItem.brainNerveHave == 1) {
                    $scope.preVisitItem.brainNerveMap = {};
                    $scope.preVisitItem.brainNerveOther = '';
                }
                break;
            case 'spineLimbHave':
                if ($scope.preVisitItem.spineLimbHave == 1) {
                    $scope.preVisitItem.spineLimbMap = {};
                    $scope.preVisitItem.paraplegia = '';
                    $scope.preVisitItem.spineLimbOther = '';
                }
                break;
            case 'bloodHave':
                if ($scope.preVisitItem.bloodHave == 1) {
                    $scope.preVisitItem.bloodMap = {};
                    $scope.preVisitItem.bloodOther = '';
                }
                break;
            case 'kidneyHave':
                if ($scope.preVisitItem.kidneyHave == 1) {
                    $scope.preVisitItem.kidneyCond = $scope.preVisitItem.kidneyOther = '';
                    $scope.preVisitItem.spineLimbMap.e = $scope.preVisitItem.kidney = 2;
                }
                break;
            case 'digestionHave':
                if ($scope.preVisitItem.digestionHave == 1) {
                    $scope.preVisitItem.digestionMap = {};
                    $scope.preVisitItem.digestionOther = '';
                }
                break;
                
            case 'endocrineHave':
                if ($scope.preVisitItem.endocrineHave == 1) {
                    $scope.preVisitItem.endocrineMap = {};
                    $scope.preVisitItem.endocrineOther = '';
                }
                break;    
            case 'infectiousHave':
                if ($scope.preVisitItem.infectiousHave == 1) {
                    $scope.preVisitItem.infectiousMap = {};
                    $scope.preVisitItem.infectiousOther = '';
                }
                break; 
        }
    }
}