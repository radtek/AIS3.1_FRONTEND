PlacentaAgreeLog.$inject = ['$rootScope', '$scope', 'IHttp','$timeout', 'auth', 'toastr', '$q', '$window', 'dateFilter', 'confirm', 'select'];

module.exports = PlacentaAgreeLog;

function PlacentaAgreeLog($rootScope, $scope, IHttp,$timeout, auth, toastr, $q, $window, dateFilter, confirm, select) {
    var vm = this;
    $scope.setting = $rootScope.$state.current.data;
    $scope.$emit('readonly', $scope.setting);
    $scope.docInfo = auth.loginUser();

    select.getNurses().then((rs) => {
        $scope.nurseList = rs.data.userItem;
    });

    IHttp.post('document/searchPlacentaHandleAgreeByRegOptId', { 'regOptId': $rootScope.$stateParams.regOptId }).then(function(rs) {
        if (rs.data.resultCode !== '1') return;
        vm.regOptItem = rs.data.searchRegOptByIdFormBean;
        $scope.placentaHandleAgree = rs.data.placentaHandleAgree;

        //初始化时发送文书状态
        $scope.processState = $scope.placentaHandleAgree.processState;
        $scope.$emit('processState', $scope.placentaHandleAgree.processState);
    });
    $timeout(function() {
        $scope.$watch('placentaHandleAgree.docSign', function(n, o) {
            $scope.hasSig = false;
            $scope.eSignatureAnesthetist = [];
            angular.forEach($scope.nurseList, function(item) {
                if (item.userName == n) {
                    $scope.hasSig = item.picPath ? true : false;
                    $scope.eSignatureAnesthetist.push({ hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime() });
                }
            })
        }, true)
    }, 1000);

    function save(processState, type) {
        $scope.verify = processState == 'END';
        if (processState === 'END' && (!$scope.placentaHandleAgree.placentaCase || !$scope.placentaHandleAgree.placentaHandle || !$scope.placentaHandleAgree.docSign)) {
            toastr.warning('请输入必填项信息');
            return;
        }
        if ($scope.placentaHandleAgree.processState === 'END' && processState === 'END') {
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
            if ($scope.placentaHandleAgree.processState === 'END') {
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

    function submit(processState, state) {
        $scope.placentaHandleAgree.processState = processState;
        IHttp.post('document/updatePlacentaHandleAgree', $scope.placentaHandleAgree).then((rs) => {
            if (rs.data.resultCode === '1') {
                toastr.success(rs.data.resultMessage);
                $scope.processState = $scope.placentaHandleAgree.processState;
                if (state === 'print') {
                    $scope.$emit('end-print');
                } else {
                    $scope.$emit('processState', $scope.placentaHandleAgree.processState);
                }
            } else {
                toastr.error(rs.data.resultMessage);
            }
        });
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

}