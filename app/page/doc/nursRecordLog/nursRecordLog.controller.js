NursRecordLogCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'select', 'toastr', 'confirm', '$window', '$timeout', '$uibModal', '$filter', 'auth'];

module.exports = NursRecordLogCtrl;

function NursRecordLogCtrl($rootScope, $scope, IHttp, select, toastr, confirm, $window, $timeout, $uibModal, $filter, auth) {
    let vm = this;
    $scope.setting = $rootScope.$state.current.data;
    $scope.docInfo = auth.loginUser();
    $scope.docUrl = auth.loginUser().titlePath;

    select.getOperdefList({}).then((rs) => {
    	$scope.operationList = rs;
    });

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

    select.sysCodeBy('leaveToNursRecord').then((rs) => {
        if (rs.status === 200 && rs.data.resultCode === '1') {
            $scope.leaveToList = rs.data.resultList;
        }
    });

    $scope.$watch('vm.optCareRecord.leaveTo', function() {
        if(!vm.optCareRecord)
            return;
        if (vm.optCareRecord.leaveTo !== '4')
            vm.optCareRecord.leaveToOther = "";
    });

    function initPage(callback, type) {
        IHttp.post('document/searchOptCareRecordByRegOptId', { regOptId: $rootScope.$stateParams.regOptId }) //201703311336400000
            .then((rs) => {
                vm.regOpt = rs.data.searchRegOptByIdFormBean;
                vm.optCareRecord = rs.data.optCareRecord;
                vm.sensesList = rs.data.sensesList;
                vm.pipelineList = rs.data.pipelineList;

                $scope.processState = vm.optCareRecord.processState;
                $scope.$emit('processState', vm.optCareRecord.processState);
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
                if (vm.optCareRecord.skin1) {
                    vm.optCareRecord.skin1 = JSON.parse(vm.optCareRecord.skin1)
                } else {
                    vm.optCareRecord.skin1 = {};
                }
                if (vm.optCareRecord.drainageTube) {
                    vm.optCareRecord.drainageTube = JSON.parse(vm.optCareRecord.drainageTube)
                } else {
                    vm.optCareRecord.drainageTube = {};
                }
                if (vm.optCareRecord.implants) {
                    vm.optCareRecord.implants = JSON.parse(vm.optCareRecord.implants)
                } else {
                    vm.optCareRecord.implants = {};
                }
                if (vm.optCareRecord.negativePosition) {
                    vm.optCareRecord.negativePosition = JSON.parse(vm.optCareRecord.negativePosition)
                } else {
                    vm.optCareRecord.negativePosition = {};
                }
                if (vm.optCareRecord.skin2) {
                    vm.optCareRecord.skin2 = JSON.parse(vm.optCareRecord.skin2)
                } else {
                    vm.optCareRecord.skin2 = {};
                }
                if (vm.optCareRecord.supportMaterial) {
                    vm.optCareRecord.supportMaterial = JSON.parse(vm.optCareRecord.supportMaterial)
                } else {
                    vm.optCareRecord.supportMaterial = {};
                }
                if (vm.optCareRecord.tourniquet) {
                    vm.optCareRecord.tourniquet = JSON.parse(vm.optCareRecord.tourniquet)
                } else {
                    vm.optCareRecord.tourniquet = {};
                }
                if (vm.optCareRecord.venousInfusion2) {
                    vm.optCareRecord.venousInfusion2 = JSON.parse(vm.optCareRecord.venousInfusion2)
                } else {
                    vm.optCareRecord.venousInfusion2 = {};
                }
                if (vm.optCareRecord.inOperRoomTime) {
                    vm.optCareRecord.inOperRoomTime = $filter('date')(new Date(vm.optCareRecord.inOperRoomTime), 'yyyy-MM-dd HH:mm');
                }
                if (vm.optCareRecord.outOperRoomTime) {
                    vm.optCareRecord.outOperRoomTime = $filter('date')(new Date(vm.optCareRecord.outOperRoomTime), 'yyyy-MM-dd HH:mm');
                }
                if (vm.optCareRecord.shiftTime) {
                    vm.optCareRecord.shiftTime = $filter('date')(vm.optCareRecord.shiftTime, 'yyyy-MM-dd HH:mm');
                }
                !angular.isArray(vm.optCareRecord.optbodys) && (vm.optCareRecord.optbodys = []);
                !angular.isArray(vm.optCareRecord.shiftChangedNurseList) && (vm.optCareRecord.shiftChangedNurseList = []);
                !angular.isArray(vm.optCareRecord.instrnurseList) && (vm.optCareRecord.instrnurseList = []);
                !angular.isArray(vm.optCareRecord.shiftChangeNurseList) && (vm.optCareRecord.shiftChangeNurseList = []);
                !angular.isArray(vm.optCareRecord.operationNameList) && (vm.optCareRecord.operationNameList = []);
                !angular.isArray(vm.optCareRecord.designedAnaesMethod) && (vm.optCareRecord.designedAnaesMethod = []);

                vm.methodDisabled = {
                    "pointer-events": vm.regOpt.isLocalAnaes === '0' ? 'none' : 'auto'
                };

                //术前皮肤情况
                $scope.$watch('vm.optCareRecord.skin1.a.checked', function(n, o) {
                    if (n === '1') {
                        vm.optCareRecord.skin1.a.content = '';
                    }
                });

                //管道
                $scope.$watch('vm.optCareRecord.pipeline.a.checked', function(n, o) {
                    if (n === '0') {
                        vm.optCareRecord.pipeline.a.content = '';
                    }
                });

                //术后皮肤情况
                $scope.$watch('vm.optCareRecord.skin2.a.checked', function(n, o) {
                    if (n === '1') {
                        vm.optCareRecord.skin2.a.content = '';
                    }
                });

                //引流管
                $scope.$watch('vm.optCareRecord.drainageTube.i.checked', function(n, o) {
                    if (n === '0') {
                        vm.optCareRecord.drainageTube.i.content = '';
                    }
                })

                //术后静脉输液
                $scope.$watch('vm.optCareRecord.venousInfusion2.a.checked', function(n, o) {
                    if (n === '0') {
                        vm.optCareRecord.venousInfusion2.a.content = '';
                    }
                })

                //体内植入物
                $scope.$watch('vm.optCareRecord.implants.a.checked', function(n, o) {
                    if (n === '0') {
                        vm.optCareRecord.implants.a.content = '';
                    }
                })

                //标本名称
                $scope.$watch('vm.optCareRecord.specimen', function(n, o) {
                    if (n === 0) {
                        vm.optCareRecord.specimenName = '';
                    }
                });

                //体位支持用物
                $scope.$watch('vm.optCareRecord.supportMaterial.h.checked', function(n, o) {
                    if (n === '0') {
                        vm.optCareRecord.supportMaterial.h.content = '';
                    }
                });

                //止血带
                $scope.$watch('vm.optCareRecord.tourniquet.a.checked', function(n, o) {
                    if (n === '0') {
                        vm.optCareRecord.tourniquet.a.content = '';
                    }
                });

                //负极板位置
                $scope.$watch('vm.optCareRecord.negativePosition.e.checked', function(n, o) {
                    if (n === '0') {
                        vm.optCareRecord.negativePosition.e.content = '';
                    }
                });
                if (callback) callback();
            });
    }

    //自定义必填项验证  items 提交的数据
    function checkRequiredItem(datas) {

        var mastInputArray = [];
        var mastInputNameStr = "";
        for (var i = 0; i < vm.mastInputData.length; i++) {
            if (vm.mastInputData[i].isNeed == 1) {
                mastInputArray.push(vm.mastInputData[i]);
                mastInputNameStr += vm.mastInputData[i].name + ",";
            }
        }
        vm.myMust = mastInputNameStr;

        if (mastInputArray.length == 0) {
            return true;
        }
        for (var countryObj in datas) {
            if (typeof(datas[countryObj]) == "object" && !datas[countryObj].length) {
                if ((Object.keys(datas[countryObj])).join('') === 'abcdefghijkmno') {
                    let item = '';
                    for (item of Object.keys(datas[countryObj])) {
                        if (datas[countryObj][item].checked !== '') {
                            item = true;
                            break;
                        }
                    }
                    if (item !== true) {
                        for (var i = 0; i < mastInputArray.length; i++) {
                            if (mastInputArray[i].name === countryObj) {
                                toastr.warning(mastInputArray[i].description + "不能为空");
                                return false;
                            }
                        }
                    }
                }
            } else {
                //本文书第一层都是值                    
                if (mastInputNameStr.indexOf(countryObj) > -1) {
                    if (!isNotNull(datas[countryObj])) {
                        //要验证必填项的值为空,看看是那个项，提示
                        for (var i = 0; i < mastInputArray.length; i++) {
                            if (mastInputArray[i].name === countryObj) {
                                //schedileService.showMdToast(mastInputArray[i].description+"不能为空");
                                toastr.warning(mastInputArray[i].description + "不能为空");
                                return false;
                            }
                        }
                    }
                }
            }
        }
        return true;
    }
    //判断值是否为空
    function isNotNull(obj) {
        if (obj === '') {
            //"",0
            return false;
        } else {
            if (typeof obj == 'string') {
                if (obj.replace(/0/g, "").replace(/,/g, "") === "") {
                    //"0,0,0,0"
                    return false;
                }
            }
            if (Object.prototype.toString.call(obj) === '[object Array]') {
                if (obj.length === 0) {
                    //[]
                    return false;
                }
            }
            if ($.isEmptyObject(obj) && Object.prototype.toString.call(obj).toLowerCase() === '[object object]') {
                //{}
                return false;
            }
        }
        return true;
    }

    //验证字段
    function validation() {
        if (!vm.optCareRecord.inOperRoomTime) {
            if (vm.regOpt.isLocalAnaes === '0') {
                toastr.warning("无入室时间，请同步数据！");
            } else {
                toastr.warning("请输入入室时间！");
            }
            return false;
        }

        if (!vm.optCareRecord.outOperRoomTime) {
            if (vm.regOpt.isLocalAnaes === '0') {
                toastr.warning("无病人离室时间，请同步数据！");
            } else {
                toastr.warning("请输入病人离室时间！");
            }
            return false;
        }
        if (vm.optCareRecord.leaveTo === '0') {
            toastr.warning("请选择病人去向！");
            return false;
        }
        return true;
    }

    vm.refresh = function() {
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
            'leaveTo'
        ];
        angular.forEach(backData, function(val, key) {
            if (updateArray.indexOf(key) !== -1) {
                delete backData[key];
            }
        });
        initPage(function() {
            angular.extend(vm.optCareRecord, backData);
            toastr.success("数据同步完成！");
        }, '1');
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

    $scope.$on('set', () => {
        let scope = $rootScope.$new();
        scope.requiredItemList = vm.mastInputData;
        $uibModal.open({
                animation: true,
                template: require('./modal/setNecessary/setNecessary.html'),
                controller: require('./modal/setNecessary/setNecessary.controller'),
                controllerAs: 'vm',
                backdrop: 'static',
                scope: scope
            })
            .result
            .then((rs) => {
                if (rs === 'success') {
                    getMastInput();
                }
            }, (err) => {
                // console.log(err);
            })
    })

    $scope.$on('refresh', () => {
        vm.refresh();
    })

    // 提交
    function submit(procState, type) {
        let params = angular.copy(vm.optCareRecord);
        params.shiftTime = new Date(params.shiftTime);
        params.inspection = params.inspection.join();

        IHttp.post('document/updateOptCareRecord',
            params
        ).then((res) => {
            if (res.data.resultCode === '1') {
                toastr.success(res.data.resultMessage);
                $scope.processState = vm.optCareRecord.processState;
                if (type === 'print') {
                    $scope.$emit('end-print');
                } else {
                    $scope.$emit('processState', vm.optCareRecord.processState);
                }
            }
        });
    }


    function save(processState, type) {
        $scope.verify = processState == 'END';
        if (processState === 'END' && (!vm.optCareRecord.inOperRoomTime || !vm.optCareRecord.outOperRoomTime || !vm.optCareRecord.leaveTo)) {
            toastr.warning('请输入必填项信息');
            return;
        }

        if (vm.optCareRecord.processState === 'END' && processState === 'END') {
            $scope.$emit('doc-print');
            return;
        }
        
        //验证必填项                        
        if (processState === 'END' && !checkRequiredItem(vm.optCareRecord)) {
            return false;
        }
        let content = '';
        if (processState === 'END' && type !== 'print') {
            content = '提交的文书将归档，并且不可编辑，是否继续提交？';
            confirm.show(content).then(function(data) {
                vm.optCareRecord.processState = 'END';
                submit(processState, type);
            });
        } else if (processState === 'END' && type === 'print') {
            if(vm.optCareRecord.processState === 'END') {
                $scope.$emit('doc-print');
            }else {
                content = '打印的文书将归档，且不可编辑，是否继续打印？';
                confirm.show(content).then(function(data) {
                    vm.optCareRecord.processState = 'END';
                    submit(processState, type);
                });
            }
        } else {
            submit();
        }
    }

    function getMastInput() {
        IHttp.post('basedata/searchRequiredItem', {
            type: '2'
        }).then((res) => {
            if (res.data.resultCode == "1") {
                vm.mastInputData = res.data.resultList;
                var mastInputNameStr = "";
                if (angular.isArray(vm.mastInputData)) {
                    for (var i = 0; i < vm.mastInputData.length; i++) {
                        if (vm.mastInputData[i].isNeed == 1) {
                            mastInputNameStr += vm.mastInputData[i].name + ",";
                        }
                    }
                    vm.myMust = mastInputNameStr;
                } else {
                    vm.myMust = '';
                }
            }
        });
    }
    getMastInput();

    initPage();
}
