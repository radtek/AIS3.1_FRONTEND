InfoConsCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'toastr', 'auth', '$timeout', 'select', '$window', 'confirm'];

module.exports = InfoConsCtrl;

function InfoConsCtrl($rootScope, $scope, IHttp, toastr, auth, $timeout, select, $window, confirm) {
    var vm = this,
        promise;
    var regOptId = $rootScope.$state.params.regOptId;
    $scope.accede = {};
    $scope.setting = $rootScope.$state.current.data;
    $scope.$emit('readonly', $scope.setting);
    $scope.docInfo = auth.loginUser();
    $scope.saveActive = auth.getDocAuth();

    select.getAnaesthetists().then(function(rs) {
        if (rs.data.resultCode != 1)
            return;
        $scope.anesthetistList = rs.data.userItem;
    });

    $timeout(function() {
        $scope.$watch('accedeItem.anaestheitistId', function(n, o) {
            $scope.eSignatureAnaestheitist = [];
            angular.forEach($scope.anesthetistList, function(item) {
                if (item.userName == n) {
                    $scope.eSignatureAnaestheitist.push(item.picPath + '?t=' + new Date().getTime());
                }
            })
        }, true)
    }, 1000);

    function init() {
        IHttp.post('document/searchPreAnaesTalkRecord', { 'regOptId': regOptId }).then(function(rs) {
            if (rs.data.resultCode != 1)
                return;
            $scope.regOptItem = rs.data.regOptItem ? rs.data.regOptItem : rs.data.regOpt;
            $scope.preAnaesTalkRecord = rs.data.preAnaesTalkRecord;
            // $scope.accedeItem = rs.data.accedeItem;
            // $scope.processState = $scope.accedeItem.processState;
            // $scope.$emit('processState', $scope.processState);
        });
    }

    init();

    $scope.save = function(type, state) {
        $scope.verify = type == 'END';
        if (type == 'END') {
            $scope.showBorder = true;
            // if (!$scope.regOptItem.anesthetistId ) { 
            //     toastr.warning('请输入必填项信息');
            //     return;
            // }
            if (state == 'print') {
                if (true)
                    $scope.$emit('doc-print');
                else
                    confirm.show('打印的文书将归档，且不可编辑，是否继续打印？').then(function(data) { fn_save(type, state); });
            } else {
                if ($scope.accedeItem.processState == 'END')
                    fn_save(type);
                else
                    confirm.show('提交的文书将归档，且不可编辑，是否继续提交？').then(function(data) { fn_save(type); });
            }
        } else {
            $scope.showBorder = false;
            fn_save(type);
        }
    }

    function fn_save(processState, state) {
        for (var i in $scope.preAnaesTalkRecord) {
            if (i == 'id') {
                $scope.preAnaesTalkRecord[i] = $scope.preAnaesTalkRecord[i] ? $scope.preAnaesTalkRecord[i] : '';
            } else {
                $scope.preAnaesTalkRecord[i] = $scope.preAnaesTalkRecord[i] ? $scope.preAnaesTalkRecord[i] : $scope.regOptItem[i];

            }
        }
        IHttp.post('document/updatePreAnaesTalkRecord', $scope.preAnaesTalkRecord).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            toastr.success(rs.data.resultMessage);
            // $scope.accedeItem.processState = processState;
            // $scope.processState = processState;
            if (state == 'print') {
                $scope.$emit('end-print');
            } else {
                $scope.$emit('processState', processState);
            }
        });
    }

    $scope.$on('save', () => {
        if ($scope.saveActive && $scope.processState == 'END')
            $scope.save('END');
        else
            $scope.save('NO_END');
    });

    $scope.$on('print', () => {
        $scope.save('END', 'print');
    });

    $scope.$on('submit', () => {
        $scope.save('END');
    });
}