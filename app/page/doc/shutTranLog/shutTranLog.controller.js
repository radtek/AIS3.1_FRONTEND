ShutTranLogCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$window', '$q', '$timeout', '$filter', 'toastr', 'select', 'confirm', 'dateFilter', 'auth'];

module.exports = ShutTranLogCtrl;

function ShutTranLogCtrl($rootScope, $scope, IHttp, $window, $q, $timeout, $filter, toastr, select, confirm, dateFilter, auth) {
    $scope.setting = $rootScope.$state.current.data;

    var promise;
    var vm = this;
    $scope.docInfo = auth.loginUser();
    $scope.docUrl = auth.loginUser().titlePath;
    $scope.saveActive = auth.getDocAuth();

    IHttp.post('document/searchPatShuttleTransfer', { 'regOptId': $rootScope.$stateParams.regOptId }).then(function(res) {
        $scope.regOptItem = res.data.regOptItem;
        $scope.patShuttleTransfer = res.data.patShuttleTransfer;

        //初始化时发送文书状态
        $scope.processState = $scope.patShuttleTransfer.processState;
        $scope.$emit('processState', $scope.patShuttleTransfer.processState);
        if (!!$scope.patShuttleTransfer.signTime) {
            $scope.patShuttleTransfer.signTime = dateFilter(new Date($scope.patShuttleTransfer.signTime), 'yyyy-MM-dd');
        }
        if (!!$scope.patShuttleTransfer.nuserSignTime) {
            $scope.patShuttleTransfer.nuserSignTime = dateFilter(new Date($scope.patShuttleTransfer.nuserSignTime), 'yyyy-MM-dd');
        }
        $scope.content1 = res.data.content1 ? res.data.content1 : {};
        if (!!$scope.content1.signTime) {
            $scope.content1.signTime = dateFilter(new Date($scope.content1.signTime), 'yyyy-MM-dd');
        }
        $scope.content2 = res.data.content2 ? res.data.content2 : {};
        if (!!$scope.content2.signTime) {
            $scope.content2.signTime = dateFilter(new Date($scope.content2.signTime), 'yyyy-MM-dd');
        }
        //$scope.patShuttleTransfer = {};
        if ($scope.patShuttleTransfer) {
            //把基础查询中不可为空的数据绑定          
            $scope.patShuttleTransfer.id = res.data.patShuttleTransfer.id;
            $scope.patShuttleTransfer.regOptId = res.data.patShuttleTransfer.regOptId;
        }

        if (!res.data.patShuttleTransfer.worn) {
            res.data.patShuttleTransfer.worn = {};
        } else {
            res.data.patShuttleTransfer.worn = JSON.parse(res.data.patShuttleTransfer.worn);
        }
        if (!res.data.patShuttleTransfer.goodsRemove) {
            res.data.patShuttleTransfer.goodsRemove = {};
        } else {
            res.data.patShuttleTransfer.goodsRemove = JSON.parse(res.data.patShuttleTransfer.goodsRemove);
        }
        if (!res.data.patShuttleTransfer.preAdviceExec) {
            res.data.patShuttleTransfer.preAdviceExec = {};
        } else {
            res.data.patShuttleTransfer.preAdviceExec = JSON.parse(res.data.patShuttleTransfer.preAdviceExec);
        }
        if (!res.data.patShuttleTransfer.veinBody) {
            res.data.patShuttleTransfer.veinBody = {};
        } else {
            res.data.patShuttleTransfer.veinBody = JSON.parse(res.data.patShuttleTransfer.veinBody);
        }

        if (!$scope.content1.unuseDrug) {
            $scope.content1.unuseDrug = {};
        } else {
            $scope.content1.unuseDrug = JSON.parse($scope.content1.unuseDrug);
        }
        if (!$scope.content2.unuseDrug) {
            $scope.content2.unuseDrug = {};
        } else {
            $scope.content2.unuseDrug = JSON.parse($scope.content2.unuseDrug);
        }

        if (!$scope.content1.surplus) {
            $scope.content1.surplus = {};
        } else {
            $scope.content1.surplus = JSON.parse($scope.content1.surplus);
        }
        if (!$scope.content2.surplus) {
            $scope.content2.surplus = {};
        } else {
            $scope.content2.surplus = JSON.parse($scope.content2.surplus);
        }

        if (!$scope.content1.skinFull) {
            $scope.content1.skinFull = {};
        } else {
            $scope.content1.skinFull = JSON.parse($scope.content1.skinFull);
        }
        if (!$scope.content2.skinFull) {
            $scope.content2.skinFull = {};
        } else {
            $scope.content2.skinFull = JSON.parse($scope.content2.skinFull);
        }

        if (!$scope.content1.operroomTake) {
            $scope.content1.operroomTake = {};
        } else {
            $scope.content1.operroomTake = JSON.parse($scope.content1.operroomTake);
        }
        if (!$scope.content2.operroomTake) {
            $scope.content2.operroomTake = {};
        } else {
            $scope.content2.operroomTake = JSON.parse($scope.content2.operroomTake);
        }

        if (!$scope.content1.veinBody) {
            $scope.content1.veinBody = {};
        } else {
            $scope.content1.veinBody = JSON.parse($scope.content1.veinBody);
        }
        if (!$scope.content2.veinBody) {
            $scope.content2.veinBody = {};
        } else {
            $scope.content2.veinBody = JSON.parse($scope.content2.veinBody);
        }

        if (!$scope.content1.other) {
            $scope.content1.other = {};
        } else {
            $scope.content1.other = JSON.parse($scope.content1.other);
        }
        if (!$scope.content2.other) {
            $scope.content2.other = {};
        } else {
            $scope.content2.other = JSON.parse($scope.content2.other);
        }
    });
    vm.save = save;
    vm.print = print;
    vm.submit = submit;
    // 获取系统时间
    var date = new Date();
    vm.year = date.getFullYear();
    vm.mouth = date.getMonth() + 1;
    vm.day = date.getDate();

    select.getNurses().then((rs) => {
        $scope.singUserItem = rs.data.userItem;
    });

    function save(type, state) {
        let content = '';
        if (type === 'END') {
            if (state === 'print') {
                if ($scope.patShuttleTransfer.processState === 'END')
                    $scope.$emit('doc-print');
                else {
                    content = '打印的文书将归档，且不可编辑。是否继续打印？';
                    confirm.show(content).then((data) => {
                        fn_save(type, state);
                    });
                }
            } else {
                content = '提交的文书将归档，并且不可编辑。是否继续提交？';
                confirm.show(content).then((data) => {
                    fn_save(type);
                });
            }
        } else {
            fn_save(type);
        }
    }

    function fn_save(processState, state) {
        $rootScope.btnActive = false;
        var patShuttleTransfer1 = angular.copy($scope.patShuttleTransfer);

        var content1 = angular.copy($scope.content1);
        var content2 = angular.copy($scope.content2);
        content1.checkPoint = "1";
        content2.checkPoint = "2";
        patShuttleTransfer1.nuserSignTime = new Date($filter('date')(new Date(patShuttleTransfer1.nuserSignTime), 'yyyy-MM-dd')).getTime();
        patShuttleTransfer1.processState = processState;
        //保存----------------------------begin;
        IHttp.post('document/savePatShuttleTransfer', {
            patShuttleTransfer: patShuttleTransfer1,
            content1: content1,
            content2: content2
        }).then(function(res) {
            $rootScope.btnActive = true;
            if (res.data.resultCode === '1') {
                toastr.success(res.data.resultMessage);
                $scope.patShuttleTransfer.processState = processState;
                $scope.processState = $scope.patShuttleTransfer.processState;
                if (state === 'print') {
                    $scope.$emit('end-print');
                } else {
                    $scope.$emit('processState', $scope.patShuttleTransfer.processState);
                }
            }
        });
    }

    function submit() {
        var url = 'document/patShuttleTransfer';
        IHttp
            .post(url, vm.data.anaesRecord)
            .then(function(res) {

                toastr.info(res.data.resultMessage);
            });
    }

    vm.clearOther = function(other) {
        eval('vm.' + other + '=""');
    }


    $scope.$on('save', () => {
        if ($scope.saveActive && $scope.processState == 'END')
            fn_save('END');
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