InfoConsCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'toastr', 'select', 'auth', '$timeout', 'confirm'];

module.exports = InfoConsCtrl;

function InfoConsCtrl($rootScope, $scope, IHttp, toastr, select, auth, $timeout, confirm) {
    var vm = this,
        promise,
        regOptId = $rootScope.$state.params.regOptId;
    $scope.accede = {};
    $scope.setting = $rootScope.$state.current.data;
    $scope.$emit('readonly', $scope.setting);
    $scope.docInfo = auth.loginUser();
    $scope.docUrl = auth.loginUser().titlePath;
    $scope.saveActive = auth.getDocAuth();

    var num = 11;
    $scope.trData = [];
    $scope.appendContext = function() {
        $scope.trData.push({ id: num, content: '' });
        num++;
    }

    select.getAnaesMethodList().then((rs) => {
        $scope.anaesMethodList = rs.data.resultList;
    });

    select.getAnaesthetists().then((rs) => {
        $scope.anesthetistList = rs.data.userItem;
    });

    $timeout(function() {
        $scope.$watch('accedeItem.anaestheitistId', function(n, o) {
            $scope.hasSig = false;
            $scope.eSignatureAnaestheitist = [];
            angular.forEach($scope.anesthetistList, function(item) {
                if (item.userName == n) {
                    $scope.hasSig = item.picPath ? true : false;
                    $scope.eSignatureAnaestheitist.push({hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime()});
                }
            })
        }, true)
    }, 1000);

    function init() {
        var optid = $rootScope.$state.params.regOptId;
        IHttp.post('document/searchAccedeByRegOptId', { 'regOptId': optid }).then(function(res) {
            if (res.data.resultCode != 1)
                return;
            $scope.regOptItem = res.data.regOptItem;
            $scope.accedeItem = res.data.accedeItem;

            $scope.processState = $scope.accedeItem.processState;
            $scope.$emit('processState', $scope.accedeItem.processState);
            var selectedCode = $scope.accedeItem.selected.split(",");
            for (var item in selectedCode) {
                $scope.selectedList_[item] = selectedCode[item];
            }
            if (!!res.data.accedeInformedList) {
                $scope.accedeInformedList = res.data.accedeInformedList;
            } else {
                $scope.accedeInformedList = [];
            }
            $scope.trData = $scope.accedeInformedList;
            num += $scope.trData.length;
        });
    }

    init();

    $scope.save = function(type, state) {
        $scope.verify = type == 'END';
        if ($scope.accedeItem.processState == undefined) {
            toastr.error('操作失败，无效的数据！')
            return;
        }

        if (type == 'END') {
            $scope.showBorder = true;
            if ($scope.docInfo.beCode == 'hbgzb' && !$scope.accedeItem.trachealTntubation && !$scope.accedeItem.catheterizationArtery && !$scope.accedeItem.centralCatheter && !$scope.accedeItem.spinalPuncture && !$scope.accedeItem.laryngeal && !$scope.accedeItem.brachialPlexusBlock) {
                toastr.warning('请输入必填项信息');
                return;
            }

            if (state == 'print') {
                if ($scope.accedeItem.processState == 'END') {
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
        $scope.accedeItem.processState = processState;
        if ($scope.accedeItem.anaesMethodList.length == 0) {
            $scope.accedeItem.anaesMethodList = [];
        }
        var accedeInformedList = [];
        for (var i = 0; i < $scope.accedeInformedList.length; i++) {
            if ($scope.accedeInformedList[i].content != "") {
                $scope.accedeInformedList[i].accedeId = $scope.accedeItem.accedeId;
                accedeInformedList.push($scope.accedeInformedList[i]);
            }
        }
        var parm = {
            accedeInformedList: accedeInformedList,
            accede: $scope.accedeItem
        };
        IHttp.post('document/updateAccede', parm).then(function(res) {
            if (res.data.resultCode != 1)
                return;
            $scope.accedeItem.processState = processState;
            toastr.success(res.data.resultMessage);
            $scope.processState = processState;
            if (state == 'print') {
                $scope.$emit('end-print');
            } else {
                $scope.$emit('processState', $scope.accedeItem.processState);
            }
        });
    }

    $scope.selectedList_ = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var listWatch = $scope.$watch('selectedList_', function(n, o) {
        if (n == o || o == undefined) return;
        var selectedList = [], num = 0;
        for (var item in $scope.selectedList_) {
            if ($scope.selectedList_[item] == 1)
                num += 1;
            selectedList.push($scope.selectedList_[item] + '');
        }
        $scope.accedeItem.selectedList = selectedList;
        $scope.accedeItem.selectNum = num;
    }, true);

    $scope.delete = function(item, index) {
        $scope.trData.splice(index, 1);
        fn_save('NO_END');
    }

    $scope.$on('$stateChangeStart', function() {
        listWatch();
    });
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

    $scope.$on('add', () => {
        $scope.appendContext();
    })

}
