CheckRecordLogQnzCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'select', 'toastr', 'confirm', '$uibModal', '$timeout', '$filter', 'dateFilter', 'auth'];

module.exports = CheckRecordLogQnzCtrl;

function CheckRecordLogQnzCtrl($rootScope, $scope, IHttp, select, toastr, confirm, $uibModal, $timeout, $filter, dateFilter, auth) {
    let vm = this;
    let docId, isLocalAnaes, messageDialog = true;
    let firstAdd = 0;

    $scope.setting = $rootScope.$state.current.data;
    $scope.$emit('readonly', $scope.setting);
    $scope.docInfo = auth.loginUser();
    $scope.saveActive = auth.getDocAuth();

    var qxIndex = 0,
        flIndex = 0,
        qxLen = 28,
        flLen = 20;
    vm.item = []; //用于打印的list

    vm.pageSize = 30;
    select.getNurses().then((rs) => {
        if (rs.status === 200 && rs.data.resultCode === '1') {
            $scope.nurseList = rs.data.userItem;
        }
    })

    select.getOperators().then((rs) => {
        if (rs.length <= 0)
            return;
        $scope.operaList = rs;
    });

    function initData(isSynchrodata) {
        $scope.circunurseNames = '';
        $scope.instrnuseNames = '';
        $scope.optBodyNames = '';
        $scope.anaesMethodNames = '';
        $scope.operationNames = '';
        var params = {
            regOptId: $rootScope.$stateParams.regOptId,
            type: '0'
        };
        if (isSynchrodata) {
            params.type = '1';
        }
        IHttp.post('document/searchOptNurseByRegOptId', params).then((rs) => {
            vm.regOpt = rs.data.searchRegOptByIdFormBean;
            isLocalAnaes = vm.regOpt.isLocalAnaes;
            vm.optNurseItem = rs.data.optNurseItem;
            if (vm.optNurseItem.shiftInstrnuseTime)
                vm.optNurseItem.shiftInstrnuseTime = dateFilter(new Date(vm.optNurseItem.shiftInstrnuseTime), 'yyyy-MM-dd HH:mm');
            if (vm.optNurseItem.shiftCircunurseTime)
                vm.optNurseItem.shiftCircunurseTime = dateFilter(new Date(vm.optNurseItem.shiftCircunurseTime), 'yyyy-MM-dd HH:mm');
            $scope.processState = vm.optNurseItem.processState;
            $scope.$emit('isLocalAnaes', isLocalAnaes);
            $scope.$emit('processState', $scope.processState);
            vm.qxArr = rs.data.instrubillItem1;
            for (qxData of vm.qxArr) {
                if (!qxData.origamount && !qxData.inadd && !qxData.cloBeBody && !qxData.cloAfBody && qxData.instruItemId && qxData.instruItemName) {
                    if (qxData.origamount != 0 && qxData.origamount != '') {
                        qxData.slash = '/';
                    } else if (firstAdd == 1) {
                        qxData.origamount = '';
                    }
                }
                if ($scope.docInfo.beCode == 'yxyy') {
                    if (qxData.origamount == 0)
                        qxData.origamount = "";
                    if (qxData.inadd == 0)
                        qxData.inadd = "";
                    if (qxData.cloBeBody == 0)
                        qxData.cloBeBody = "";
                    if (qxData.cloAfBody == 0)
                        qxData.cloAfBody = "";
                } else if ($scope.docInfo.beCode == 'qnzzyyy') {
                    if (qxData.origamount > 0) {
                        if (!qxData.hollowViscus)
                            qxData.hollowViscus = qxData.origamount;
                        if (!qxData.cloBeBody)
                            qxData.cloBeBody = qxData.origamount;
                        if (!qxData.cloAfBody)
                            qxData.cloAfBody = qxData.origamount;
                    }
                }
            }
            qxIndex = vm.qxArr.length;
            vm.flArr = rs.data.instrubillItem2;
            for (flData of vm.flArr) {
                if (!flData.origamount && !flData.inadd && !flData.cloBeBody && !flData.cloAfBody && flData.instruItemId && flData.instruItemName) {
                    if (flData.origamount != 0 && flData.origamount != '') {
                        flData.slash = '/';
                    } else if (firstAdd == 1) {
                        flData.origamount = '';
                    }
                }
                if ($scope.docInfo.beCode == 'yxyy') {
                    if (flData.origamount == 0)
                        flData.origamount = "";
                    if (flData.inadd == 0)
                        flData.inadd = "";
                    if (flData.cloBeBody == 0)
                        flData.cloBeBody = "";
                    if (flData.cloAfBody == 0)
                        flData.cloAfBody = "";
                } else if ($scope.docInfo.beCode == 'qnzzyyy') {
                    if (flData.origamount > 0) {
                        if (!flData.hollowViscus)
                            flData.hollowViscus = flData.origamount;
                        if (!flData.cloBeBody)
                            flData.cloBeBody = flData.origamount;
                        if (!flData.cloAfBody)
                            flData.cloAfBody = flData.origamount;
                    }
                }
            }
            flIndex = vm.flArr.length;
            addEmpty();
            if (isSynchrodata && rs.data.resultCode === '1') toastr.success('数据同步完成！');
        });
    }

    function addEmpty() {
        while (vm.qxArr.length < qxLen) {
            vm.qxArr.push('');
        }
        while (vm.flArr.length < flLen) {
            vm.flArr.push('');
        }
    }

    // 删除单个器械
    vm.deleteInstrsuit = function(item) {
        confirm.show('确定要删除 ' + item.instruItemName + ' 吗？').then(function() {
            IHttp.post('document/deleteInstrubillItem', {
                instruItemId: item.instruItemId
            }).then((rs) => {
                if (rs.status === 200 && rs.data.resultCode === '1') {
                    initData();
                }
            }, () => {

            });
        });
    }

    // 提交
    function submit(processState, type) {
        var optNurse = angular.copy(vm.optNurseItem);
        optNurse.processState = processState;

        optNurse.shiftInstrnuseTime = new Date($filter('date')(new Date(optNurse.shiftInstrnuseTime), 'yyyy-MM-dd HH:mm')).getTime();
        optNurse.shiftCircunurseTime = new Date($filter('date')(new Date(optNurse.shiftCircunurseTime), 'yyyy-MM-dd HH:mm')).getTime();
        vm.instrubillItem = [];
        for (let qx of vm.qxArr) {
            vm.instrubillItem.push(qx);
        }
        for (let fl of vm.flArr) {
            vm.instrubillItem.push(fl);
        }
        IHttp.post('document/updateOptNurse', {
            optNurse: optNurse,
            instrubillItems: vm.instrubillItem.filter(function(item) {
                    return item.instrumentId;
                }) //这里要去空值
        }).then((rs) => {
            if (rs.data.resultCode != 1) return;
            if (messageDialog)
                toastr.success(rs.data.resultMessage);
            vm.optNurseItem.processState = processState;
            $scope.processState = processState;
            initData();
            messageDialog = true;
            if (type === 'print') {
                $scope.$emit('end-print');
            } else {
                $scope.$emit('processState', processState);
            }
        });
    }

    function save(processState, type) {
        $scope.verify = processState == 'END';
        if (processState == 'END') {
            if ($scope.docInfo.beCode !== 'syzxyy' && $scope.docInfo.beCode != 'cshtyy' && $scope.docInfo.beCode != 'llzyyy' && vm.optNurseItem.circunurseList.length <= 0) {
                toastr.warning('请输入必填项信息');
                return;
            }
            if (type == 'print') {
                if (vm.optNurseItem.processState == 'END')
                    $scope.$emit('doc-print');
                else
                    confirm.show('打印的文书将归档，且不可编辑，是否继续打印？').then(function(data) { submit(processState, type); });
            } else {
                if (vm.optNurseItem.processState == 'END')
                    submit(processState);
                else
                    confirm.show('提交的文书将归档，并且不可编辑，是否继续提交？').then(function(data) { submit(processState, type); });
            }
        } else
            submit(processState);
    }

    // IHttp.post('operCtl/startOper', { regOptId: $rootScope.$stateParams.regOptId }).then((rs) => {
    //     if (rs.data.resultCode === '1') {
    //         docId = rs.data.anaesRecord.anaRecordId;
    //     }
    // });

    function insertIns(type) {
        let scope = $rootScope.$new();
        let url = 'addInstrsuit';
        if (type === 'instrumentopr') {
            url = 'addInstOpr';
            firstAdd = 1;
        }
        scope.type = type;
        scope.optNurseId = vm.optNurseItem.optNurseId;
        let empNo;
        $uibModal.open({
            animation: true,
            template: require('./modal/addInstrsuit/' + url + '.html'),
            controller: require('./modal/addInstrsuit/addInstrsuit_nhfe.controller'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        }).result.then((rs) => {
            initData();
        }, (err) => {

        })
    }

    function clearFn() {
        // for(var i=0;i<vm.qxArr.length;i++){
        //    vm.qxArr[i]="";
        // }
        // for(var i=0;i<vm.flArr.length;i++){
        //    vm.flArr[i]="";
        // }
        confirm.show('确定要删除所有器械、敷料吗？').then(function() {
            IHttp.post('document/deleteInstrubillItem', {
                // instruItemId: item.instruItemId
                emptyFlag: 1,
                regOptId: vm.optNurseItem.regOptId

            }).then((rs) => {
                if (rs.status === 200 && rs.data.resultCode === '1') {
                    initData();
                }
            }, (rs) => {

            });
        });
    }
    if ($scope.docInfo.beCode !== 'syzxyy' && $scope.docInfo.beCode != 'cshtyy') {
        $timeout(function() {
            $scope.$watch('vm.optNurseItem.instrnuseList', function(signName, o) {
                $scope.hasInstrnuseSig = false;
                $scope.eSignatureInstrnuseList = [];
                angular.forEach($scope.nurseList, function(item) {
                    for (var sign of signName) {
                        if (item.userName == sign) {
                            if (!$scope.hasInstrnuseSig)
                                $scope.hasInstrnuseSig = item.picPath ? true : false;
                            $scope.eSignatureInstrnuseList.push({ hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime() });
                        }
                    }
                })
            }, true)
            $scope.$watch('vm.optNurseItem.shiftInstrnuseList', function(signName, o) {
                $scope.hasShiftInstrnuseSig = false;
                $scope.eSignatureShiftInstrnuseList = [];
                angular.forEach($scope.nurseList, function(item) {
                    for (var sign of signName) {
                        if (item.userName == sign) {
                            if (!$scope.hasShiftInstrnuseSig)
                                $scope.hasShiftInstrnuseSig = item.picPath ? true : false;
                            $scope.eSignatureShiftInstrnuseList.push({ hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime() });
                        }
                    }
                })
            }, true)
            $scope.$watch('vm.optNurseItem.circunurseList', function(signName, o) {
                $scope.hasCircunurseSig = false;
                $scope.eSignatureCircunurseList = [];
                angular.forEach($scope.nurseList, function(item) {
                    for (var sign of signName) {
                        if (item.userName == sign) {
                            if (!$scope.hasCircunurseSig)
                                $scope.hasCircunurseSig = item.picPath ? true : false;
                            $scope.eSignatureCircunurseList.push({ hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime() });
                        }
                    }
                })
            }, true)
            $scope.$watch('vm.optNurseItem.shiftCircunurseList', function(signName, o) {
                $scope.hasShiftCircunurseSig = false;
                $scope.eSignatureShiftCircunurseList = [];
                angular.forEach($scope.nurseList, function(item) {
                    for (var sign of signName) {
                        if (item.userName == sign) {
                            if (!$scope.hasShiftCircunurseSig)
                                $scope.hasShiftCircunurseSig = item.picPath ? true : false;
                            $scope.eSignatureShiftCircunurseList.push({ hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime() });
                        }
                    }
                })
            }, true)
        }, 1000);
    } else {
        $timeout(function() {
            $scope.$watch('vm.optNurseItem.instrnuseList', function(signName, o) { //器械护士签名
                $scope.hasInstrnuseSig = false;
                $scope.eSignatureInstrnuseList = [];
                angular.forEach($scope.nurseList, function(item) {
                    for (var sign of signName) {
                        if (item.userName == sign) {
                            if (!$scope.hasInstrnuseSig)
                                $scope.hasInstrnuseSig = item.picPath ? true : false;
                            $scope.eSignatureInstrnuseList.push({ hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime() });
                        }
                    }
                })
            }, true)
            $scope.$watch('vm.optNurseItem.circunurseList', function(signName, o) { //巡回护士签名
                $scope.hasCircunurseSig = false;
                $scope.eSignatureCircunurseList = [];
                angular.forEach($scope.nurseList, function(item) {
                    for (var sign of signName) {
                        if (item.userName == sign) {
                            if (!$scope.hasCircunurseSig)
                                $scope.hasCircunurseSig = item.picPath ? true : false;
                            $scope.eSignatureCircunurseList.push({ hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime() });
                        }
                    }
                })
            }, true)
            $scope.$watch('vm.optNurseItem.operDoctorList', function(signName, o) { //手术医生签名
                $scope.hasOperDoctorSig = false;
                $scope.eSignatureOperDoctorList = [];
                angular.forEach($scope.nurseList, function(item) {
                    for (var sign of signName) {
                        if (item.userName == sign) {
                            if (!$scope.hasOperDoctorSig)
                                $scope.hasOperDoctorSig = item.picPath ? true : false;
                            $scope.eSignatureOperDoctorList.push({ hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime() });
                        }
                    }
                })
            }, true)
            $scope.$watch('vm.optNurseItem.midCircunurseList', function(signName, o) { //接班巡回护士签名
                $scope.hasMidCircunurseSig = false;
                $scope.eSignatureMidCircunurseList = [];
                angular.forEach($scope.nurseList, function(item) {
                    for (var sign of signName) {
                        if (item.userName == sign) {
                            if (!$scope.hasMidCircunurseSig)
                                $scope.hasMidCircunurseSig = item.picPath ? true : false;
                            $scope.eSignatureMidCircunurseList.push({ hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime() });
                        }
                    }
                })
            }, true)
            $scope.$watch('vm.optNurseItem.shiftCircunurseList', function(signName, o) { //接班巡回护士签名
                $scope.hasShiftCircunurseListSig = false;
                $scope.eSignatureShiftCircunurseList = [];
                angular.forEach($scope.nurseList, function(item) {
                    for (var sign of signName) {
                        if (item.userName == sign) {
                            if (!$scope.hasShiftCircunurseListSig)
                                $scope.hasShiftCircunurseListSig = item.picPath ? true : false;
                            $scope.eSignatureShiftCircunurseList.push({ hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime() });
                        }
                    }
                })
            }, true)
        }, 1000);
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
        initData(true);
    })
    $scope.$on('clear', () => {
        clearFn()
    })
    $scope.$on('addInst', (event, type) => {
        messageDialog = false;
        if ($scope.saveActive && $scope.processState == 'END')
            save('END');
        else
            save('NO_END');
        insertIns(type);
    })

    $scope.$on('addInsf', (event, type) => {
        messageDialog = false;
        if ($scope.saveActive && $scope.processState == 'END')
            save('END');
        else
            save('NO_END');
        insertIns(type);
    })

    $scope.$on('addInsOpr', (event, type) => {
        messageDialog = false;
        if ($scope.saveActive && $scope.processState == 'END')
            save('END');
        else
            save('NO_END');
        insertIns(type);
    })
    initData();
}
