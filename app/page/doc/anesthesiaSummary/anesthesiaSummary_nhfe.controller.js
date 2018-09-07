AnesthesiaSummaryNhfeCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$state', '$uibModal', 'toastr', '$timeout', 'select', 'auth', 'anesRecordServe', 'confirm', 'dateFilter', '$filter'];

module.exports = AnesthesiaSummaryNhfeCtrl;

function AnesthesiaSummaryNhfeCtrl($rootScope, $scope, IHttp, $state, $uibModal, toastr, $timeout, select, auth, anesRecordServe, confirm, dateFilter, $filter) {
    var vm = this;
    vm.anaesSummary = {};
    vm.allergicReact = {};
    vm.venipuncture = {};
    vm.anaesSummaryAppendixVisit = {};
    $scope.setting = $rootScope.$state.current.data;
    $scope.docInfo = auth.loginUser();
    var regOptId = $rootScope.$stateParams.regOptId,
        promise,
        formbean,
        intrAnae = [{ name: 'spinalAnes', mark: 'boolean' }, { name: 'waistAnes' }, { name: 'epiduralAnes' }, { name: 'cseUnionAnes' }, { name: 'sacralAnes' }, { name: 'puncPoint1' }, { name: 'catheterPoint1' }, { name: 'direction1' }, { name: 'puncPoint2' }, { name: 'catheterPoint2' }, { name: 'direction2' }, { name: 'anesFlat' }, { name: 'medicine' }],
        nerve = [{ name: 'cervicalPlexusBlock', type: 'sjzz-jcsj', mark: 'boolean' }, { name: 'shallowCong', type: 'sjzz-jcsj' }, { name: 'deepPlexus', type: 'sjzz-jcsj' }, { name: 'c', type: 'sjzz-jcsj' }, { name: 'brachialPlexusBlock', type: 'sjzz-bcsj', mark: 'boolean' }, { name: 'brachialValue', type: 'sjzz-bcsj' }, { name: 'interscaleneLaw', type: 'sjzz-bcsj' }, { name: 'axillaryMethod', type: 'sjzz-bcsj' }, { name: 'clavicleLaw', type: 'sjzz-bcsj' }, { name: 'waistPlexusBlock', type: 'sjzz-ycsj', mark: 'boolean' }, { name: 'waistPlexusValue', type: 'sjzz-ycsj' }, { name: 'sciaticNerveBlock', type: 'sjzz-zgsj', mark: 'boolean' }, { name: 'sciaticNerveValue', type: 'sjzz-zgsj' }, { name: 'femoralNerveBlock', type: 'sjzz-gsj', mark: 'boolean' }, { name: 'femoralNerveValue', type: 'sjzz-gsj' }, { name: 'cutaneousNerveBlock', type: 'sjzz-gwcpsj', mark: 'boolean' }, { name: 'cutaneousNerveValue', type: 'sjzz-gwcpsj' }, { name: 'other1', type: 'sjzz-qt', mark: 'boolean' }, { name: 'other1Value', type: 'sjzz-qt' }, { name: 'medicine1', type: 'sjzz' }],
        intrOper = [{ name: 'invasiveProcedure', type: 'yccz', mark: 'boolean' }, { name: 'arteryCathete', type: 'yccz-dmcc', mark: 'boolean' }, { name: 'radialArtery', type: 'yccz-dmcc', mark: 'boolean' }, { name: 'femoralArtery', type: 'yccz-dmcc', mark: 'boolean' }, { name: 'footArtery', type: 'yccz-dmcc', mark: 'boolean' }, { name: 'footArteryValue', type: 'yccz-dmcc' }, { name: 'deepVeinCathete', type: 'yccz-sjmcc', mark: 'boolean' }, { name: 'jugularVein', type: 'yccz-sjmcc', mark: 'boolean' }, { name: 'subclavianVein', type: 'yccz-sjmcc', mark: 'boolean' }, { name: 'femoralVein', type: 'yccz-sjmcc', mark: 'boolean' }, { name: 'femoralVeinValue', type: 'yccz-sjmcc' }, { name: 'ultrasound1', type: 'yccz-sjmcc', mark: 'boolean' }, { name: 'singleChamber', type: 'yccz-sjmcc', mark: 'boolean' }, { name: 'dualChamber', type: 'yccz-sjmcc', mark: 'boolean' }, { name: 'threeChamber', type: 'yccz-sjmcc', mark: 'boolean' }, { name: 'sgCatheter', type: 'yccz-qt', mark: 'boolean' }, { name: 'other2', type: 'yccz-qt' }];
    var qsmz = [];

    $scope.$emit('readonly', $scope.setting);
    $scope.saveActive = auth.getDocAuth();

    $scope.getAnesList = function(query) {
        var paras = [];
        for (var a = 1; a < arguments.length; a++) {
            if (arguments[a])
                paras.push(arguments[a]);
        }
        return select.getRole('ANAES_DOCTOR', query, paras);
    }

    $scope.dataShare = $state.params.share;
    if ($scope.dataShare == 'true') {
        $scope.dataShare = true;

    } else {
        $scope.dataShare = false;
    }

    // 插管型号
    $scope.cg_xinghao = ['7.5', '7', '6.5', '6', '5.5', '5', '4.5', '4', '3.5', '3', '2.5'];

    // 喉罩型号
    $scope.hz_xinghao = ['1', '1.5', '2', '2.5', '3', '4', '5'];

    // 插管成功次数
    $scope.cg_cishu = ['', '1', '2', '3', '4', '5'];

    // 穿刺点方向
    $scope.cuancidian = ['L3-4', 'L2-3', 'L1-2', 'T12-L1', 'T11-12', 'T10-11', 'T9-10', 'T8-9', 'T7-8'];
    $scope.fangxiang = ['向头', '向尾'];
    $scope.consciou = [{ key: 1, name: '清醒' }, { key: 2, name: '嗜睡' }, { key: 3, name: '麻醉状态' }, { key: 4, name: '谵妄' }, { key: 5, name: '昏迷' }];
    $scope.leaveTo = [{ key: 1, name: 'PACU后回病房' }, { key: 2, name: '病房' }, { key: 3, name: 'ICU' }, { key: 4, name: '门/急诊观察室' }, { key: 5, name: '返家' }];

    select.getAnaesthetists().then((rs) => {
        if (rs.data.resultCode != 1)
            return;
        $scope.anaesDocList = rs.data.userItem;
    });
    $timeout(function() {
        $scope.$watch('vm.anaesSummary.anesthetistId', function(n, o) {
            $scope.hasSig = false;
            $scope.eSignatureAnesthetist = [];
            angular.forEach($scope.anaesDocList, function(item) {
                if (item.userName == n) {
                    $scope.hasSig = item.picPath ? true : false;
                    $scope.eSignatureAnesthetist.push({ hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime() });
                }
            })
        }, true)
    }, 1000);

    function initData() {
        IHttp.post('document/searchAnaesSummaryDetail', { regOptId: regOptId }).then(function(rs) {
            var rs = rs.data;
            if (rs.resultCode != 1)
                return;
            $scope.regOpt = rs.regOpt;
            // 麻醉总结
            vm.anaesSummary = rs.anaesSummary;
            // 椎管内穿刺
            vm.spinalCanalPuncture = rs.spinalCanalPuncture;

            if ($scope.docInfo.beCode === 'yxyy' || $scope.docInfo.beCode == 'cshtyy'|| $scope.docInfo.beCode == 'llzyyy') {
                if (vm.spinalCanalPuncture.puncBodyPoint) {
                    if (vm.spinalCanalPuncture.puncBodyPoint.split(',').length > 1) {
                        vm.spinalCanalPuncture.puncBodyPoint = vm.spinalCanalPuncture.puncBodyPoint.split(',');
                    } else if (vm.spinalCanalPuncture.puncBodyPoint == "1") {
                        vm.spinalCanalPuncture.puncBodyPoint = ["1", "0"];
                    } else if (vm.spinalCanalPuncture.puncBodyPoint == "2") {
                        vm.spinalCanalPuncture.puncBodyPoint = ["0", "2"];
                    }
                } else {
                    vm.spinalCanalPuncture.puncBodyPoint = ["0", "0"];
                }
            }
            
            vm.venipuncture = rs.venipuncture;
            //麻醉期间严重过敏
            vm.allergicReact = rs.allergicReact;

            vm.puncPointList = rs.puncturePointList;
            vm.anaesSummaryAppendixVisit = rs.anaesSummaryAppendixVisit;

            vm.puncPosiList = [{ codeValue: '1', codeName: '左侧卧位' }, { codeValue: '2', codeName: '右侧卧位' }, { codeValue: '3', codeName: '坐位' }];

            // 神经阻滞
            vm.nerveBlock = rs.nerveBlock;
            // 全身麻醉
            vm.generalAnaes = rs.generalAnaes;
            // 手术后诊断
            vm.optLatterDiagStr = rs.optLatterDiagStr;
            // 实施的手术
            vm.optRealOperStr = rs.optRealOperStr;
            // 实施的麻醉
            vm.realAnaesStr = rs.realAnaesStr;
            // 麻醉医生
            vm.anesDocStr = rs.anesDocStr;
            // 麻醉记录单二ID
            vm.sumID = rs.anaesSummary.anaSumId;
            // function
            vm.print = print;

            // 麻醉小结
            $scope.anestsummary = rs.anaesSummary.anestsummary;

            if (vm.spinalCanalPuncture.experDose !== '') {
                vm.spinalCanalPuncture.experDose -= 0;
            }

            if (vm.nerveBlock.experDose !== '') {
                vm.nerveBlock.experDose -= 0;
            }

            if (vm.nerveBlock.succCnt !== '') {
                vm.nerveBlock.succCnt -= 0;
            }

            if (vm.generalAnaes.succCnt !== '') {
                vm.generalAnaes.succCnt -= 0;
            }

            if (angular.isObject(vm.venipuncture)) {
                $scope.$watch('vm.venipuncture.other', function(n, o) {
                    if (n !== 1) {
                        vm.venipuncture.otherContent = '';
                    }
                });
            }

            $scope.$watch('vm.allergicReact.airwayResp', function(n, o) {
                if (n !== 1 && vm.allergicReact) {
                    vm.allergicReact.spasm = '';
                    vm.allergicReact.edema = '';
                    vm.allergicReact.airwayContents = '';
                }
            });
            if (vm.venipuncture && vm.venipuncture.venipunctureTime)
                vm.venipuncture.venipunctureTime = dateFilter(new Date(vm.venipuncture.venipunctureTime), 'yyyy-MM-dd HH:mm');
            if (vm.allergicReact && vm.allergicReact.allergicReactionTime)
                vm.allergicReact.allergicReactionTime = dateFilter(new Date(vm.allergicReact.allergicReactionTime), 'yyyy-MM-dd HH:mm');

            $scope.processState = rs.anaesSummary.processState;
            $scope.$emit('processState', $scope.processState);
        });
    }

    initData();

    function save(processState, type) {
        $scope.verify = processState == 'END';
        if (processState == 'END') {
            if ($scope.docInfo.beCode === 'syzxyy' && (!vm.nerveBlock.anaesFeel || vm.nerveBlock.anaesFeel == 0 || !vm.anaesSummary.anestSummary || !vm.anaesSummary.anesthetistId || !vm.anaesSummary.operaDate)) {
                toastr.warning('红色为必填项，请完整填写文书信息');
                return;
            }
            if (type == 'print') {
                if (vm.anaesSummary.processState == 'END')
                    $scope.$emit('doc-print');
                else
                    confirm.show('打印的文书将归档，且不可编辑，是否继续打印？').then(function(data) { submit(processState, type); });
            } else {
                if (vm.anaesSummary.processState == 'END')
                    submit(processState);
                else
                    confirm.show('提交的文书将归档，并且不可编辑，是否继续提交？').then(function(data) { submit(processState, type); });
            }
        } else
            submit(processState);
    };

    function submit(processState, state) {
        var anaesSummary = angular.copy(vm.anaesSummary),
            venipuncture1 = angular.copy(vm.venipuncture),
            anaesSummaryAppendixVisit = angular.copy(vm.anaesSummaryAppendixVisit),
            allergicReact1 = angular.copy(vm.allergicReact);
        anaesSummary.processState = processState;
        if (vm.venipuncture && vm.venipuncture.venipunctureTime)
            venipuncture1.venipunctureTime = new Date($filter('date')(new Date(vm.venipuncture.venipunctureTime), 'yyyy-MM-dd HH:mm')).getTime();
        if (vm.allergicReact && vm.allergicReact.allergicReactionTime)
            allergicReact1.allergicReactionTime = new Date($filter('date')(new Date(vm.allergicReact.allergicReactionTime), 'yyyy-MM-dd HH:mm')).getTime();
        //translate
        if ($scope.docInfo.beCode === 'yxyy' || $scope.docInfo.beCode == 'cshtyy'|| $scope.docInfo.beCode == 'llzyyy')
            vm.spinalCanalPuncture.puncBodyPoint = vm.spinalCanalPuncture.puncBodyPoint.join();

        anaesSummary.anaesDocList = [anaesSummary.anesthetistId];
        IHttp.post('document/saveAnaesSummaryDetail', {
            anaesSummary: anaesSummary,
            nerveBlock: vm.nerveBlock,
            generalAnaes: vm.generalAnaes,
            spinalCanalPuncture: vm.spinalCanalPuncture,
            allergicReact: allergicReact1,
            anaesSummaryAppendixVisit: anaesSummaryAppendixVisit,
            venipuncture: venipuncture1
        }).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            toastr.success(rs.data.resultMessage);
            vm.anaesSummary.processState = processState;
            $scope.processState = processState;
            if ($scope.docInfo.beCode === 'yxyy' || $scope.docInfo.beCode == 'cshtyy'|| $scope.docInfo.beCode == 'llzyyy')
                vm.spinalCanalPuncture.puncBodyPoint = vm.spinalCanalPuncture.puncBodyPoint.split(',');

            if (state == 'print') {
                $scope.$emit('end-print');
            } else {
                $scope.$emit('processState', $scope.processState);
            }
        });
    }

    function saveAs() {
        var scope = $rootScope.$new();
        scope.mark = '麻醉总结';
        scope.text = vm.anaesSummary.anestSummary;
        scope.tempType = 2;
        $uibModal.open({
            animation: true,
            template: require('./modal/saveAsTemp.html'),
            controller: require('./modal/saveAsTemp.controller'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        }).result.then((rs) => {
            // initData();
        }, (err) => {

        })
    }

    function appTemplat() {
        var scope = $rootScope.$new();
        scope.mark = '麻醉总结';
        scope.tempType = 2;
        $uibModal.open({
            animation: true,
            size: 'lg',
            template: require('./modal/applyPackDialog.html'),
            controller: require('./modal/applyPackDialog.controller'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        }).result.then((rs) => {
            if (rs != 'cancel')
                vm.anaesSummary.anestSummary = rs.tempContent
        }, (err) => {});
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

    $scope.$on('saveAs', () => {
        saveAs();
    });

    $scope.$on('appTemplat', () => {
        appTemplat();
    });
}