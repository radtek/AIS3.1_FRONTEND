AnesProgramCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'auth', 'toastr', '$window', 'dateFilter', '$timeout', 'confirm', 'select'];

module.exports = AnesProgramCtrl;

function AnesProgramCtrl($rootScope, $scope, IHttp, auth, toastr, $window, dateFilter, $timeout, confirm, select) {
    var vm = this,
        timer_rt;
    var regOptId = $rootScope.$stateParams.regOptId;

    $scope.setting = $rootScope.$state.current.data;
    $scope.docInfo = auth.loginUser();
    $scope.docUrl = auth.loginUser().titlePath;
    $scope.saveActive = auth.getDocAuth();
    var currRouteName = $rootScope.$state.current.name;
    
    select.getAnaesMethodList().then((rs) => {
        $scope.anaesMethodList = rs.data.resultList;
    })

    $timeout(function() {
        $scope.$watch('anaesPlan.anaesDoctorId', function(n, o) {
            $scope.hasSig = false;
            $scope.eSignatureAnaestheitist = [];
            angular.forEach($scope.anesthetistList, function(item) {
                if (item.userName == n) {
                    $scope.hasSig = item.picPath ? true : false;
                    $scope.eSignatureAnaestheitist.push({hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime()});
                }
            })
        }, true)
    }, 1000);

    IHttp.post('document/searchAnaesPlan', { 'regOptId': regOptId }).then(function(res) {
        $scope.regOptItem = res.data.searchRegOptByIdFormBean;
        $scope.anaesPlan = res.data.anaesPlan;

        //初始化时发送文书状态
        $scope.processState = $scope.anaesPlan.processState;
        $scope.$emit('processState', $scope.anaesPlan.processState);

        if (!!$scope.anaesPlan.date) {
            $scope.anaesPlan.date = dateFilter(new Date($scope.anaesPlan.date), 'yyyy-MM-dd');
        }
        $scope.puncturePointList = res.data.puncturePointList;
        $scope.catherIdList = res.data.catherIdList;
        $scope.laryngealMaskList = res.data.laryngealMaskList;
        $scope.microPumpList = res.data.microPumpList;

        if ($scope.anaesPlan) {
            $scope.anaesPlan.anaesDoctorName = $scope.regOptItem.anesthetistName;
            //把基础查询中不可为空的数据绑定          
            // $scope.anaesPlan.id = $scope.anaesPlan.id;
            $scope.anaesPlan.regOptId = $scope.regOptItem.regOptId;
            // $scope.anaesPlan.anaesMethodCode = $scope.regOptItem.designedAnaesMethodCode;
            $scope.anaesPlan.anaesMethodName = $scope.regOptItem.designedAnaesMethodName;

            //监护项目
            var guardianshipCode = $scope.anaesPlan.guardianship.split(",");
            for (var item in guardianshipCode) {
                $scope.guardianship_[item] = guardianshipCode[item];
            }
            //诱导方法
            var inductionMethodCode = $scope.anaesPlan.inductionMethod.split(",");
            for (var item in inductionMethodCode) {
                $scope.inductionMethod_[item] = inductionMethodCode[item];
            }
            //人工气道
            var artificialAirwayCode = $scope.anaesPlan.artificialAirway.split(",");
            for (var item in artificialAirwayCode) {
                $scope.artificialAirway_[item] = artificialAirwayCode[item];
            }
            //神经阻滞方法
            var nerveBlockCode = $scope.anaesPlan.nerveBlock.split(",");
            for (var item in nerveBlockCode) {
                $scope.nerveBlock_[item] = nerveBlockCode[item];
            }
            //特殊操作
            var specialOperateCode = $scope.anaesPlan.specialOperate.split(",");
            for (var item in specialOperateCode) {
                $scope.specialOperate_[item] = specialOperateCode[item];
            }
            //麻醉器械
            var anaesInstrumentCode = $scope.anaesPlan.anaesInstrument.split(",");
            for (var item in anaesInstrumentCode) {
                $scope.anaesInstrument_[item] = anaesInstrumentCode[item];
            }
            var localAnestCode = $scope.anaesPlan.localAnest.split(",");
            for (var item in localAnestCode) {
                $scope.localAnest_[item] = localAnestCode[item];
            }
            var sedativesCode = $scope.anaesPlan.sedatives.split(",");
            for (var item in sedativesCode) {
                $scope.sedatives_[item] = sedativesCode[item];
            }
            var analgesicsCode = $scope.anaesPlan.analgesics.split(",");
            for (var item in analgesicsCode) {
                $scope.analgesics_[item] = analgesicsCode[item];
            }
            var muscleRelaxantCode = $scope.anaesPlan.muscleRelaxant.split(",");
            for (var item in muscleRelaxantCode) {
                $scope.muscleRelaxant_[item] = muscleRelaxantCode[item];
            }
            var intravenousAnestCode = $scope.anaesPlan.intravenousAnest.split(",");
            for (var item in intravenousAnestCode) {
                $scope.intravenousAnest_[item] = intravenousAnestCode[item];
            }
            var inhalationAnestCode = $scope.anaesPlan.inhalationAnest.split(",");
            for (var item in inhalationAnestCode) {
                $scope.inhalationAnest_[item] = inhalationAnestCode[item];
            }
            var adjuvantTherapyCode = $scope.anaesPlan.adjuvantTherapy.split(",");
            for (var item in adjuvantTherapyCode) {
                $scope.adjuvantTherapy_[item] = adjuvantTherapyCode[item];
            }
            var aidMedicationCode = $scope.anaesPlan.aidMedication.split(",");
            for (var item in aidMedicationCode) {
                $scope.aidMedication_[item] = aidMedicationCode[item];
            }
            var infusionCode = $scope.anaesPlan.infusion.split(",");
            for (var item in infusionCode) {
                $scope.infusion_[item] = infusionCode[item];
            }
        }
    });

    select.getAnaesthetists().then((rs) => {
        $scope.anesthetistList = rs.data.userItem;
    });

    $scope.$watch('anaesPlan.doubleChamber', function(val) {
        if (val === 0)
            $scope.anaesPlan.doubleChamberId = "";
    });

    $scope.$watch('anaesPlan.tracheaPipe', function(val) {
        if (val === 0)
            $scope.anaesPlan.tracheaPipeId = "";
    });

    //监护项目
    $scope.guardianship_ = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    //诱导方法
    $scope.inductionMethod_ = [0, 0];
    //人工气道
    $scope.artificialAirway_ = [0, 0, 0, 0, 0];
    //神经阻滞方法
    $scope.nerveBlock_ = [0, 0, 0, 0, 0, 0];
    //特殊操作
    $scope.specialOperate_ = [0, 0, 0, 0, 0, 0, 0];
    //麻醉器械
    $scope.anaesInstrument_ = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    $scope.localAnest_ = [0, 0, 0, 0, 0, 0];
    $scope.sedatives_ = [0, 0, 0];
    $scope.analgesics_ = [0, 0, 0, 0];
    $scope.muscleRelaxant_ = [0, 0, 0, 0];
    $scope.intravenousAnest_ = [0, 0, 0, 0];
    $scope.inhalationAnest_ = [0, 0, 0];
    $scope.adjuvantTherapy_ = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    $scope.aidMedication_ = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    $scope.infusion_ = [0, 0, 0, 0, 0, 0];

    function bindCode() {
        var guardianships = "";
        for (var item in $scope.guardianship_) {
            if (guardianships === "") {
                if ($scope.guardianship_[item] === "") {
                    guardianships = "0";
                }
                guardianships += $scope.guardianship_[item];
            } else {
                guardianships += "," + $scope.guardianship_[item];
            }
        }
        $scope.anaesPlan.guardianship = guardianships;
        var inductionMethods = "";
        for (var item in $scope.inductionMethod_) {
            if (inductionMethods === "") {
                if ($scope.inductionMethod_[item] === "") {
                    inductionMethods = "0";
                }
                inductionMethods += $scope.inductionMethod_[item];
            } else {
                inductionMethods = inductionMethods + "," + $scope.inductionMethod_[item];
            }
        }
        $scope.anaesPlan.inductionMethod = inductionMethods;

        var artificialAirways = "";
        for (var item in $scope.artificialAirway_) {
            if (artificialAirways === "") {
                if ($scope.artificialAirway_[item] === "") {
                    artificialAirways = "0";
                }
                artificialAirways += $scope.artificialAirway_[item];
            } else {
                artificialAirways += "," + $scope.artificialAirway_[item];
            }
        }
        $scope.anaesPlan.artificialAirway = artificialAirways;

        var nerveBlocks = "";
        for (var item in $scope.nerveBlock_) {
            if (nerveBlocks === "") {
                if ($scope.nerveBlock_[item] === "") {
                    nerveBlocks = "0";
                }
                nerveBlocks += $scope.nerveBlock_[item];
            } else {
                nerveBlocks += "," + $scope.nerveBlock_[item];
            }
        }
        $scope.anaesPlan.nerveBlock = nerveBlocks;

        var specialOperates = "";
        for (var item in $scope.specialOperate_) {
            if (specialOperates === "") {
                if ($scope.specialOperate_[item] === "") {
                    specialOperates = "0";
                }
                specialOperates += $scope.specialOperate_[item];
            } else {
                specialOperates += "," + $scope.specialOperate_[item];
            }
        }
        $scope.anaesPlan.specialOperate = specialOperates;

        var anaesInstruments = "";
        for (var item in $scope.anaesInstrument_) {
            if (anaesInstruments === "") {
                if ($scope.anaesInstrument_[item] === "") {
                    anaesInstruments = "0";
                }
                anaesInstruments += $scope.anaesInstrument_[item];
            } else {
                anaesInstruments += "," + $scope.anaesInstrument_[item];
            }
        }
        $scope.anaesPlan.anaesInstrument = anaesInstruments;
        var localAnests = "";
        for (var item in $scope.localAnest_) {
            if (localAnests === "") {
                if ($scope.localAnest_[item] === "") {
                    localAnests = "0";
                }
                localAnests += $scope.localAnest_[item];
            } else {
                localAnests += "," + $scope.localAnest_[item];
            }
        }
        $scope.anaesPlan.localAnest = localAnests;
        var sedativess = "";
        for (var item in $scope.sedatives_) {
            if (sedativess == "") {
                if ($scope.sedatives_[item] === "") {
                    sedativess = "0";
                }
                sedativess += $scope.sedatives_[item];
            } else {
                sedativess = sedativess + "," + $scope.sedatives_[item];
            }
        }
        $scope.anaesPlan.sedatives = sedativess;

        var analgesicss = "";
        for (var item in $scope.analgesics_) {
            if (analgesicss === "") {
                if ($scope.analgesics_[item] === "") {
                    analgesicss = "0";
                }
                analgesicss += $scope.analgesics_[item];
            } else {
                analgesicss += "," + $scope.analgesics_[item];
            }
        }
        $scope.anaesPlan.analgesics = analgesicss;

        var muscleRelaxants = "";
        for (var item in $scope.muscleRelaxant_) {
            if (muscleRelaxants === "") {
                if ($scope.muscleRelaxant_[item] === "") {
                    muscleRelaxants = "0";
                }
                muscleRelaxants += $scope.muscleRelaxant_[item];
            } else {
                muscleRelaxants += "," + $scope.muscleRelaxant_[item];
            }
        }
        $scope.anaesPlan.muscleRelaxant = muscleRelaxants;

        var intravenousAnests = "";
        for (var item in $scope.intravenousAnest_) {
            if (intravenousAnests === "") {
                if ($scope.intravenousAnest_[item] === "") {
                    intravenousAnests = "0";
                }
                intravenousAnests += $scope.intravenousAnest_[item];
            } else {
                intravenousAnests += "," + $scope.intravenousAnest_[item];
            }
        }
        $scope.anaesPlan.intravenousAnest = intravenousAnests;

        var inhalationAnests = "";
        for (var item in $scope.inhalationAnest_) {
            if (inhalationAnests === "") {
                if ($scope.inhalationAnest_[item] === "") {
                    inhalationAnests = "0";
                }
                inhalationAnests += $scope.inhalationAnest_[item];
            } else {
                inhalationAnests += "," + $scope.inhalationAnest_[item];
            }
        }
        $scope.anaesPlan.inhalationAnest = inhalationAnests;

        var adjuvantTherapys = "";
        for (var item in $scope.adjuvantTherapy_) {
            if (adjuvantTherapys === "") {
                if ($scope.adjuvantTherapy_[item] === "") {
                    adjuvantTherapys = "0";
                }
                adjuvantTherapys += $scope.adjuvantTherapy_[item];
            } else {
                adjuvantTherapys += "," + $scope.adjuvantTherapy_[item];
            }
        }
        $scope.anaesPlan.adjuvantTherapy = adjuvantTherapys;

        var aidMedications = "";
        for (var item in $scope.aidMedication_) {
            if (aidMedications === "") {
                if ($scope.aidMedication_[item] === "") {
                    aidMedications = "0";
                }
                aidMedications += $scope.aidMedication_[item];
            } else {
                aidMedications += "," + $scope.aidMedication_[item];
            }
        }
        $scope.anaesPlan.aidMedication = aidMedications;

        var infusions = "";
        for (var item in $scope.infusion_) {
            if (infusions === "") {
                if ($scope.infusion_[item] === "") {
                    infusions = "0";
                }
                infusions += $scope.infusion_[item];
            } else {
                infusions += "," + $scope.infusion_[item];
            }
        }
        $scope.anaesPlan.infusion = infusions;
    }

    $scope.save = function(type, state) {
        $scope.verify = type == 'END';
        bindCode();
        if (type === 'END') {
            if (!$scope.anaesPlan.asa || !$scope.anaesPlan.anaesDoctorName || !$scope.anaesPlan.date) {
                toastr.warning('请输入必填项信息');
                return;
            }
            if (state === 'print') {
                if ($scope.anaesPlan.processState === 'END')
                    $scope.$emit('doc-print');
                else {
                    confirm.show("打印的文书将归档，且不可编辑。是否继续打印？").then(function(data) {
                        fn_save(type, state);
                    });
                }
            } else {
                confirm.show("提交的文书将归档，并且不可编辑。是否继续提交？").then(function(data) {
                    fn_save(type);
                });
            }
        } else {
            fn_save(type);
        }
    }

    function fn_save(processState, state) {
        var opt = angular.copy($scope.anaesPlan);
        opt.processState = processState;
        IHttp.post('document/updateAnaesPlan', opt).then((res) => {
            if (res.data.resultCode != '1')
                return;
            toastr.success(res.data.resultMessage);
            $scope.anaesPlan.processState = processState;
            $scope.processState = $scope.anaesPlan.processState;
            if (state === 'print') {
                $scope.$emit('end-print');
            } else {
                $scope.$emit('processState', $scope.anaesPlan.processState);
            }
        });
    }

    function print() {
        $window.print();
    }

    $scope.$on('save', () => {
        if ($scope.saveActive && $scope.processState == 'END') {
            bindCode();
            fn_save('END');
        } else {
            $scope.save('NO_END');
        }
    });

    $scope.$on('print', () => {
        $scope.save('END', 'print');
    });

    $scope.$on('submit', () => {
        $scope.save('END');
    })

}
