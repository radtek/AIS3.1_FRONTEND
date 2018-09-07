preOperEducation.$inject = ['$rootScope', '$scope', 'IHttp', '$timeout', '$state', '$q', 'toastr', 'confirm', 'auth', '$filter', 'select'];

module.exports = preOperEducation;

function preOperEducation($rootScope, $scope, IHttp, $timeout, $state, $q, toastr, confirm, auth, $filter, select) {
    var vm = this,
        promise;
    $scope.setting = $rootScope.$state.current.data;
    let regOptId = $rootScope.$state.params.regOptId;
    $scope.docInfo = auth.loginUser();
    $scope.saveActive = auth.getDocAuth();
    init()
    function init() {
        IHttp.post("document/searchPrePublicityByRegOptId", { regOptId }).then(function(rs) {
            var rs = rs.data
            if (rs.resultCode != 1) return;
            vm.prePublicity = rs.prePublicity;
            if (!vm.prePublicity.date) {
                vm.prePublicity.date = vm.prePublicity.date ? vm.prePublicity.date : $filter('date')(new Date(), 'yyyy-MM-dd');
                // $scope.update();
            }else{
                vm.prePublicity.date=$filter('date')(new Date(vm.prePublicity.date), 'yyyy-MM-dd');
            }
            vm.regOpt = rs.regOpt;
            $scope.processState=vm.prePublicity.processState;
            $scope.$emit('processState', vm.prePublicity.processState);
        });
    }
    // $scope.update = function() {
    //     IHttp.post("document/updatePrePublicity", vm.prePublicity).then(function(rs) {
    //         var rs = rs.data
    //         if (rs.resultCode != 1) return;
    //         vm.prePublicity = rs.prePublicity;
    //         if (!vm.prePublicity.date) {
    //             vm.prePublicity.date = vm.prePublicity.date ? vm.prePublicity.date : $filter('date')(new Date(), 'yyyy-MM-dd');
    //         }
    //         vm.regOpt = rs.regOpt;
    //     });
    // }

    //保存 提交文书
    function save(type, state) {
        $scope.verify = type == 'END';
        let content = '';
        if ($scope.processState === undefined) {
            toastr.error('操作失败，无效的数据！');
            return;
        }
        if (type === 'END') {
            if (!vm.prePublicity.organNormal || !vm.prePublicity.leaveTo || !vm.prePublicity.preAnesEvaLevel || !vm.prePublicity.asa || !vm.prePublicity.anaestheitistName || !vm.prePublicity.signDate) {
                toastr.warning('请输入必填项信息');
                return;
            }
            if (state === 'print') {
                if ($scope.processState === 'END') {
                    $scope.$emit('doc-print');
                } else {
                    content = '打印的文书将归档，且不可编辑。是否继续打印？';
                    confirm.show(content).then(function(data) {
                        submit(type, state);
                    });
                }
            } else {
                content = '提交的文书将归档，并且不可编辑。是否继续提交？';
                confirm.show(content).then(function(data) {
                    submit(type);
                });
            }
        } else {
            submit(type);
        }
    }

    function submit(processState, type) {
        var def = $q.defer();
        vm.prePublicity.processState = processState;
        IHttp.post('document/updatePrePublicity',vm.prePublicity).then(function(rs) {
            if (rs.data.resultCode === "1") {
                toastr.success(rs.data.resultMessage);
                $scope.processState = vm.prePublicity.processState;
                if (type === 'print') {
                    $scope.$emit('end-print');
                } else {
                    $scope.$emit('processState', vm.prePublicity.processState);
                }
            }
        });
    }

    function save(processState, type) {
        $scope.verify = processState == 'END';
        let content = '';
        if (processState === 'END') {
            // if (!vm.prePublicity.organNormal || !vm.prePublicity.leaveTo || !vm.prePublicity.preAnesEvaLevel || !vm.prePublicity.asa  || !vm.prePublicity.signDate) {
            //     toastr.warning('请输入必填项信息');
            //     return;
            // }
            if (type === 'print') {
                if (vm.prePublicity.processState === 'END') {
                    $scope.$emit('doc-print');
                } else {
                    content = '打印的文书将归档，且不可编辑。是否继续打印？';
                    confirm.show(content).then(function(data) {
                        submit(processState, type);
                    });
                }
            } else {
                // content = '提交的文书将归档，并且不可编辑。是否继续提交？';
                // confirm.show(content).then(function(data) {
                    submit(processState);
                // });
            }
        } else {
            submit(processState);
        }
    }

     $scope.$on('save', () => {
        if ($scope.saveActive && $scope.processState == 'END')
            save('END');
        else
            save('NO_END');
    });

    $scope.$on('print', () => {
        save('END', 'print');
    });

    $scope.$on('submit', () => {
        save('END');
    })
}
