VeinAccedeCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'toastr', 'auth', 'select', 'confirm'];

module.exports = VeinAccedeCtrl;

function VeinAccedeCtrl($rootScope, $scope, IHttp, toastr, auth, select, confirm) {
    var vm = this,
        promise;
    var regOptId = $rootScope.$state.params.regOptId;
    $scope.accede = {};
    $scope.setting = $rootScope.$state.current.data;
    $scope.$emit('readonly', $scope.setting);
    $scope.docInfo = auth.loginUser();
    $scope.docUrl = auth.loginUser().titlePath;
    $scope.saveActive = auth.getDocAuth();

    select.getAnaesthetists().then((rs) => {
        $scope.anesthetistList = rs.data.userItem;
    });

    function initData() {
        IHttp.post('document/searchDocVeinAccedeByRegOptId', { 'regOptId': regOptId }).then(function(rs) {
            if (rs.data.resultCode != 1)
                return;
            $scope.regOptItem = rs.data.regOptItem;
            $scope.docVeinAccede = rs.data.docVeinAccede;

            $scope.processState = $scope.docVeinAccede.processState;
            $scope.$emit('processState', $scope.docVeinAccede.processState);
        });
    }

    initData();

    $scope.save = function(type, state) {
        $scope.verify = type == 'END';
        if (type == 'END') {
            $scope.showBorder = true;
            if (!$scope.docVeinAccede.visitDoctor || (!$scope.docVeinAccede.asa && !$scope.docVeinAccede.asaE)) {
                toastr.warning('请输入必填项信息');
                return;
            }

            if (state == 'print') {
                if ($scope.docVeinAccede.processState == 'END') {
                    $scope.$emit('doc-print');
                    return;
                } else {
                    confirm.show('打印的文书将归档，且不可编辑，是否继续打印？').then(function(data) {
                        fn_save(type, state);
                    });
                }
            } else {
                confirm.show('提交的文书将归档，且不可编辑，是否继续提交？').then(function(data) {
                    fn_save(type);
                });
            }
        } else {
            $scope.showBorder = false;
            fn_save(type);
        }
    }

    function fn_save(processState, state) {
        $scope.docVeinAccede.processState = processState;
        IHttp.post('document/updateDocVeinAccede', $scope.docVeinAccede).then(function(rs) {
            if (rs.data.resultCode != 1)
                return;
            $scope.docVeinAccede.processState = processState;
            toastr.success(rs.data.resultMessage);
            $scope.processState = processState;
            if (state == 'print') {
                $scope.$emit('end-print');
            } else {
                $scope.$emit('processState', $scope.docVeinAccede.processState);
            }
        });
    }

    $scope.$watch('docVeinAccede.nervous', function(n, o) {
        if (n == 1) {
            $scope.docVeinAccede.nervousMap.a = 0;
            $scope.docVeinAccede.nervousMap.b = 0;
            $scope.docVeinAccede.nervousMap.c = 0;
            $scope.docVeinAccede.nervousMap.d = 0;
            $scope.docVeinAccede.nervousOther = '';
        }
    }, true);
    $scope.$watch('docVeinAccede.breath', function(n, o) {
        if (n == 1) {
            $scope.docVeinAccede.breathMap.a = 0;
            $scope.docVeinAccede.breathMap.b = 0;
            $scope.docVeinAccede.breathMap.c = 0;
            $scope.docVeinAccede.smokingFreq = '';
            $scope.docVeinAccede.smokingTime = '';
        }
    }, true);
    $scope.$watch('docVeinAccede.heartBool', function(n, o) {
        if (n == 1) {
            $scope.docVeinAccede.heartBoolMap.a = 0;
            $scope.docVeinAccede.heartBoolMap.b = 0;
            $scope.docVeinAccede.heartBoolMap.c = 0;
            $scope.docVeinAccede.heartBoolMap.d = 0;
            $scope.docVeinAccede.heartBoolMap.e = 0;
        }
    }, true);
    $scope.$watch('docVeinAccede.hereditary', function(n, o) {
        if (n == 1) {
            $scope.docVeinAccede.hereditaryMap.a = 0;
            $scope.docVeinAccede.hereditaryMap.b = 0;
            $scope.docVeinAccede.hereditaryMap.c = 0;
            $scope.docVeinAccede.hereditaryMap.d = 0;
            $scope.docVeinAccede.hereditaryOther = '';
        }
    }, true);

    $scope.$on('save', () => {
        if ($scope.saveActive && $scope.processState == 'END')
            fn_save('END');
        else
            $scope.save('NO_END');
    });

    $scope.$on('print', () => {
        $scope.save('END', 'print');
    });

    $scope.$on('submit', () => {
        $scope.save('END');
    })

}
