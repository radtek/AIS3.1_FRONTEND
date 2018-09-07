PostLookBackCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$timeout', '$state', 'toastr', 'confirm', 'auth', 'select'];

module.exports = PostLookBackCtrl;

function PostLookBackCtrl($rootScope, $scope, IHttp, $timeout, $state, toastr, confirm, auth, select) {
    var vm = this;
    $scope.setting = $rootScope.$state.current.data;
    let regOptId = $rootScope.$state.params.regOptId;
    $scope.docInfo = auth.loginUser();
    $scope.saveActive = auth.getDocAuth();

    IHttp.post('document/searchPostOperRegard', { 'regOptId': regOptId }).then(function(rs) {
        if (rs.data.resultCode != 1)
            return;
        vm.regOptItem = rs.data.regOptItem;
        vm.bean = rs.data.bean;
        $scope.processState = vm.bean.processState;
        $scope.$emit('processState', vm.bean.processState);
    });

    function save(processState, type) {
        $scope.verify = processState == 'END';
        let content = '';
        if (processState === 'END') {
            // if (!vm.bean.explain) {
            //     toastr.warning('请输入必填项信息');
            //     return;
            // }
            if (type === 'print') {
                if (vm.bean.processState === 'END') {
                    $scope.$emit('doc-print');
                } else {
                    content = '打印的文书将归档，且不可编辑。是否继续打印？';
                    confirm.show(content).then(function(data) {
                        submit(processState, type);
                    });
                }
            } else {
                content = '提交的文书将归档，并且不可编辑。是否继续提交？';
                confirm.show(content).then(function(data) {
                    submit(processState);
                });
            }
        } else {
            submit(processState);
        }
    }

    function submit(processState, type) {
        vm.bean.interviewTime = new Date().getTime();
        vm.bean.processState = processState;
        IHttp.post('document/updatePostOperRegard', vm.bean).then(function(rs) {
            if (rs.data.resultCode === "1") {
                toastr.success(rs.data.resultMessage);
                $scope.processState = vm.bean.processState;
                if (type === 'print') {
                    $scope.$emit('end-print');
                } else {
                    $scope.$emit('processState', vm.bean.processState);
                }
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
