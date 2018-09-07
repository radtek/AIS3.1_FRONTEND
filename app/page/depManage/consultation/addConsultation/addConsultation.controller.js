AddConsultationCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'select', '$q', 'toastr', '$filter', '$timeout', 'auth'];

module.exports = AddConsultationCtrl;

function AddConsultationCtrl($rootScope, $scope, IHttp, select, $q, toastr, $filter, $timeout, auth) {
    $scope.page = $rootScope.$state.current.name;
    $scope.beCode = auth.loginUser().beCode;
    $scope.operSourceList = [{ type: '0', name: '住院' }, { type: '1', name: '门诊' }];
    $scope.sexList = ['男', '女'];
    $scope.chargeType = ['自费', '公费', '医保'];
    $scope.templete = ['阴性', '阳性'];
    $scope.optLevelList = ['一级', '二级', '三级', '四级'];
    // $scope.emergencyList = [{ type: '0', name: '择期' }, { type: '1', name: '急诊' }];
    // $scope.cutLevelList = [{ type: '1', name: 'Ⅰ' }, { type: '2', name: 'Ⅱ' }, { type: '3', name: 'Ⅲ' }, { type: '4', name: 'Ⅳ' }];

    // $scope.startTimeList = [];
    // for (var a = 0; a < 24; a++)
    //     $scope.startTimeList.push({ type: a + '', value: a + ':00' });

    select.getRegionList().then((rs) => {
        $scope.regionList = rs.data.resultList;
    });

    select.dept().then((rs) => {
        $scope.deptList = rs.data.resultList;
    });

    $scope.getDiagnosedefList = function(query) {
        return select.getDiagnosedefList(query);
    };

    $scope.getOperdefList = function(query) {
        return select.getOperdefList(query);
    };

    select.getAnaesMethodList().then((rs) => {
        $scope.anaesMethodList = rs.data.resultList;
    })

    select.operroom().then((rs) => {
        $scope.operRoomList = rs.data.resultList;
    });

    $scope.getOperaList = function(query, filed) {
        var paras = [];
        for(var a = 1; a < arguments.length; a++) {
            if(arguments[a])
                paras.push(arguments[a]);
        }
        return select.getOperators(query, paras);
    }
    
    let regOptId = $rootScope.$stateParams.regOptId;
    // 查询
    // $scope.regOpt = {};
    // $scope.dispatch = {};
    if (regOptId) {
        // IHttp.post('operation/searchApplication', { regOptId: regOptId }).then(function(rs) {
        //     if (rs.data.resultCode != '1')
        //         return;
        //     $scope.regOpt = rs.data.resultRegOpt;
        //     $scope.dispatch = rs.data.resultDispatch;
        //     $scope.dispatch.regOptId = regOptId;
        //     $scope.regOpt.operSource += '';
        //     $scope.regOpt.emergency += '';
        //     $scope.regOpt.cutLevel += '';
        // });

        IHttp.post("operation/searchConsultationById", { conttId: regOptId })
            .then((rs) => {
                if (rs.status === 200 && rs.data.resultCode === '1') {
                    $scope.patient = rs.data.consultation;
                }
            });
    } else {
        $scope.patient = {
            name: "",
            medicalType: "",
            hid: "",
            sex: "男",
            birthday: "",
            age: '',
            ageMon: '',
            ageDay: "",
            bed: "",
            regionId: "",
            regionName: "",
            deptId: "",
            deptName: "",
            designedOptCode: "",
            designedOptName: "",
            diagnosisCode: "",
            diagnosisName: "",
            operaDate: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm'),
            startTime: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm'), //$filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            endTime: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm'),
            emergency: "",
            optLevel: "",
            designedAnaesMethodCode: "",
            designedAnaesMethodName: "",
            operatorName: "",
            operatorId: "",
            createUser: $scope.userId,
            emergency: '0',
            isLocalAnaes: "0",
            weight: '',
            hypersusceptibility: '',
            hbsag: '',
            hcv: '',
            hiv: '',
            hp: '',
            assistantId: '',
            assistantName: '',
            remark: ''
        };
    }


    function validation() {
        if ($scope.patient.designedAnaesMethodCodes === '') {
            var content = '麻醉方法不能为空!';
            toastr.warning(content);
            return false;
        } else if ($scope.patient.operatorId === '') {
            var content = '主刀医生不能为空!';
            toastr.warning(content);
            return false;
        }
        return true;
    }

    $scope.setDiagHeight = function (event) {
        if (event.target.clientHeight > 35) {
            $('#diagDiv').height(55 + (22*1));
        }
        if (event.target.clientHeight > 70) {
            $('#diagDiv').height(55 + (22*2));
        }
    }

    $scope.setDesigHeight = function (event) {
        if (event.target.clientHeight > 35) {
            $('#desigDiv').height(55 + (22*1));
        }
        if (event.target.clientHeight > 70) {
            $('#desigDiv').height(55 + (22*2));
        }
    }

    $timeout(function (){
        let diagOiHeight = $('#diagOi').height();
        let desigOiHeight = $('#desigOi').height();
        if (diagOiHeight > 35) {
            $('#diagDiv').height(55 + (22*1));
        }
        if (diagOiHeight > 70) {
            $('#diagDiv').height(55 + (22*2));
        }
        if (desigOiHeight > 35) {
            $('#desigDiv').height(55 + (22*1));
        }
        if (desigOiHeight > 70) {
            $('#desigDiv').height(55 + (22*2));
        }
    }, 500);

    $scope.$on('save', function(ev) {
        // // 修改
        // if ($scope.regOpt.regOptId) {
        //     IHttp.post('operation/updateRegOpt', { regOpt: $scope.regOpt, dispatch: $scope.dispatch }).then(function(rs) {
        //         if (rs.data.resultCode != '1')
        //             return;
        //         toastr.success(rs.data.resultMessage);
        //         back();
        //     });
        // } else {
        //     // 保存 》 择期的手术
        //     if ($scope.regOpt.emergency == 0) {
        //         IHttp.post('operation/createRegOpt', $scope.regOpt).then(function(rs) {
        //             if (rs.data.resultCode != '1')
        //                 return;
        //             toastr.success(rs.data.resultMessage);
        //             back();
        //         });
        //     } else {
        //         // 保存 》 急诊的手术
        //         IHttp.post('basedata/createEmergencyOperation', { regOpt: $scope.regOpt, dispatch: $scope.dispatch }).then(function(rs) {
        //             if (rs.data.resultCode != '1')
        //                 return;
        //             toastr.success(rs.data.resultMessage);
        //             back();
        //         });
        //     }
        // }
        if (validation()) {
            IHttp.post('operation/updateConsultation', $scope.patient)
                .then((rs) => {
                    if (rs.status === 200 && rs.data.resultCode === '1') {
                        toastr.info(rs.data.resultMessage);
                        back();
                    }
                });
        }
    });

    function back() {
        if ($scope.tabsMenu.length <= 1) {
            window.history.back();
            window.location.reload();
        }
    }
}
