metachysisCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'auth', 'toastr', 'select', '$timeout', 'confirm'];

module.exports = metachysisCtrl;

function metachysisCtrl($rootScope, $scope, IHttp, auth, toastr, select, $timeout, confirm) {
    var vm = this,
        regOptId = $rootScope.$stateParams.regOptId;

    $scope.setting = $rootScope.$state.current.data;
    $scope.docInfo = auth.loginUser();

    $scope.$emit('readonly', $scope.setting);
    $scope.saveActive = auth.getDocAuth();

    $scope.arr_BloodType = ['A', 'B', 'AB', 'O'];
    $scope.arr_RH = ['阴性', '阳性'];
    select.getAnaesthetists().then((rs) => {
        $scope.anesthetistList = rs.data.userItem;
    });
    $timeout(function() {
        $scope.$watch('vm.preVisit.anaestheitistId', function(n, o) {
            $scope.eSignatureAnaestheitist = [];
            angular.forEach($scope.anesthetistList, function(item) {
                if (item.userName == n) {
                    $scope.eSignatureAnaestheitist.push(item.picPath + '?t=' + new Date().getTime());
                }
            })
        }, true)
    }, 1000);

    init();

    function init() {
        IHttp.post('document/searchOptBloodTransRecordByRegOptId', { regOptId: regOptId }).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            $scope.regOpt = rs.data.regOpt;
            $scope.dispatch = rs.data.dispatch;
            $scope.bloodTransRecord = rs.data.bloodTransRecord;
            $scope.processState = rs.data.bloodTransRecord.processState;
            $scope.$emit('processState', $scope.processState);
        });
    };

    function save(processState, type) {
        $scope.verify = processState == 'END';
        if (processState == 'END') {
            if (type == 'print') {
                if ($scope.processState == 'END')
                    $scope.$emit('doc-print');
                else
                    confirm.show('提交的文书将归档，并且不可编辑，是否继续提交？').then(function(data) { submit(processState, type); });
            } else {
                if ($scope.processState == 'END')
                    submit(processState);
                else
                    confirm.show('打印的文书将归档，且不可编辑，是否继续打印？').then(function(data) { submit(processState, type); });
            }
        } else
            submit(processState);
    };

    function submit(processState, state) {
        var params = angular.copy($scope.bloodTransRecord);
        params.processState = processState;
        IHttp.post('document/updateBloodTransRecord', params).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            toastr.success(rs.data.resultMessage);
            $scope.processState = processState;
            if (state == 'print') {
                $scope.$emit('end-print');
            } else {
                $scope.$emit('processState', $scope.processState);
            }
        });
    }

    $scope.$on('save', () => {
        if ($scope.saveActive && $scope.processState == 'END')
            save('END');
        else
            save('NO_END');
    });

    $scope.$on('print', () => {
        if (!$scope.bloodTransRecord.reactTime)
            $scope.bloodTransRecord.reactTime = '无';
        $timeout(function() {
            save('END', 'print');
        })
    });

    $scope.$on('submit', () => {
        save('END');
    });
}