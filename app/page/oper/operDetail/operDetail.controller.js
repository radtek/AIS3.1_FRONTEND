OperDetailCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'select', 'auth', 'toastr', '$q', '$timeout', '$filter'];

module.exports = OperDetailCtrl;

function OperDetailCtrl($rootScope, $scope, IHttp, select, auth, toastr, $q, $timeout, $filter) {
    $scope.setting = $rootScope.$state.current.data;
    $scope.$emit('readonly', $scope.setting);
    $scope.page = $rootScope.$state.current.name;
    $scope.beCode = auth.loginUser().beCode;
    $scope.operSourceList = [{ type: '0', name: '住院' }, { type: '1', name: '门诊' }];
    $scope.sexList = ['男', '女'];
    $scope.chargeType = ['自费', '公费', '医保'];
    $scope.templete = ['阴性', '阳性'];
    $scope.optLevelList = ['一级', '二级', '三级', '四级'];
    $scope.emergencyList = [{ type: '0', name: '择期' }, { type: '1', name: '急诊' }];
    $scope.cutLevelList = [{ type: '1', name: 'Ⅰ' }, { type: '2', name: 'Ⅱ' }, { type: '3', name: 'Ⅲ' }, { type: '4', name: 'Ⅳ' }];
    //初始化时发送状态
    $scope.$emit('processState', 'NO_END');

    select.getRegionList().then((rs) => {
        $scope.regionList = rs.data.resultList;
    });

    select.dept().then((rs) => {
        $scope.deptList = rs.data.resultList;
    });

    $scope.getOptionList = function(query) {
        return select.getDiagnosedefList(query);
    }

    $scope.getOperdefList = function(query) {
        return select.getOperdefList(query);
    }

    $scope.getOperaList = function(query, filed) {
        var paras = [];
        for (var a = 1; a < arguments.length; a++) {
            if (arguments[a])
                paras.push(arguments[a]);
        }
        return select.getOperators(query, paras);
    }

    $scope.getAnesList = function(query, filed) {
        var paras = [];
        for (var a = 1; a < arguments.length; a++) {
            if (arguments[a])
                paras.push(arguments[a]);
        }
        return select.getRole('ANAES_DOCTOR', query, paras);
    }

    $scope.getNurseList = function(query, filed, filed1, filed2, filed3) {
        var paras = [];
        for (var a = 1; a < arguments.length; a++) {
            if (arguments[a])
                paras.push(arguments[a]);
        }
        return select.getRole('NURSE', query, paras);
    }
    $scope.changeOperSource=function(){
        // alert(12)
    }
    $scope.changeAnaesMethods = function() {
        if (!$scope.regOpt.designedAnaesMethodCodes)
            $scope.regOpt.isLocalAnaes = 0;
        else if ($scope.regOpt.designedAnaesMethodCodes.length > 1)
            $scope.regOpt.isLocalAnaes = 0;
        else {
            for (var i=0; i<$scope.regOpt.designedAnaesMethodCodes.length; i++) {
                for(var j=0; j<$scope.anaesMethodList.length; j++) {
                    if($scope.anaesMethodList[j].anaMedId == $scope.regOpt.designedAnaesMethodCodes[i]) {
                        $scope.regOpt.isLocalAnaes = $scope.anaesMethodList[j].isLocalAnaes;
                        break;
                    }
                }
            }
        }
        if($scope.regOpt.isLocalAnaes == 1) {
            $scope.dispatch.anesthetistId = '';
            $scope.dispatch.circuAnesthetistId = '';
        }
    }

    select.getAnaesMethodList().then((rs) => {
        $scope.anaesMethodList = rs.data.resultList;
    })

    select.operroom().then((rs) => {
        $scope.operRoomList = rs.data.resultList;
    });

    select.sysCodeBy('pacType').then((rs) => {
        $scope.pacList = rs.data.resultList;
    })

    select.sysCodeBy('cost_type').then((rs) => {
        var costTypes = rs.data.resultList;
        if(costTypes.length>0){
            $scope.chargeType=[];
            for (var i = 0; i < costTypes.length; i++) {
                $scope.chargeType.push(costTypes[i].codeName);
            }             
         }
    })

    var regOptId = $rootScope.$stateParams.regOptId;

    // 查询
    $scope.regOpt = { };
    $scope.dispatch = {};
    if (regOptId > 0) {
        IHttp.post('operation/searchApplication', { regOptId: regOptId }).then(function(rs) {
            if (rs.data.resultCode != '1')
                return;
            $scope.regOpt = rs.data.resultRegOpt;
            $scope.dispatch = rs.data.resultDispatch;
            $scope.dispatch.regOptId = regOptId;
            $scope.regOpt.operSource += '';
            $scope.regOpt.emergency += '';
            $scope.regOpt.cutLevel += '';
            if ($scope.regOpt.operaDate)
                $scope.regOpt.operaDate = $filter('date')(new Date($scope.regOpt.operaDate), 'yyyy-MM-dd');
        });
    }

    if ($scope.page != 'editOperDateil')
        $scope.regOpt.emergency = '1';

    $scope.$on('save', function(ev) {
        $scope._anesthetist = true;
        $scope.verify = verify();
        if (!$scope.verify) {
            toastr.info('请输入必填项信息');
            return;
        }
        if($scope.beCode==='yxyy' && !$scope.regOpt.cutLevel){
            toastr.info('切口等级不能为空');
            $scope.verify=false;
            return;
        }
        $rootScope.btnActive = false;
        // 修改
        if ($scope.regOpt.regOptId) {
            if (!$scope.dispatch.pcs) {
                $scope.dispatch.pcs = undefined;
            }
            var params = {
                regOpt: $scope.regOpt,
                dispatch: $scope.dispatch
            }
            if (($scope.page == 'editOperDateil' || ($scope.page == 'changeOper' && $scope.regOpt.state == '02')) && $scope.regOpt.emergency == '0')
                params.dispatch = undefined;
            IHttp.post('operation/updateRegOpt', params).then(function(rs) {
                $rootScope.btnActive = true;
                if (rs.data.resultCode != '1')
                    return;
                toastr.success(rs.data.resultMessage);
                if ($scope.page == 'anaeEmergency' || $scope.page == 'nursEmergency')
                    back();
            });
        } else {
            // 保存 》 择期的手术
            if ($scope.regOpt.emergency == 0) {
                IHttp.post('operation/createRegOpt', $scope.regOpt).then(function(rs) {
                    $rootScope.btnActive = true;
                    if (rs.data.resultCode != '1')
                        return;
                    toastr.success(rs.data.resultMessage);
                    back();
                });
            } else {
                // 保存 》 急诊的手术
                IHttp.post('basedata/createEmergencyOperation', { regOpt: $scope.regOpt, dispatch: $scope.dispatch }).then(function(rs) {
                    $rootScope.btnActive = true;
                    if (rs.data.resultCode != '1')
                        return;
                    toastr.success(rs.data.resultMessage);
                    back();
                });
            }
        }
    });

    let checkedNurse = [];
    $scope.focus = function(userName) {
        let nurses = $scope.nurseList;

        $timeout(function() {
            let checkedNurseVal = '';
            if ($scope.dispatch.circunurseId1) {
                checkedNurseVal += $scope.dispatch.circunurseId1;
            }
            if ($scope.dispatch.circunurseId2) {
                checkedNurseVal += $scope.dispatch.circunurseId2;
            }
            if ($scope.dispatch.instrnurseId1) {
                checkedNurseVal += $scope.dispatch.instrnurseId1;
            }
            if ($scope.dispatch.instrnurseId2) {
                checkedNurseVal += $scope.dispatch.instrnurseId2;
            }
            angular.forEach($scope.nurseList, function(nurse, index) {
                if (checkedNurseVal) {
                    if (userName === nurse.userName && checkedNurseVal.indexOf(nurse.userName) >= 0) {
                        checkedNurse.push(nurse);
                    }
                    if (checkedNurseVal.indexOf(nurse.userName) >= 0) {
                        $scope.nurseList.splice(index, 1);
                    }
                }
            });
            // $scope.nurseList = nurses;
            angular.forEach(checkedNurse, function(abc, index) {
                if (checkedNurseVal) {
                    if (checkedNurseVal.indexOf(abc.userName) < 0) {
                        $scope.nurseList.push(abc);
                    }
                }
            });
        }, 500);
    }

    function back() {
        if ($scope.tabsMenu.length <= 1 || $scope.page == 'nursEmergency' || $scope.page == 'anaeEmergency' || ($scope.page == 'editOperDateil'  && $scope.tabsMenu.length > 1  && $scope.tabsMenu[0].name==='手术室安排')) {
            window.history.back();
            // window.location.reload();
        }
    }

    // 验证
    function verify() {
        if ($scope.regOpt.emergency == 1)
            return $scope.patInfo.$valid && !!($scope.regOpt.age || $scope.regOpt.ageMon || $scope.regOpt.ageDay || $scope.regOpt.optLevel) && $scope.operInfo.$valid && $scope.schedule.$valid
        else
            return $scope.patInfo.$valid && !!($scope.regOpt.age || $scope.regOpt.ageMon || $scope.regOpt.ageDay || $scope.regOpt.optLevel) && $scope.operInfo.$valid && (($scope.page != 'editOperDateil' && $scope.regOpt.state != '01' && $scope.regOpt.state != '02') ? $scope.schedule.$valid : true);
    }
}