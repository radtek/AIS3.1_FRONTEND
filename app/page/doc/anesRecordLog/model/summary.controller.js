summary.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModalInstance', '$state', '$timeout', 'select', 'items', '$filter', 'toastr', 'auth', 'confirm'];

module.exports = summary;

function summary($rootScope, $scope, IHttp, $uibModalInstance, $state, $timeout, select, items, $filter, toastr, auth, confirm) {

    $scope.cancel = function() {
        qsmz(); intu(); endo(); lary(); spin(); airw(); sjzz(); csdw(); sjcjq(); nun(); cerv(); brac(); wais(); scia(); femo(); cuta(); inva(); arte(); deep();
        $uibModalInstance.close();
    }

    var regOptId = items.regOptId,
        formbean;
        
    $scope.consciou = [{ key: 1, name: '清醒' }, { key: 2, name: '嗜睡' }, { key: 3, name: '麻醉状态' }, { key: 4, name: '谵妄' }, { key: 5, name: '昏迷' }];

    function init() {
        IHttp.post('document/searchAnaesSummaryDetail', { regOptId: regOptId }).then(function(rr) {
            var data = rr.data;
            if (data.resultCode != 1)
                return;
            $scope.data = data;

            if (data.inAmountList) {
                data.inAmountList.forEach(function(item) {
                    if (item.name == "全血" && data.blood) {
                        item.bloodType = data.blood;
                    }
                });
            }
            $scope.humors = {
                inAmount: data.inAmount,
                inAmountList: data.inAmountList,
                outAmount: data.outAmount,
                outAmountList: data.outAmountList
            }

            formbean = data.anaesSummaryFormbean;
            // 麻醉总结附录单记录表
            $scope.anaesSummary = formbean.anaesSummary;
            $scope.anaesSummary.controAnalPlace += '';

            if (!$scope.anaesSummary.operaDate)
                $scope.anaesSummary.operaDate = $filter('date')(new Date(), 'yyyy-MM-dd');

            // 全身麻醉
            $scope.anaesSummaryAppendixGen = formbean.anaesSummaryAppendixGen;

            // 椎管内麻醉
            $scope.anaesSummaryAppendixCanal = formbean.anaesSummaryAppendixCanal;
        });
    }

    init();

    // 取消全身麻醉
    var qsmz = $scope.$watch('anaesSummaryAppendixGen.genAnesthesia', function(n) {
        if (!n && $scope.anaesSummaryAppendixGen) {
            $scope.anaesSummaryAppendixGen.fastInduction = '';
            $scope.anaesSummaryAppendixGen.intubation = '';
            $scope.anaesSummaryAppendixGen.cuff = '';
            $scope.anaesSummaryAppendixGen.look = '';
            $scope.anaesSummaryAppendixGen.blind = '';
            $scope.anaesSummaryAppendixGen.retrograde = '';
            $scope.anaesSummaryAppendixGen.fiberGuide = '';
            $scope.anaesSummaryAppendixGen.glidescope = '';
            $scope.anaesSummaryAppendixGen.opticalCable = '';
            $scope.anaesSummaryAppendixGen.intubationSuite = '';
            $scope.anaesSummaryAppendixGen.reinPipe = '';
            $scope.anaesSummaryAppendixGen.shapedTube = '';
            $scope.anaesSummaryAppendixGen.other = '';
            $scope.anaesSummaryAppendixGen.otherContent = '';
            $scope.anaesSummaryAppendixGen.laryMask = '';
            $scope.anaesSummaryAppendixGen.diffIntub = '';
            $scope.anaesSummaryAppendixGen.keepMethod = '';
        }
    }, true);

    var intu = $scope.$watch('anaesSummaryAppendixGen.intubation', function(n) {
        if (!n && $scope.anaesSummaryAppendixGen) {
            $scope.anaesSummaryAppendixGen.endotracheal = '';
            $scope.anaesSummaryAppendixGen.doubleCavity = '';
            $scope.anaesSummaryAppendixGen.blockDevice = '';
            $scope.anaesSummaryAppendixGen.fiberLocal = '';
            $scope.anaesSummaryAppendixGen.pyrosulfite = '';
            $scope.anaesSummaryAppendixGen.transnasal = '';
            $scope.anaesSummaryAppendixGen.transtracheal = '';
            $scope.anaesSummaryAppendixGen.model1 = '';
            $scope.anaesSummaryAppendixGen.depth = '';
        }
    });

    var endo = $scope.$watch('anaesSummaryAppendixGen.endotracheal', function(n) {
        if (!n && $scope.anaesSummaryAppendixGen)
            $scope.anaesSummaryAppendixGen.leftChamber = '';
    }, true);

    var lary = $scope.$watch('anaesSummaryAppendixGen.laryMask', function(n) {
        if (!n && $scope.anaesSummaryAppendixGen) {
            $scope.anaesSummaryAppendixGen.model2 = '';
            $scope.anaesSummaryAppendixGen.diffIntub = '';
        }
    });

    // 椎管内麻醉
    var spin = $scope.$watch('anaesSummaryAppendixCanal.spinalAnes', function(n) {
        if (!n && $scope.anaesSummaryAppendixCanal) {
            $scope.anaesSummaryAppendixCanal.waistAnes = '';
            $scope.anaesSummaryAppendixCanal.epiduralAnes = '';
            $scope.anaesSummaryAppendixCanal.cseUnionAnes = '';
            $scope.anaesSummaryAppendixCanal.sacralAnes = '';
            $scope.anaesSummaryAppendixCanal.puncPoint1 = '';
            $scope.anaesSummaryAppendixCanal.catheterPoint1 = '';
            $scope.anaesSummaryAppendixCanal.direction1 = '';
            $scope.anaesSummaryAppendixCanal.puncPoint2 = '';
            $scope.anaesSummaryAppendixCanal.catheterPoint2 = '';
            $scope.anaesSummaryAppendixCanal.direction2 = '';
            $scope.anaesSummaryAppendixCanal.anesFlat = '';
            $scope.anaesSummaryAppendixCanal.medicine = '';
        }
    });

    // 气道反应
    var airw = $scope.$watch('anaesSummaryAllergicReaction.airwayResp', function(n) {
        if (!n == undefined && $scope.anaesSummaryAllergicReaction) {
            $scope.anaesSummaryAllergicReaction.spasm = '';
            $scope.anaesSummaryAllergicReaction.edema = '';
            $scope.anaesSummaryAllergicReaction.airwayContents = ''
        }
    });

    // 神经阻滞
    $scope.nun;
    var sjzz = $scope.$watch('anaesSummaryAppendixCanal.nerveBlock', function(n) {
        if (!$scope.anaesSummaryAppendixCanal) return;
        if ($scope.anaesSummaryAppendixCanal.nerveBlock || $scope.anaesSummaryAppendixCanal.ultrasound || $scope.anaesSummaryAppendixCanal.nerveStimulator)
            $scope.nun = '1';
        else
            $scope.nun = '';
    }, true);

    // 超声定位
    var csdw = $scope.$watch('anaesSummaryAppendixCanal.ultrasound', function(n) {
        if (!$scope.anaesSummaryAppendixCanal) return;
        if ($scope.anaesSummaryAppendixCanal.nerveBlock || $scope.anaesSummaryAppendixCanal.ultrasound || $scope.anaesSummaryAppendixCanal.nerveStimulator)
            $scope.nun = '1';
        else
            $scope.nun = '';
    }, true);

    // 神经刺激器
    var sjcjq = $scope.$watch('anaesSummaryAppendixCanal.nerveStimulator', function(n) {
        if (!$scope.anaesSummaryAppendixCanal) return;
        if ($scope.anaesSummaryAppendixCanal.nerveBlock || $scope.anaesSummaryAppendixCanal.ultrasound || $scope.anaesSummaryAppendixCanal.nerveStimulator)
            $scope.nun = '1';
        else
            $scope.nun = '';
    }, true);

    var nun = $scope.$watch('nun', function(n, o) {
        if (n == o) return;
        if (!n && $scope.anaesSummaryAppendixCanal) {
            $scope.anaesSummaryAppendixCanal.cervicalPlexusBlock = '';
            $scope.anaesSummaryAppendixCanal.brachialPlexusBlock = '';
            $scope.anaesSummaryAppendixCanal.waistPlexusBlock = '';
            $scope.anaesSummaryAppendixCanal.sciaticNerveBlock = '';
            $scope.anaesSummaryAppendixCanal.femoralNerveBlock = '';
            $scope.anaesSummaryAppendixCanal.cutaneousNerveBlock = ''
            $scope.anaesSummaryAppendixCanal.other1 = '';
            $scope.anaesSummaryAppendixCanal.other1Value = '';
            $scope.anaesSummaryAppendixCanal.medicine1 = '';
        }
    });

    var cerv = $scope.$watch('anaesSummaryAppendixCanal.cervicalPlexusBlock', function(n) {
        if (!n && $scope.anaesSummaryAppendixCanal) {
            $scope.anaesSummaryAppendixCanal.shallowCong = '';
            $scope.anaesSummaryAppendixCanal.deepPlexus = '';
            $scope.anaesSummaryAppendixCanal.c = '';
        }
    });

    var brac = $scope.$watch('anaesSummaryAppendixCanal.brachialPlexusBlock', function(n) {
        if (!n && $scope.anaesSummaryAppendixCanal) {
            $scope.anaesSummaryAppendixCanal.brachialValue = '';
            $scope.anaesSummaryAppendixCanal.interscaleneLaw = '';
            $scope.anaesSummaryAppendixCanal.axillaryMethod = '';
            $scope.anaesSummaryAppendixCanal.clavicleLaw = '';
        }
    });

    var wais = $scope.$watch('anaesSummaryAppendixCanal.waistPlexusBlock', function(n) {
        if (!n && $scope.anaesSummaryAppendixCanal) {
            $scope.anaesSummaryAppendixCanal.waistPlexusValue = '';
        }
    });

    var scia = $scope.$watch('anaesSummaryAppendixCanal.sciaticNerveBlock', function(n) {
        if (!n && $scope.anaesSummaryAppendixCanal) {
            $scope.anaesSummaryAppendixCanal.sciaticNerveValue = '';
        }
    });

    var femo = $scope.$watch('anaesSummaryAppendixCanal.femoralNerveBlock', function(n) {
        if (!n && $scope.anaesSummaryAppendixCanal) {
            $scope.anaesSummaryAppendixCanal.femoralNerveValue = '';
        }
    });

    var cuta = $scope.$watch('anaesSummaryAppendixCanal.cutaneousNerveBlock', function(n) {
        if (!n && $scope.anaesSummaryAppendixCanal) {
            $scope.anaesSummaryAppendixCanal.cutaneousNerveValue = '';
        }
    });

    // 有创操作
    var inva = $scope.$watch('anaesSummaryAppendixCanal.invasiveProcedure', function(n) {
        if (!n && $scope.anaesSummaryAppendixCanal) {
            $scope.anaesSummaryAppendixCanal.arteryCathete = '';
            $scope.anaesSummaryAppendixCanal.deepVeinCathete = '';
        }
    });

    var arte = $scope.$watch('anaesSummaryAppendixCanal.arteryCathete', function(n) {
        if (!n && $scope.anaesSummaryAppendixCanal) {
            $scope.anaesSummaryAppendixCanal.radialArtery = '';
            $scope.anaesSummaryAppendixCanal.femoralArtery = '';
            $scope.anaesSummaryAppendixCanal.footArtery = '';
            $scope.anaesSummaryAppendixCanal.footArteryValue = '';
        }
    });

    var deep = $scope.$watch('anaesSummaryAppendixCanal.deepVeinCathete', function(n) {
        if (!n && $scope.anaesSummaryAppendixCanal) {
            $scope.anaesSummaryAppendixCanal.jugularVein = '';
            $scope.anaesSummaryAppendixCanal.subclavianVein = '';
            $scope.anaesSummaryAppendixCanal.femoralVein = '';
            $scope.anaesSummaryAppendixCanal.femoralVeinValue = '';
            $scope.anaesSummaryAppendixCanal.ultrasound1 = '';
            $scope.anaesSummaryAppendixCanal.singleChamber = '';
            $scope.anaesSummaryAppendixCanal.dualChamber = '';
            $scope.anaesSummaryAppendixCanal.threeChamber = '';
            $scope.anaesSummaryAppendixCanal.bloodWarming = '';
        }
    });

    $scope.save = function(processState, type) {
        var anaesSummary = angular.copy($scope.anaesSummary);
        anaesSummary.processState = processState;

        IHttp.post('document/saveAnaesSummaryDetail', {
            anaesSummary: anaesSummary,
            anaesSummaryAllergicReaction: $scope.anaesSummaryAllergicReaction,
            anaesSummaryAppendixCanal: $scope.anaesSummaryAppendixCanal,
            anaesSummaryAppendixGen: $scope.anaesSummaryAppendixGen,
            anaesSummaryVenipuncture: $scope.anaesSummaryVenipuncture
        }).then(function(rs) {
            if (rs.data.resultCode != 1)
                return;
            toastr.success(rs.data.resultMessage);
            $scope.cancel();
        });
    };
}
