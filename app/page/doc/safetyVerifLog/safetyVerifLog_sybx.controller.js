SafetyVerifLogCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'select', '$uibModal', 'toastr', 'auth', '$timeout', 'confirm'];

module.exports = SafetyVerifLogCtrl;

function SafetyVerifLogCtrl($rootScope, $scope, IHttp, select, $uibModal, toastr, auth, $timeout, confirm) {
    var vm = this;
    var regOptId = $rootScope.$stateParams.regOptId;

    // 获取文书的标题
    var crumbsLen = $rootScope.crumbs.length;
    $scope.setting = $rootScope.$state.current.data;
    $scope.$emit('readonly', $scope.setting);
    $scope.docInfo = auth.loginUser();
    $scope.saveActive = auth.getDocAuth();
    var beCode = $scope.docInfo.beCode;
    if ($rootScope.crumbs[crumbsLen - 1])
        $scope.docInfo.docName = $rootScope.crumbs[crumbsLen - 1].name;

    IHttp.post('document/searchSafeCheckByRegOptId', { regOptId: regOptId }).then(function(rs) {
        if (rs.data.resultCode != 1)
            return;
        $scope.safeCheck = rs.data.safeCheck;
        // 基本信息
        $scope.regOpt = rs.data.regOptItem;
        
        $scope.baseData = rs.data.safeCheckFormBean;
        // 麻醉实施前
        $scope.anaesBeforeSafeCheck = rs.data.anaesBeforeSafeCheck;
        // 手术开始前
        $scope.operBeforeSafeCheck = rs.data.operBeforeSafeCheck;
        // 出手术室
        $scope.exitOperSafeCheck = rs.data.exitOperSafeCheck;

        $scope.processState = rs.data.safeCheck.processState;
    });

    // 麻醉医师
    select.getAnaesthetists().then(function(rs) {
        if (rs.data.resultCode != 1)
            return;
        $scope.anesthetistList = rs.data.userItem;
    });

    // 手术医师
    select.getOperators().then(function(rs) {
        if (rs.length <= 0)
            return;
        $scope.operatorList = rs;
    });

    // 巡回护士
    select.getNurses().then(function(rs) {
        if (rs.data.resultCode != 1)
            return;
        $scope.circunurseList = rs.data.userItem;
    });

    $timeout(function (){
         $scope.$watch('safeCheck.anesthetistIdList', function(signName, o) {
            $scope.hasAnaesSig3 = false;
            $scope.eSignatureAnanesthetist3 = [];
            angular.forEach($scope.anesthetistList, function(item) {
                for (var sign of signName) {
                    if (item.userName == sign) {
                        if (!$scope.hasAnaesSig3)
                            $scope.hasAnaesSig3 = item.picPath ? true : false;
                        $scope.eSignatureAnanesthetist3.push({hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime()});
                    }
                }
            })
        }, true);
         $scope.$watch('safeCheck.circunurseIdList', function(signName, o) {
            $scope.hasNurseSig3 = false;
            $scope.eSignatureCircuNurse3 = [];
            angular.forEach($scope.circunurseList, function(item) {
                for (var sign of signName) {
                    if (item.userName == sign) {
                        if (!$scope.hasNurseSig3)
                            $scope.hasNurseSig3 = item.picPath ? true : false;
                        $scope.eSignatureCircuNurse3.push({hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime()});
                    }
                }
            })
        }, true);
    }, 1000)

    vm.exitOperSafeCheckWin = function() { // 其它留置管路
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            template: require('./model/otherWin.html'),
            controller: require('./model/otherWin.controller.js'),
            less: require('./model/otherWin.less'),
            resolve: { param: { other2: $scope.exitOperSafeCheck.other2 } }
        }).result.then(function(rs) {
            $scope.exitOperSafeCheck.other2 = rs;
        });
    }

    function save(processState, type) {
           $scope.verify = processState == 'END';
        if (processState == 'END') {
            if  (processState === 'END' && (!$scope.operBeforeSafeCheck.anesthetistIdList.length > 0 || !$scope.operBeforeSafeCheck.circunurseIdList.length > 0 || !$scope.operBeforeSafeCheck.operatorIdList.length > 0 || (!$scope.exitOperSafeCheck.whereabouts && $scope.exitOperSafeCheck.other1.length <= 0)))  {
                toastr.warning('请输入必填项信息');
                return;
            }
            if (type && $scope.safeCheck.processState  == 'END')
                $scope.$emit('doc-print');
            else if (type)
                confirm.show('打印的文书将归档，且不可编辑。是否继续打印？').then(function(data) { submit(processState); });
            else if ($scope.safeCheck.processState)
                submit(processState, type);
            else
                confirm.show('提交的文书将归档，并且不可编辑。是否继续提交？').then(function(data) { submit(processState); });
        } else
            submit(processState, type)
    }
    function submit(processState, type) {
        $scope.safeCheck.processState = processState;
        var params = {
            anaesBeforeSafeCheck: $scope.anaesBeforeSafeCheck,
            exitOperSafeCheck: $scope.exitOperSafeCheck,
            operBeforeSafeCheck: $scope.operBeforeSafeCheck,
            safeCheck:$scope.safeCheck

        }
        if (beCode === 'nhfe' || beCode === 'qnzzyyy') {
            var operatorList = [];
            var anesthetistList = [];
            var circunurseList = [];
            operatorList.push($scope.operBeforeSafeCheck.operatorId);
            anesthetistList.push($scope.operBeforeSafeCheck.anesthetistId);
            circunurseList.push($scope.operBeforeSafeCheck.circuNurseId);
            params.operBeforeSafeCheck.operatorList = operatorList;
            params.operBeforeSafeCheck.anesthetistList = anesthetistList;
            params.operBeforeSafeCheck.circunurseList = circunurseList;

        }
        IHttp.post('document/updateSafeCheck', params).then((rs) => {
            if (rs.data.resultCode != 1)
                return;
            toastr.success(rs.data.resultMessage);
            $scope.safeCheck.processState = processState
            $scope.processState = processState
            if (type === 'print') {
                $scope.$emit('end-print');
            } else {
                $scope.$emit('processState', $scope.processState);
            }
        });
    }
    $scope.$watch('processState', function(n) {
        if (n == undefined)
            return;
        $scope.$emit('processState', n);
    }, true);

    $scope.$on('save', function() {
       if ($scope.saveActive && $scope.processState == 'END')
            save('END');
        else
            save('NO_END');

    });

    $scope.$on('submit', function() {
        save('END');
    });

    $scope.$on('print', function() {
        save('END', 'print');
    });
}