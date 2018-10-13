CheckRecordLogCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'select', 'toastr', 'confirm', '$uibModal', '$timeout', '$filter', 'dateFilter', 'auth'];

module.exports = CheckRecordLogCtrl;

function CheckRecordLogCtrl($rootScope, $scope, IHttp, select, toastr, confirm, $uibModal, $timeout, $filter, dateFilter, auth) {
    let vm = this;
    let docId;
    $scope.setting = $rootScope.$state.current.data;
    $scope.$emit('readonly', $scope.setting);
    $scope.onlyRead = false;
    $scope.docInfo = auth.loginUser();

    vm.item = []; //用于打印的list

    vm.pageSize = 30;
    vm.onObjPrint = false;
    select.getNurses().then((rs) => {
        if (rs.status === 200 && rs.data.resultCode === '1') {
            $scope.nurseList = rs.data.userItem;
        } else {
            toastr.error(rs.data.resultMessage);
        }
    })

    $scope.getOperdefList = function(query) {
        return select.getOperdefList(query);
    }

    vm.changePreOperSkin = function() {
        vm.optNurseItem.preOperSkinDetails = '';
    }

    vm.changePostOperSkin = function() {
        vm.optNurseItem.postOperSkinDetails = '';
    }

    vm.changeCatheterization = function() {
        if (vm.optNurseItem.catheterization == 2)
            vm.optNurseItem.urine = '';
    }

    select.getAnaesMethodList().then((rs) => {
        $scope.anaesMethodList = rs.data.resultList;
    })

    select.getOptBody().then((rs) => {
        if (rs.status === 200 && rs.data.resultCode === '1') {
            $scope.optBodyList = rs.data.resultList;
        } else {
            toastr.error(rs.data.resultMessage);
        }
    })
    $timeout(function() {
        $scope.$watch('vm.optNurseItem.instrnuseList', function(n, o) {
            $scope.hasSig_1 = false;
            $scope.eSignatureAnesthetist_1 = [];
            angular.forEach(n, function(bigItem) {
                angular.forEach($scope.nurseList, function(item) {
                    if (item.userName == bigItem) {
                        if (!$scope.hasSig_1) {
                            $scope.hasSig_1 = item.picPath ? true : false;
                        }
                        $scope.eSignatureAnesthetist_1.push({ hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime() });
                    }
                })
            })

        }, true)
        $scope.$watch('vm.optNurseItem.circunurseList', function(n, o) {
            $scope.hasSig_2 = false;
            $scope.eSignatureAnesthetist_2 = [];
            angular.forEach(n, function(bigItem) {
                angular.forEach($scope.nurseList, function(item) {
                    if (item.userName == bigItem) {
                        if (!$scope.hasSig_2) {
                            $scope.hasSig_2 = item.picPath ? true : false;
                        }
                        $scope.eSignatureAnesthetist_2.push({ hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime() });
                    }
                })
            })
        }, true)
    }, 1000);
    vm.modelAnaesthetic = function(code) {
        // if (vm.regOpt.isLocalAnaes == '0') return;
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            size: 'lg',
            template: require('./modal/inputInfo/inputInfo.html'),
            controller: require('./modal/inputInfo/inputInfo.controller.js'),
            resolve: { items: { docId: docId, type: code } }
        }).result.then(function(rs) {
            if (code === '1') {
                vm.transfusionList = rs.list;
            } else {
                vm.bloodList = rs.list;
            }
        });
    }

    // 删除单个器械
    vm.deleteInstrsuit = function(item) {
        confirm.show('确定要删除 ' + item.instruItemName + ' 吗？').then(function() {
            IHttp.post('document/deleteInstrubillItem', {
                    instruItemId: item.instruItemId
                })
                .then((rs) => {
                        if (rs.status === 200 && rs.data.resultCode === '1') {
                            vm.instrubillItem = vm.instrubillItem.filter(function(i) {
                                return (i.instruItemId !== item.instruItemId) && i.instrumentId;
                            });
                            vm.itemLength--;
                            addEmpty();
                        }
                    },
                    () => {

                    });
        });
    }

    function addEmpty() {
        var emptyLength = vm.pageSize - vm.itemLength;
        if (emptyLength >= 0) vm.instrubillItem = vm.instrubillItem.concat(new Array(emptyLength));
        let length = vm.instrubillItem.length >= vm.pageSize ? vm.instrubillItem.length : vm.pageSize; //获得要渲染的真实数据长度
        //长度是3的倍数 不操作 余1 加2 余2加1 好补空格
        if (length % 3 == 1) {
            length = length + 2;
        } else if (length % 3 == 2) {
            length = length + 1
        }
        vm.item = [];
        for (var i = 0; i < length; i++) {
            if (i % 3 === 0)
                vm.item.push({ l: vm.instrubillItem[i], m: vm.instrubillItem[i + 1], r: vm.instrubillItem[i + 2] });
        }

    }

    $scope.$watch('vm.optNurseItem.operationNameList', function(event, data) {
        if (!event) return;
        vm.operationNames = "";
        if (event.length > 0) {
            for (obj of event) {
                vm.operationNames += obj.name + ' ';
            }
        }
    }, true);

    $scope.$watch('vm.optNurseItem.anaesMethodList', function(event, data) {
        if (!event) return;
        vm.anaesMethodNames = "";
        if (event.length > 0) {
            for (obj of event) {
                for (anaesMethod of $scope.anaesMethodList) {
                    if (anaesMethod.anaMedId == obj) {
                        vm.anaesMethodNames += anaesMethod.name + ' ';
                    }
                }
            }
        }
    }, true);

    $scope.$watch('vm.optNurseItem.optBodyList', function(event, data) {
        if (!event) return;
        vm.optBodyNames = "";
        if (event.length > 0) {
            for (obj of event) {
                for (optBody of $scope.optBodyList) {
                    if (optBody.codeValue == obj) {
                        vm.optBodyNames += optBody.codeName + ' ';
                    }
                }
            }
        }
    }, true);

    $scope.$watch('vm.optNurseItem.catheterizaSign', function(event, data) {
        if (!event) return;
        vm.catheterizaSign = getSign(event);
    }, true);
    $scope.$watch('vm.optNurseItem.postOperPathSign', function(event, data) {
        if (!event) return;
        vm.postOperPathSign = getSign(event);
    }, true);
    $scope.$watch('vm.optNurseItem.bloodSignList', function(event, data) {
        if (!event) return;
        vm.bloodSign = getSign(event);
    }, true);
    $scope.$watch('vm.optNurseItem.antibioticSign', function(event, data) {
        if (!event) return;
        vm.antibioticSign = getSign(event);
    }, true);
    $scope.$watch('vm.optNurseItem.instrnuseList', function(event, data) {
        if (!event) return;
        vm.instrnuseNames = getSign(event);
    }, true);

    $scope.$watch('vm.optNurseItem.circunurseList', function(event, data) {
        if (!event) return;
        vm.circunurseNames = getSign(event);
    }, true);

    function getSign(event) {
        var sign = "";
        if (Array.isArray(event) && event.length > 0) {
            for (var i = 0; i < event.length; i++) {
                for (var j = 0; j < $scope.nurseList.length; j++) {
                    if ($scope.nurseList[j].userName == event[i]) {
                        sign += $scope.nurseList[j].name + ' ';
                    }
                }
            }
        } else if (event.length > 0) {
            for (var i = 0; i < $scope.nurseList.length; i++) {
                if ($scope.nurseList[i].userName == event) {
                    sign += $scope.nurseList[i].name + ' ';
                }
            }
        }
        return sign;
    }

    // 提交
    function submit(procState, type) {
        vm.optNurseItem.processState = procState;
        var optNurse = angular.copy(vm.optNurseItem);
        if (vm.optNurseItem.inOperRoomTime)
            optNurse.inOperRoomTime = getTimestamp(vm.optNurseItem.inOperRoomTime);
        if (vm.optNurseItem.outOperRoomTime)
            optNurse.outOperRoomTime = getTimestamp(vm.optNurseItem.outOperRoomTime);
        if (vm.optNurseItem.outSickroomTime)
            optNurse.outSickroomTime = getTimestamp(vm.optNurseItem.outSickroomTime);
        if (vm.optNurseItem.backSickroomTime)
            optNurse.backSickroomTime = getTimestamp(vm.optNurseItem.backSickroomTime);
        if (vm.optNurseItem.catheterizaTime)
            optNurse.catheterizaTime = getTimestamp(vm.optNurseItem.catheterizaTime);
        if (vm.optNurseItem.postOperPathTime)
            optNurse.postOperPathTime = getTimestamp(vm.optNurseItem.postOperPathTime);
        if (vm.optNurseItem.bloodTime)
            optNurse.bloodTime = getTimestamp(vm.optNurseItem.bloodTime);
        if (vm.optNurseItem.antibioticTime)
            optNurse.antibioticTime = getTimestamp(vm.optNurseItem.antibioticTime);
        IHttp.post('document/updateOptNurse', {
            optNurse: optNurse,
            instrubillItems: vm.instrubillItem.filter(function(item) {
                return item.instrumentId;
            }) //这里要去空值
        }).then((rs) => {
            if (rs.status === 200 && rs.data.resultCode === '1') {
                toastr.success(rs.data.resultMessage);
                $scope.processState = vm.optNurseItem.processState;
                initPage(false);
                if (type === 'print') {
                    $scope.$emit('end-print');
                } else {
                    $scope.$emit('processState', vm.optNurseItem.processState);
                }
            } else {
                toastr.error(rs.data.resultMessage);
            }
        });
    }

    function save(processState, type) {
        $scope.verify = processState == 'END';
        if (processState === 'END' && vm.optNurseItem.operationNameList.length == 0) {
            toastr.warning("无手术名称，请同步数据！");
            return;
        }
        if (processState === 'END' && (!vm.optNurseItem.outOperRoomTime || !vm.optNurseItem.inOperRoomTime || !vm.optNurseItem.leaveTo || !vm.optNurseItem.anaesMethodList.length > 0)) {
            toastr.warning('请输入必填项信息');
            return;
        }
        if (vm.optNurseItem.processState === 'END' && processState === 'END') {
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
            if (vm.optNurseItem.processState === 'END') {
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

    function initPage(isSynchrodata) {
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
            console.log(rs.data)
            //判断接口调用是否成功
            if (isSynchrodata) {
                synchroData(rs.data.optNurseItem);
                formatTime(vm.optNurseItem);
                toastr.success("数据同步完成！");
            } else {
                vm.regOpt = rs.data.searchRegOptByIdFormBean;
                vm.regOptId = vm.regOpt.regOptId;
                vm.optNurseItem = rs.data.optNurseItem;
                vm.bloodTypeList = rs.data.bloodTypeList;
                vm.bloodList = rs.data.bloodList;
                vm.transfusionList = rs.data.transfusionList;
                vm.instrubillItem = rs.data.instrubillItem;

                $scope.processState = vm.optNurseItem.processState;
                $scope.$emit('processState', vm.optNurseItem.processState);
                vm.optNurseItem.preCircunurseList = [];
                vm.optNurseItem.midCircunurseList = [];
                vm.optNurseItem.postCircunurseList = [];
                formatTime(vm.optNurseItem);
                if (!angular.isArray(vm.optNurseItem.optBodyList)) {
                    vm.optNurseItem.optBodyList = [];
                } else {
                    angular.forEach($scope.optBodyList, function(optBody, index) {
                        if (vm.optNurseItem.optBody.indexOf(optBody.codeValue) >= 0) {
                            $scope.optBodyNames += optBody.codeName + ' ';
                        }
                    });
                }
                if (!angular.isArray(vm.optNurseItem.anaesMethodList)) {
                    vm.optNurseItem.anaesMethodList = [];
                } else {
                    angular.forEach($scope.anaesMethodList, function(anaesMethod, index) {
                        if (vm.optNurseItem.anaesMethodId.indexOf(anaesMethod.anaMedId) >= 0) {
                            $scope.anaesMethodNames += anaesMethod.name + ' ';
                        }
                    });
                }
                if (angular.isArray(vm.optNurseItem.operationNameList)) {
                    angular.forEach(vm.optNurseItem.operationNameList, function(operationName, index) {
                        $scope.operationNames += operationName.name + ' ';
                    });
                }
                if (!angular.isArray(vm.optNurseItem.circunurseList)) {
                    vm.optNurseItem.circunurseList = [];
                } else {
                    angular.forEach($scope.nurseList, function(nurse, index) {
                        if (vm.optNurseItem.circunurseId.indexOf(nurse.userName) >= 0) {
                            $scope.circunurseNames += nurse.name + ' ';
                        }
                    });
                }

                if (!angular.isArray(vm.optNurseItem.operationNameList)) {
                    vm.optNurseItem.operationNameList = [];
                }

                if (!angular.isArray(vm.optNurseItem.circunurseList)) {
                    vm.optNurseItem.circunurseList = [];
                }

                if (!angular.isArray(vm.optNurseItem.instrnuseList)) {
                    vm.optNurseItem.instrnuseList = [];
                } else {
                    angular.forEach($scope.nurseList, function(nurse, index) {
                        if (vm.optNurseItem.instrnuseId.indexOf(nurse.userName) >= 0) {
                            $scope.instrnuseNames += nurse.name + ' ';
                        }
                    });
                }
                vm.instrubillItem = rs.data.instrubillItem;
                vm.itemLength = vm.instrubillItem.length;
                addEmpty();
            }
        });
    }

    IHttp.post('operCtl/startOper', { regOptId: $rootScope.$stateParams.regOptId }).then((rs) => {
        if (rs.data.resultCode === '1') {
            docId = rs.data.anaesRecord.anaRecordId;
        }
    });

    function synchroData(optNurseItem) { //同步数据
        vm.optNurseItem.operationNameList = optNurseItem.operationNameList;
        vm.optNurseItem.inOperRoomTime = optNurseItem.inOperRoomTime;
        vm.optNurseItem.anaesMethodList = optNurseItem.anaesMethodList;
        vm.optNurseItem.optBodyList = optNurseItem.optBodyList;
        vm.optNurseItem.outOperRoomTime = optNurseItem.outOperRoomTime;
        vm.optNurseItem.instrnuseList = optNurseItem.instrnuseList;
        vm.optNurseItem.circunurseList = optNurseItem.circunurseList;
        vm.optNurseItem.urine = optNurseItem.urine;
        vm.optNurseItem.bloodTypeList = optNurseItem.bloodTypeList;
        vm.optNurseItem.bloodList = optNurseItem.bloodList;
        vm.optNurseItem.transfusionList = optNurseItem.transfusionList;
    }

    function formatTime(optNurseItem) {
        if (optNurseItem.outOperRoomTime)
            optNurseItem.outOperRoomTime = dateFilter(new Date(optNurseItem.outOperRoomTime), 'yyyy-MM-dd HH:mm');
        if (optNurseItem.inOperRoomTime)
            optNurseItem.inOperRoomTime = dateFilter(new Date(optNurseItem.inOperRoomTime), 'yyyy-MM-dd HH:mm');
        if (optNurseItem.outSickroomTime)
            optNurseItem.outSickroomTime = dateFilter(new Date(optNurseItem.outSickroomTime), 'yyyy-MM-dd HH:mm');
        if (vm.optNurseItem.backSickroomTime)
            optNurseItem.backSickroomTime = dateFilter(new Date(optNurseItem.backSickroomTime), 'yyyy-MM-dd HH:mm');
        if (vm.optNurseItem.catheterizaTime)
            optNurseItem.catheterizaTime = dateFilter(new Date(optNurseItem.catheterizaTime), 'yyyy-MM-dd HH:mm');
        if (vm.optNurseItem.postOperPathTime)
            optNurseItem.postOperPathTime = dateFilter(new Date(optNurseItem.postOperPathTime), 'yyyy-MM-dd HH:mm');
        if (vm.optNurseItem.bloodTime)
            optNurseItem.bloodTime = dateFilter(new Date(optNurseItem.bloodTime), 'yyyy-MM-dd HH:mm');
        if (vm.optNurseItem.antibioticTime)
            optNurseItem.antibioticTime = dateFilter(new Date(optNurseItem.antibioticTime), 'yyyy-MM-dd HH:mm');
    }

    function getTimestamp(time) {
        return new Date($filter('date')(new Date(time), 'yyyy-MM-dd HH:mm')).getTime();
    }

    $scope.$on('save', () => {
        save('NO_END');
    });

    $scope.$on('print', () => {
        save('END', 'print');
    });

    $scope.$on('submit', () => {
        save('END');
    })

    $scope.$on('refresh', () => {
        initPage(true);
    })

    $scope.$on('addInst', (ev, type) => {
        let scope = $rootScope.$new();
        scope.type = type;
        scope.optNurseId = vm.optNurseItem.optNurseId;
        $uibModal.open({
            animation: true,
            template: require('./modal/addInstrsuit/addInstrsuit.html'),
            controller: require('./modal/addInstrsuit/addInstrsuit.controller'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        }).result.then((rs) => {
            submit(vm.optNurseItem.processState);
            initPage();
        }, (err) => {

        })
    })

    initPage(false);
}