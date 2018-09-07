OverMediLogCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModal', 'toastr', 'confirm', 'auth'];

module.exports = OverMediLogCtrl;

function OverMediLogCtrl($rootScope, $scope, IHttp, $uibModal, toastr, confirm, auth) {
    var vm = this,
        promise,
        regOptId = $rootScope.$state.params.regOptId;
    $scope.pageSize = 22;
    $scope.setting = $rootScope.$state.current.data;
    $scope.docInfo = auth.loginUser();
    $scope.docUrl = auth.loginUser().titlePath;
    $scope.saveActive = auth.getDocAuth();

    function initPage() {
        IHttp.post("document/searchPatOutRangeAgree", { regOptId: $rootScope.$stateParams.regOptId }).then(function(rr) {
            var rs = rr.data;
            if (rs.resultCode != 1)
                return;
            $scope.regOpt = rs.searchRegOptByIdFormBean;
            var str = $scope.regOpt.diagnosisName;
            var num = ((str.length / 14) + 1 + '').split('.')[0];
            $scope.pat = rs.patOutRangeAgree;
            $scope.list = rs.patOutRangeItemList;
            $scope.processState = $scope.pat.processState;
            $scope.$emit('processState', $scope.pat.processState);
            var emptyLength = $scope.pageSize - num + 1 - $scope.list.length;
            if (emptyLength >= 0)
                $scope.list = $scope.list.concat(new Array(emptyLength));
        });
    }

    initPage();

    $scope.add = function(row) {
        var scope = $rootScope.$new();
        if (row) {
            scope.data = {
                patOutRangeId: $scope.pat.id,
                regOptId: $rootScope.$stateParams.regOptId,
                id: row.id,
                doctorName: row.doctorName,
                type: row.type,
                time: row.time,
                reason: row.reason,
                itemName: row.itemName,
                operType: 'edit',
                from: 'overMedicare',
                tag: 1
            };
        } else {
            scope.data = {
                regOptId: $rootScope.$stateParams.regOptId,
                patOutRangeId: $scope.pat.id,
                doctorName: $scope.regOpt.anesthetistName,
                operType: 'add',
                from: 'overMedicare',
                tag: 0
            };
        }

        var transferrModal = $uibModal.open({
            animation: true,
            backdrop: 'static',
            template: require('./add.html'),
            controller: require('./add.controller'),
            controllerAs: 'vm',
            scope: scope
        });
        transferrModal.result.then(function(data) {
            initPage();
        });
    };

    $scope.delete = function(id) {
        IHttp.post('document/delPatOutRangeItem', { id: id }).then(function(res) {
            if (res.data.resultCode != 1)
                return;
            initPage();
        });
    }

    function save(type, state) {
        $scope.verify = type == 'END';
        if (type == 'END') {
            if (state == 'PRINT') {
                if ($scope.pat.processState == 'END')
                    $scope.$emit('doc-print');
                else {
                    confirm.show('打印的文书将归档，且不可编辑，是否继续打印？').then(function(data) {
                        fn_save(type, state);
                    });
                }
            } else {
                confirm.show("提交的文书将归档，并且不可编辑。是否继续提交？").then(function(data) {
                    fn_save(type);
                });
            }
        } else
            fn_save(type);
    }

    function fn_save(type, state) {
        var pat = angular.copy($scope.pat);
        pat.processState = type;
        IHttp.post("document/updatePatOutRangeAgree", pat).then((res) => {
            if (res.data.resultCode != 1)
                return;
            toastr.success(res.data.resultMessage);
            $scope.pat.processState = type;
            $scope.processState = type;
            if (state == 'PRINT')
                $scope.$emit('end-print');
            else
                $scope.$emit('processState', $scope.pat.processState);
        });
    }

    $scope.$on('save', () => {
        if ($scope.saveActive && $scope.processState == 'END')
            fn_save('END');
        else
            save('NO_END');
    });

    $scope.$on('print', () => {
        save('END', 'PRINT');
    });

    $scope.$on('submit', () => {
        save('END');
    })

    $scope.$on('add', () => {
        $scope.add();
    })
}
