NursRecordLogCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'select', '$q', 'toastr', 'confirm', '$window', '$timeout', '$uibModal', '$filter', 'auth'];

module.exports = NursRecordLogCtrl;

function NursRecordLogCtrl($rootScope, $scope, IHttp, select, $q, toastr, confirm, $window, $timeout, $uibModal, $filter, auth) {
    let vm = this;
    let regOptId = $rootScope.$stateParams.regOptId;
    $scope.setting = $rootScope.$state.current.data;
    $scope.docInfo = auth.loginUser();
    $scope.$emit('readonly', $scope.setting);
    $scope.saveActive = auth.getDocAuth();
    $scope.venousInfusion2List =[{codeName:"液体通畅"},{codeName:"余液：复方氯化钠 ml，液体通畅"},{codeName:"余液：聚明胶肽 ml，液体通畅"},{codeName:"余液：复方氯化钠 ml，聚明胶肽 ml，液体通畅"}];

    initData();

    $scope.getOperdefList = function(query) {
        return select.getOperdefList(query);
    }

    select.getAnaesMethodList().then((rs) => {
        $scope.anaesMethodList = rs.data.resultList;
    });

    IHttp.post('basedata/searchSysCodeByGroupId', { groupId: 'blood_type' }).then(function(result) {
        $scope.bloodList = result.data.resultList;
    });

    function initData(callback, type) {
        IHttp.post('document/searchOptCareRecordByRegOptId', { regOptId: regOptId, type: type })
            .then((rs) => {
                vm.regOpt = rs.data.searchRegOptByIdFormBean;
                vm.optCareRecord = rs.data.optCareRecord;
                $scope.processState = vm.optCareRecord.processState;
                $scope.$emit('processState', $scope.processState);
                if(!!vm.optCareRecord.inspection){
                    if(vm.optCareRecord.inspection==1){
                        vm.optCareRecord.inspection=['1','0'];
                    }else if(vm.optCareRecord.inspection==2){
                        vm.optCareRecord.inspection=['0','2'];
                    }else if((vm.optCareRecord.inspection+"").length===3){
                        vm.optCareRecord.inspection=vm.optCareRecord.inspection.split(',');
                    }
                }else{
                    vm.optCareRecord.inspection=['0','0'];
                }
                vm.optCareRecord.skin1 = vm.optCareRecord.skin1 ? JSON.parse(vm.optCareRecord.skin1) : {};
                vm.optCareRecord.skin2 = vm.optCareRecord.skin2 ? JSON.parse(vm.optCareRecord.skin2) : {};
                 vm.optCareRecord.bloodConstituent = vm.optCareRecord.bloodConstituent ? JSON.parse(vm.optCareRecord.bloodConstituent) : {};
                vm.optCareRecord.negativePosition = vm.optCareRecord.negativePosition ? JSON.parse(vm.optCareRecord.negativePosition) : {};
                vm.optCareRecord.tourniquet = vm.optCareRecord.tourniquet ? JSON.parse(vm.optCareRecord.tourniquet) : {};
                vm.optCareRecord.supportMaterial = vm.optCareRecord.supportMaterial ? JSON.parse(vm.optCareRecord.supportMaterial) : {};
                vm.optCareRecord.implants = vm.optCareRecord.implants ? JSON.parse(vm.optCareRecord.implants) : {};
                vm.optCareRecord.venousInfusion2 = vm.optCareRecord.venousInfusion2 ? JSON.parse(vm.optCareRecord.venousInfusion2) : {};
                if(vm.optCareRecord.venousInfusion2.a && vm.optCareRecord.venousInfusion2.a.content){
                    if(vm.optCareRecord.venousInfusion2.a.content.indexOf('{')>-1)
                        vm.optCareRecord.venousInfusion2.a.content = JSON.parse(vm.optCareRecord.venousInfusion2.a.content);
                    else
                        vm.optCareRecord.venousInfusion2.a.content = {"codeName":vm.optCareRecord.venousInfusion2.a.content};
                }
                vm.sensesList = rs.data.sensesList;
                if (callback) callback();
            });
    }

    select.getNurses().then((rs) => {
        if (rs.status === 200 && rs.data.resultCode === '1') {
            $scope.nurseList = rs.data.userItem;
        }
    })

    select.getOptBody().then((rs) => {
        if (rs.status === 200 && rs.data.resultCode === '1') {
            $scope.optBodyList = rs.data.resultList;
        }
    })

    $scope.$watch('vm.optCareRecord.allergic', function(index) {
        if (index === 2) {
            vm.optCareRecord.allergicContents = '';
        }
    });

    $timeout(function() {
        $scope.$watch('vm.optCareRecord.instrnurseList', function(signName, o) {
            $scope.hasSig = false;
            if (!signName) return;
            $scope.eSignatureInstrnurseList = [];
            angular.forEach($scope.nurseList, function(item) {
                for (var sign of signName) {
                    if (item.userName == sign) {
                        $scope.hasSig = item.picPath ? true : false;
                        $scope.eSignatureInstrnurseList.push({hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime()});
                    }
                }
            })
        }, true)
    }, 1000);

    $timeout(function() {
        $scope.$watch('vm.optCareRecord.shiftChangedNurseList', function(signName, o) {
            $scope.hasSig1 = false;
            if (!signName) return;
            $scope.eSignatureInstrnurseList = [];
            angular.forEach($scope.nurseList, function(item) {
                for (var sign of signName) {
                    if (item.userName == sign) {
                        $scope.hasSig1 = item.picPath ? true : false;
                        $scope.eSignatureInstrnurseList.push(item.picPath + '?t=' + new Date().getTime());
                    }
                }
            })
        }, true)
    }, 1000);

    $timeout(function() {
        $scope.$watch('vm.optCareRecord.operrommJieNurseList', function(signName, o) {
            $scope.hasSig2 = false;
            if (!signName) return;
            $scope.eSignatureInstrnurseList2 = [];
            angular.forEach($scope.nurseList, function(item) {
                for (var sign of signName) {
                    if (item.userName == sign) {
                        $scope.hasSig2 = item.picPath ? true : false;
                        $scope.eSignatureInstrnurseList2.push(item.picPath + '?t=' + new Date().getTime());
                    }
                }
            })
        }, true)
    }, 1000);

    $scope.$watch('vm.optCareRecord.preoperativeMedication', function(n, o) {
        if (n && n ===2){
            vm.optCareRecord.medicationUsed=undefined;
        }
    });

    select.sysCodeBy('leaveToNursRecord').then((rs) => {
        if (rs.status === 200 && rs.data.resultCode === '1') {
            $scope.leaveToList = rs.data.resultList;
        }
    });

    //术后静脉输液
    $scope.$watch('vm.optCareRecord.venousInfusion2.a.checked', function(n, o) {
        if (n && n != 1) {
            vm.optCareRecord.venousInfusion2.a.content = '';
        }
    });
    //止血带
    $scope.$watch('vm.optCareRecord.tourniquet.a.checked', function(n, o) {
        if (n && n !== '1') {
            vm.optCareRecord.tourniquet.a.content = '';
        }
    });
    vm.clearNegativePosition = function() {
        if (vm.optCareRecord.negativePosition.f)
            vm.optCareRecord.negativePosition.f.content = '';
        vm.optCareRecord.negativePosition.a.checked = '0';
        vm.optCareRecord.negativePosition.b.checked = '0';
        vm.optCareRecord.negativePosition.c.checked = '0';
        vm.optCareRecord.negativePosition.d.checked = '0';
        vm.optCareRecord.negativePosition.e.checked = '0';
        vm.optCareRecord.negativePosition.f.checked = '0';
    }
    vm.clearSupportMaterial = function() {
        if (vm.optCareRecord.supportMaterial.i)
            vm.optCareRecord.supportMaterial.i.content = '';
        vm.optCareRecord.supportMaterial.a.checked = '0';
        vm.optCareRecord.supportMaterial.b.checked = '0';
        vm.optCareRecord.supportMaterial.c.checked = '0';
        vm.optCareRecord.supportMaterial.d.checked = '0';
        vm.optCareRecord.supportMaterial.e.checked = '0';
        vm.optCareRecord.supportMaterial.f.checked = '0';
        vm.optCareRecord.supportMaterial.g.checked = '0';
        vm.optCareRecord.supportMaterial.h.checked = '0';
        vm.optCareRecord.supportMaterial.i.checked = '0';
    }
    vm.allergic = function(event) { // 药物过敏
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            template: require('./modal/setAllergic/allergicDialog.html'),
            controller: require('./modal/setAllergic/allergicDialog.controller.js'),
            less: require('./modal/setAllergic/allergicDialog.less'),
            resolve: { param: { allergic: vm.optCareRecord.allergicContents } }
        }).result.then(function(rs) {
            vm.optCareRecord.allergicContents = rs;
        });
    }

    vm.specimenChange = function(){
        if(vm.optCareRecord.specimen!=='1'){
            vm.optCareRecord.specimenName = '';
            vm.optCareRecord.inspection=['0','0']
        }        
    }

    vm.pipe = function(event) { // 管道
        let options = {
            animation: true,
            backdrop: 'static',
            template: require('./modal/setPipe/pipeDialog.html'),
            controller: require('./modal/setPipe/pipeDialog.controller.js'),
            less: require('./modal/setPipe/pipeDialog.less'),
            resolve: { param: { pipe: vm.optCareRecord.pipeline } }
        }
        if ($scope.docInfo.beCode === 'syzxyy' || $scope.docInfo.beCode == 'cshtyy'|| $scope.docInfo.beCode == 'llzyyy') {
            options.template = require('./modal/setPipe/pipeDialog_syzxyy.html');
            options.controller = require('./modal/setPipe/pipeDialog_syzxyy.controller.js');
            options.resolve = { param: { pipe: vm.optCareRecord.pipeline, other: vm.optCareRecord.pipelineOther } }
        }
        $uibModal.open(options).result.then(function(rs) {
            if ($scope.docInfo.beCode === 'syzxyy' || $scope.docInfo.beCode == 'cshtyy'|| $scope.docInfo.beCode == 'llzyyy') {
                vm.optCareRecord.pipeline = rs.pipeStr;
                vm.optCareRecord.pipelineOther = rs.other;
            }else {
                vm.optCareRecord.pipeline = rs;
            }
        });
    }

    vm.plantObj = function(event) { // 体内植入物
        let options = {
            animation: true,
            backdrop: 'static',
            template: require('./modal/setPlant/plantDialog.html'),
            controller: require('./modal/setPlant/plantDialog.controller.js'),
            less: require('./modal/setPlant/plantDialog.less'),
            resolve: { param: { plant: vm.optCareRecord.implants.a.content } }
        }
        if ($scope.docInfo.beCode === 'syzxyy' || $scope.docInfo.beCode == 'cshtyy'|| $scope.docInfo.beCode == 'llzyyy') {
            options.template = require('./modal/setPlant/plantDialog_syzxyy.html');
            options.controller = require('./modal/setPlant/plantDialog_syzxyy.controller.js');
            options.resolve = { param: { plant: vm.optCareRecord.implants.a.content, other: vm.optCareRecord.implantsOther } }
        }
        console.log(options);
        $uibModal.open(options).result.then(function(rs) {
            if ($scope.docInfo.beCode === 'syzxyy' || $scope.docInfo.beCode == 'cshtyy'|| $scope.docInfo.beCode == 'llzyyy') {
                vm.optCareRecord.implants.a.content = rs.plantStr;
                vm.optCareRecord.implantsOther = rs.other;
            }else {
                vm.optCareRecord.implants.a.content = rs;
            }
        });

    }

    vm.postPipe = function(event) { // 引流管
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            template: require('./modal/setPostPipe/postPipeDialog.html'),
            controller: require('./modal/setPostPipe/postPipeDialog.controller.js'),
            less: require('./modal/setPostPipe/postPipeDialog.less'),
            resolve: { param: { postPipe: vm.optCareRecord.drainageTube } }
        }).result.then(function(rs) {
            vm.optCareRecord.drainageTube2 = rs;
            vm.optCareRecord.drainageTube = vm.optCareRecord.drainageTube2;
        });
    }
    vm.querySearch = function(query) {
        var deferred = $q.defer();
        deferred.resolve(['成人上肢：≤ 30 kpa. 部位：肱骨上1/3处', '成人下肢：≤ 60 kpa. 部位：大腿根部', '儿童上肢：≤15kpa  部位：肱骨上1/3处', '儿童下肢：≤30kpa  部位：大腿根部']);
        return deferred.promise;
    }



    function refresh() {
        var backData = angular.copy(vm.optCareRecord);
        var updateArray = ['operStartTime',
            'inOperRoomTime',
            'operEndTime',
            'outOperRoomTime',
            'operationNameList',
            'designedAnaesMethod',
            'totalIn',
            'totalOut',
            'urine',
            'bleeding',
            'hematocele',
            'outOther',
            'infusion',
            'blood',
            'leaveTo',
            'anaesMethodName'
        ];
        angular.forEach(backData, function(val, key) {
            if (updateArray.indexOf(key) !== -1) {
                delete backData[key];
            }
        });
        initData(function() {
            angular.extend(vm.optCareRecord, backData);
            toastr.success("数据同步完成！");
        }, '1');
    }

    function submit(processState, type) {
        let params = angular.copy(vm.optCareRecord);
        if (!params.operationNameList)
            params.operationNameList = [];
        params.processState = processState;
        params.shiftTime = new Date(params.shiftTime);
        params.drainageTube = undefined;
        params.bloodConstituent=JSON.stringify(params.bloodConstituent);
        if(params.venousInfusion2 && params.venousInfusion2.a && params.venousInfusion2.a.content){            
                params.venousInfusion2.a.content = JSON.stringify(params.venousInfusion2.a.content);
        }
        params.inspection = params.inspection.join();
       // params.venousInfusion2=JSON.stringify(params.venousInfusion2);

        IHttp.post('document/updateOptCareRecord', params).then((res) => {
            if (res.data.resultCode != 1) {
                toastr.success(res.data.resultMessage);
                return;
            }
            toastr.success(res.data.resultMessage);
            vm.optCareRecord.processState = processState;
            $scope.processState = processState;
            if (type === 'print') {
                $scope.$emit('end-print');
            } else {
                $scope.$emit('processState', processState);
            }
        });
    }

    function save(processState, type) {
        $scope.verify = processState == 'END';
        if (processState === 'END') {
            if (!vm.optCareRecord.inOperRoomTime || !vm.optCareRecord.outOperRoomTime || !vm.optCareRecord.leaveTo ) {
                toastr.warning('请输入必填项信息');
                return;
            }
            if(vm.optCareRecord.instrnurseList.length <= 0 && $scope.docInfo.beCode!='yxyy'){
                toastr.warning('请输入手术室巡回护士');
                return;
            }
            if (type == 'print') {
                if (vm.optCareRecord.processState === 'END')
                    $scope.$emit('doc-print');
                else
                    confirm.show('打印的文书将归档，且不可编辑，是否继续打印？').then(function(data) { submit(processState, type); });
            } else {
                if (vm.optCareRecord.processState === 'END')
                    submit(processState);
                else
                    confirm.show('提交的文书将归档，并且不可编辑，是否继续提交？').then(function(data) { submit(processState, type); });
            }
        } else
            submit(processState);
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

    $scope.$on('refresh', () => {
        refresh();
    })

    $scope.$on('onAKeyPrint', () => {
        onAKeyPrint();
    })

    function onAKeyPrint() { // 一键打印
        // if (operState == '04') {
        //     toastr.warning('手术还未结束，无法打印');
        //     return;
        // }
        var scope = $rootScope.$new();
        scope.row = vm.regOpt;
        scope.user = auth.loginUser();
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            template: require('../../oper/modal/print.html'),
            controller: require('../../oper/modal/print.controller.js'),
            scope: scope
        }).result.then(function() {}, function() {});
    }
}