//麻醉前访视记录与评估记录单
B_NHFE.$inject = ['$rootScope', '$scope', 'IHttp', 'toastr', 'auth', '$timeout','$q', 'select', 'confirm'];

module.exports = B_NHFE;

function B_NHFE($rootScope, $scope, IHttp, toastr, auth, $timeout,$q, select, confirm) {
    var vm = this;
    $scope.docInfo = auth.loginUser();
    $scope.setting = $rootScope.$state.current.data;
    $scope.$emit('readonly', $scope.setting);
    $scope.saveActive = auth.getDocAuth();
    var regOptId = $rootScope.$stateParams.regOptId;
    var originProcessState;
    var promise;
    init();
    vm.setallergic = function() {
        if (vm.preVisit.allergic) {
            vm.preVisit.allergicCond = "";
        }
    }

    vm.setdrugAddiction = function() {
        if (vm.preVisit.drugAddiction == '1') {
            vm.preVisit.drugAddictionCond = "";
        }
    }

    vm.setdanaes = function() {
        if (vm.preVisit.anaes == '1') {
            vm.preVisit.anaesCond = "";
        }
    }

    vm.setoperHis = function() {
        if (vm.preVisit.operHis == '1') {
            vm.preVisit.operHisCond = "";
        }
    }

    vm.cardiacWorkup = function() {
        if (vm.previsitPhyexam.cardiacWorkup == '2') {
            vm.previsitPhyexam.cardiacWorkupRes = "";
        }
    }

    vm.pulmExam = function() {
        if (vm.previsitPhyexam.pulmExam == '2') {
            vm.previsitPhyexam.pulmExamRes = "";
        }
    }

    vm.bleFeel = function() {
        if (vm.previsitPhyexam.bleFeel == '2') {
            vm.previsitPhyexam.bleFeelRes = "";
        }
    }

    vm.routUrineTest = function() {
        if (vm.previsitAccessexam.routUrineTest == '2') {
            vm.previsitAccessexam.routUrineTestRes = "";
        }
    }

    vm.rabat = function() {
        if (vm.previsitAccessexam.rabat == '2') {
            vm.previsitAccessexam.rabatRes = "";
        }
    }

    vm.lungFunc = function() {
        if (vm.previsitAccessexam.lungFunc == '2') {
            vm.previsitAccessexam.lungFuncRes = "";
        }
    }

    vm.ecg = function() {
        if (vm.previsitAccessexam.ecg == '2') {
            vm.previsitAccessexam.ecgRes = "";
        }
    }

    vm.ucg = function() {
        if (vm.previsitAccessexam.ucg == '2') {
            vm.previsitAccessexam.ucgRes = "";
        }
    }

    vm.liverFunc = function() {
        if (vm.previsitAccessexam.liverFunc == '2') {
            vm.previsitAccessexam.liverFuncRes = "";
        }
    }

    vm.renalFunc = function() {
        if (vm.previsitAccessexam.renalFunc == '2') {
            vm.previsitAccessexam.renalFuncRes = "";
        }
    }


    vm.coagulFunc = function() {
        if (vm.previsitAccessexam.coagulFunc == '2') {
            vm.previsitAccessexam.coagulFuncRes = "";
        }
    }

    vm.electrolytic = function() {
        if (vm.previsitAccessexam.electrolytic == '2') {
            vm.previsitAccessexam.electrolyticRes = "";
        }
    }

    vm.routBloodTest = function() {
        if (vm.previsitAccessexam.routBloodTest == '2') {
            vm.previsitAccessexam.routBloodTestRes = "";
        }
    }


    vm.anaesPrepSpec = function() {
        if (vm.previsitAnaesplan.anaesPrepSpec == '1') {
            vm.previsitAnaesplan.anaesPrepSpecRes = "";
        }
    }

    //保存 提交文书
    vm.save = function(type, ev, state) {}

    // $scope.$watch('baseSheetIndex', function(newVal) {
    //     if ($state.current.name == 'sheetTabs.child' && newVal == 2) {
    //         $rootScope.siteTitle = '麻醉术前访视与评估记录单';
    //         init();
    //     } else if ($state.current.name == 'rehealthTabs.child' && newVal == 1) {
    //         $rootScope.siteTitle = '麻醉前访视记录单';
    //         init();
    //     }
    // });

    function init() {
        IHttp.post('/document/searchPreVisitByRegOptId', {
            regOptId: regOptId
        }).then(function(res) {
            var data = res.data;
            data.preVisitItem.signDate = data.preVisitItem.signDate ? new Date(data.preVisitItem.signDate) : new Date();
            changeData(data);
        });
    }

    function changeData(visit) {
        if (visit.previsitPhyexam && visit.previsitPhyexam.bloodPre !== "" && visit.previsitPhyexam.bloodPre.indexOf('-') > 0) {
            visit.previsitPhyexam._bloodPre = visit.previsitPhyexam.bloodPre.split('-')[0] - 0;
            visit.previsitPhyexam.bloodPre_ = visit.previsitPhyexam.bloodPre.split('-')[1] - 0;
        }

        var preVisitId_id = visit.preVisitItem.preVisitId;
        var regOptId_id = visit.regOptItem.regOptId;
        var previsitPhyexamid = visit.previsitPhyexam.id;
        var previsitAccessexamid = visit.accessexam.id;
        var previsitAnaesplanid = visit.anaesplan.id;
        vm.type = $state.params.type;
        vm.regOptItem = visit.regOptItem;
        vm.preVisitItem = visit.preVisitItem;
        vm.preVisitItem.preAge = vm.regOptItem.age;

        vm.preVisit = {
            briefHis: "",
            comorbidity: "",
            allergic: 0,
            allergicCond: "",
            drugAddiction: 0,
            drugAddictionCond: "",
            other1: "",
            medHis: "",
            other2: "",
            anaes: 0,
            anaesCond: "",
            operHis: 0,
            operHisCond: "",
            anaesDanger: "",
            anaesMonitor: "",
            anaesStep: "",
            anaestheitistId: "",
            anaestheitistName: "",
            bloodPre: "",
            breath: "",
            diabetes: "",
            flag: "1",
            heartBool: "",
            lungbreath: "",
            operationLevel: "",
            organAbnormal: "",
            organNormal: "",
            othComorbidity: "",
            preAge: "",
            preAnesEvaLevel: "",
            preAnesEvaLevel1: "",
            processState: "",
            regOptId: regOptId_id,
            signDate: "",
            situationLevel: "",
            state: "06",
            preVisitId: preVisitId_id
        };
        vm.previsitPhyexam = {
            temp: "",
            pr: "",
            heartrate: "",
            bloodPre: "",
            _bloodPre: "",
            bloodPre_: "",
            consciou: "",
            mallampati: "",
            dyspnea: 0,
            cyanosis: 0,
            diffAirway: 0,
            aperture: 0,
            toothMobility: 0,
            headActivity: 0,
            cardiacWorkup: 0,
            cardiacWorkupRes: "",
            pulmExam: 0,
            pulmExamRes: "",
            hemivertebra: 0,
            intervSpace: 0,
            puncPoint: "",
            bleFeel: 0,
            bleFeelRes: "",
            other: "",
            id: previsitPhyexamid
        };
        vm.previsitAccessexam = {
            routBloodTest: 0,
            routBloodTestRes: "",
            routUrineTest: 0,
            routUrineTestRes: "",
            rabat: 0,
            rabatRes: "",
            lungFunc: 0,
            lungFuncRes: "",
            ecg: 0,
            ecgRes: "",
            ucg: 0,
            ucgRes: "",
            liverFunc: 0,
            liverFuncRes: "",
            renalFunc: 0,
            renalFuncRes: "",
            coagulFunc: 0,
            coagulFuncRes: "",
            electrolytic: 0,
            electrolyticRes: "",
            other: "",
            id: previsitAccessexamid
        };
        vm.previsitAnaesplan = {
            asa: "",
            asaE: "",
            anesthIndica: 0,
            scheduled: 0,
            anaesType: "",
            genAnesPos: "",
            puncPoint: "",
            othAnaesType: "",
            anaesPrep: 0,
            anaesPrepSpec: 0,
            monitorItem: "",
            monitorOther: "",
            deviceMed: "",
            otherDevMed: "",
            anaesMethChg: 0,
            anaesMethChgRea: '',
            leaveTo: '',
            anaesPrepSpecRes: "",
            id: previsitAnaesplanid
        };


        if (visit.previsitPhyexam && visit.previsitPhyexam.bloodPre)
            visit.previsitPhyexam.bloodPre -= 0;

        angular.extend(vm.preVisit, visit.preVisitItem);
        angular.extend(vm.previsitPhyexam, visit.previsitPhyexam);
        angular.extend(vm.previsitAccessexam, visit.accessexam);
        angular.extend(vm.previsitAnaesplan, visit.anaesplan);

        vm.comorbidity_ = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        vm.medHis_ = [0, 0, 0];
        vm.monitorItem_ = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        vm.genAnesPos_ = [0, 0, 0];
        vm.deviceMed_ = [0, 0, 0, 0, 0];

        if (vm.preVisit.comorbidity !== '') {
            vm.comorbidity_ = vm.preVisit.comorbidity.split(',');
        }
        if (vm.preVisit.medHis !== '') {
            vm.medHis_ = vm.preVisit.medHis.split(',');
        }
        if (vm.previsitAnaesplan.monitorItem !== '') {
            vm.monitorItem_ = vm.previsitAnaesplan.monitorItem.split(',');
        }
        if (vm.previsitAnaesplan.genAnesPos !== '') {
            vm.genAnesPos_ = vm.previsitAnaesplan.genAnesPos.split(',');
        }
        if (vm.previsitAnaesplan.deviceMed !== '') {
            vm.deviceMed_ = vm.previsitAnaesplan.deviceMed.split(',');
        }

        vm.organStateChange = organStateChange;
        vm.submit = submit;
        vm.print = print;

        organStateChange(vm.preVisitItem.organNormal);

        $scope.eSignature = [];
        angular.forEach($rootScope.userList, function(item) {
            if (item.id == vm.regOptItem.anesthetistId) {
                $scope.eSignature.push(item.eSignature);
            }
        })

        $scope.$watch('vm.previsitAnaesplan.anaesMethChg', function(n, o) {
            if (n != 1) {
                vm.previsitAnaesplan.anaesMethChgRea = '';
            }
        });

        originProcessState = vm.preVisit.processState;
        if ($rootScope.isLeader) {
            vm.preVisit.processState = 'NO_END';
        }
    }

    // 器官功能状态切换
    function organStateChange(state) {
        switch (state) {
            case '轻':
                vm.organLight = true;
                vm.organNormal = vm.organMiddle = vm.organWeight = false;
                break;
            case '中':
                vm.organMiddle = true;
                vm.organNormal = vm.organLight = vm.organWeight = false;
                break;
            case '重':
                vm.organWeight = true;
                vm.organNormal = vm.organMiddle = vm.organLight = false;
                break;
            default:
                vm.organNormal = state;
                vm.organLight = vm.organMiddle = vm.organWeight = false;
        }
    }

    // 提交文书  
    function submit(processState) {
        var def = $q.defer();
        var preVisitmzsq = new Object();
        vm.preVisit.processState = processState;

        vm.previsitPhyexam.bloodPre = vm.previsitPhyexam._bloodPre + '-' + vm.previsitPhyexam.bloodPre_;

        preVisitmzsq = {
            preVisit: angular.copy(vm.preVisit),
            previsitPhyexam: vm.previsitPhyexam,
            previsitAccessexam: vm.previsitAccessexam,
            previsitAnaesplan: vm.previsitAnaesplan
        }

        preVisitmzsq.preVisit.comorbidity = vm.comorbidity_.join();
        preVisitmzsq.preVisit.medHis = vm.medHis_.join();
        preVisitmzsq.previsitAnaesplan.genAnesPos = vm.genAnesPos_.join();
        preVisitmzsq.previsitAnaesplan.monitorItem = vm.monitorItem_.join();
        preVisitmzsq.previsitAnaesplan.deviceMed = vm.deviceMed_.join();
        if (processState !== 'NO_END') {
            preVisitmzsq.preVisit.processState = 'END';
        } else {
            preVisitmzsq.preVisit.processState = originProcessState;
        }

        if (promise) {
            $timeout.cancel(promise);
        }
        promise = $timeout(function() {
            // preVisit.save(preVisitmzsq).then(function(res) {
            //     if (res.resultCode != 1)
            //         return;
            //     if (processState !== 'NO_END') {
            //         if (!$rootScope.isLeader) {
            //             vm.preVisit.processState = 'END';
            //         } else {
            //             originProcessState = 'END';
            //         }
            //     }
            //     if (processState !== 'NO_END') {}
            //     init();
            //     def.resolve(res);
            // });

            // function save(data) {
            //     var url = $rootScope.baseUrl + '/document/savePreVisitByDocId';
            //     return $http.post(url, data).then(function(res) {
            //         return res.data;
            //     });
            // }
        }, 200);
        return def.promise;
    }
}