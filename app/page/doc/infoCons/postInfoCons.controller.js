InfoConsCtrl.$inject = ['$rootScope', '$scope', 'IHttp','$q', 'toastr', 'select', 'auth', '$timeout', 'confirm'];

module.exports = InfoConsCtrl;

function InfoConsCtrl($rootScope,$scope,IHttp, $q,toastr, select, auth, $timeout, confirm) {
     var vm = this,
        promise,
        regOptId = $rootScope.$state.params.regOptId;
    $scope.accede = {};
    $scope.setting = $rootScope.$state.current.data;
    $scope.$emit('readonly', $scope.setting);
    $scope.docInfo = auth.loginUser();
    $scope.docUrl = auth.loginUser().titlePath;
    $scope.saveActive = auth.getDocAuth();
    function init(isDialogBack) {
        IHttp.post("/document/searchAnalgesicInformedConsent", { regOptId: regOptId }).then(function(rs) {
            if (rs.data.resultCode === '1') {
                vm.regOpt = rs.data.basRegOpt;
                vm.analgesicInformedConsent = rs.data.analgesicInformedConsent;
                $scope.OBJ = JSON.parse(vm.analgesicInformedConsent.signName);
                originProcessState = vm.analgesicInformedConsent.processState;
            } else {
                // $mdToast.show($mdToast.simple().content(rs.data.resultMessage).position('bottom left'));
            }
            $scope.eSignature = [];
            angular.forEach($rootScope.userList, function(item) {
                if (item.id == $scope.OBJ.id) {
                    $scope.eSignature.push(item.eSignature);
                }
            })
        });
    }

    init();

    // $scope.$watch('baseSheetIndex', function(newVal, oldVal) {
    //     if ($state.current.name == 'sheetTabs.child' && newVal == 1) {
    //         $rootScope.siteTitle = '术后镇痛知情同意书及访视记录';
    //         init();
    //     } else if ($state.current.name == 'rehealthTabs.child' && newVal == 6) {
    //         $rootScope.siteTitle = '术后镇痛知情同意书及访视记录';
    //         init();
    //     }
    // });


    vm.print = function() {
        $window.print();
    };
    vm.save = function(procState) {
        if (promise) {
            $timeout.cancel(promise);
        }
        var postData = angular.copy(vm.analgesicInformedConsent);
        if (procState === 'END' || procState === 'END_PRINT') {
            postData.processState = 'END';
        } else {
            postData.processState = originProcessState;
        }
        promise = $timeout(function() {
            postData.regOptId = regOptId;
            IHttp.post("/document/saveAnalgesicInformedConsent", postData).then(function(res) {
                // $mdToast.show($mdToast.simple().textContent(res.resultMessage).position('bottom left'));
                if (procState !== "NO_END") {
                    // for (var i = 0; i < docNav.items.length; i++) {
                    //     if (docNav.items[i].name === $rootScope.siteTitle) {
                    //         docNav.items[i].iscomplete = true;
                    //     }
                    // }
                }

                if (procState === 'END' || procState === 'END_PRINT') {
                    if (!$rootScope.isLeader) {
                        vm.analgesicInformedConsent.processState = 'END';
                    } else {
                        originProcessState = 'END';
                    }
                }

                if (procState === 'END_PRINT') {
                    $timeout(function() {
                        $window.print();
                    }, 500);
                }
                init();
            });
        }, 200);
    }
    //获取麻醉医生列表
    $scope.ANAES_DOCTOR = [];
    vm.queryChangeItem = function(Obj) {
        console.log(Obj)
        if (Obj === null) { //×的时候
            vm.analgesicInformedConsent.signId = '';
            vm.analgesicInformedConsent.signName = '';
        }
        if (!Obj) return;
        vm.analgesicInformedConsent.signId = Obj.loginName;
        vm.analgesicInformedConsent.signName = JSON.stringify(Obj);
    }
    $scope.getAnaesdoctorList = function(valuedoc) {
        var deferred = $q.defer();
        if (valuedoc === "" || valuedoc.length < 3)
            return;
        IHttp.post('/basedata/getAllUser', {
            filters: [{
                field: "delFlag",
                value: "1"
            }, {
                field: "userType",
                value: "ANAES_DOCTOR"
            }, {
                field: "loginName",
                value: valuedoc
            }]
        }).then(function(data) {
            $scope.ANAES_DOCTOR = data.userItem;
            return deferred.resolve($scope.ANAES_DOCTOR);
        });
        return deferred.promise;
    };

    function validation(ev) {
        if (vm.analgesicInformedConsent.pcia != '1' && vm.analgesicInformedConsent.pcea != '1') {
            $mdToast.show($mdToast.simple().content("请选择术后镇痛方式！").position('bottom left'));
            ev.stopPropagation();
            return false;
        }
        if (!vm.analgesicInformedConsent.signName || !vm.analgesicInformedConsent.signId) {
            $mdToast.show($mdToast.simple().content("请填写麻醉医生签名！").position('bottom left'));
            ev.stopPropagation();
            return false;
        }
        if (!vm.analgesicInformedConsent.signTime) {
            $mdToast.show($mdToast.simple().content("请麻醉医生填写时间！").position('bottom left'));
            ev.stopPropagation();
            return false;
        }
        return true;
    }
    // 提交
    vm.submit = function(ev, procState) {
        if (vm.analgesicInformedConsent.processState === 'END' && procState === 'END_PRINT') {
            if (!validation(ev)) {
                $scope.showBorder = true;
                return;
            }
            $window.print();
            return;
        }
        if (!validation(ev)) {
            $scope.showBorder = true;
            return;
        }
        if (!$rootScope.isLeader) {
            var confirm;
            if (procState === 'END') {
                // confirm = $mdDialog.confirm()
                //     .title('是否继续提交？')
                //     .textContent('提交的文书将归档，并且不可编辑。')
                //     .targetEvent(ev)
                //     .ok('提交')
                //     .cancel('取消');
            } else if (procState === 'END_PRINT') {
                // confirm = $mdDialog.confirm()
                //     .title('是否继续打印？')
                //     .textContent('打印的文书将归档，且不可编辑。')
                //     .targetEvent(ev)
                //     .ok('打印')
                //     .cancel('取消');
            }

            // $mdDialog.show(confirm).then(function(data) {
            //     vm.save(procState);
            // });
        } else {
            vm.save(procState);
        }
        init();
    }
}