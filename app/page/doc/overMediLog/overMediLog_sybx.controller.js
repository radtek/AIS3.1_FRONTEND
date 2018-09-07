OverMediLogCtrl.$inject = ['$rootScope', '$scope', 'IHttp','$timeout', '$uibModal', 'toastr', 'confirm', 'dateFilter', 'auth', 'select', '$filter'];

module.exports = OverMediLogCtrl;

function OverMediLogCtrl($rootScope, $scope, IHttp,$timeout, $uibModal, toastr, confirm, dateFilter, auth, select, $filter) {
    var regOptId = $rootScope.$stateParams.regOptId,
        insuredArray = [
            { type: 1, tit: '自费用药', len: 10 },
            { type: 2, tit: '限字号用药', len: 10 },
            { type: 3, tit: '诊疗项目、体内置放材料', len: 10 },
            { type: 4, tit: '贵重药品、卫材', len: 10 }
        ];

    $scope.setting = $rootScope.$state.current.data;
    $scope.docInfo = auth.loginUser();

    function setList(list) {
        $scope.insuredItems = [];
        //如果没有值，则构建空表
        if (list.length == 0) {
            for (var i = 0; i < insuredArray.length; i++) {
                for (var j = 0; j < insuredArray[i].len; j++) {
                    $scope.insuredItems.push({
                        type: insuredArray[i].type,
                        len: insuredArray[i].len,
                        tit: insuredArray[i].tit,
                        num: j
                    });
                }
            }
        } else {
            //如果有值           
            for (var i = 0; i < insuredArray.length; i++) {
                var index = 0;
                for (var k = 0; k < list.length; k++) {
                    if (list[k].type == insuredArray[i].type) {
                        $scope.insuredItems.push({
                            type: insuredArray[i].type,
                            len: insuredArray[i].len,
                            tit: insuredArray[i].tit,
                            num: index,
                            time: $filter('date')(new Date(list[k].time), 'yyyy-MM-dd HH:mm'),
                            name: list[k].name,
                            code: list[k].code,
                            kind: list[k].kind,
                            spec: list[k].spec,
                            price: list[k].price,
                            reason: list[k].reason,
                            id: list[k].id,
                            insuredId: list[k].insuredId
                        });
                        index++;
                    }
                }
                for (var j = index; j < insuredArray[i].len; j++) {
                    //补充空的数据
                    $scope.insuredItems.push({
                        type: insuredArray[i].type,
                        len: insuredArray[i].len,
                        tit: insuredArray[i].tit,
                        num: j,
                        regOptId: regOptId,
                        insuredId: $scope.insuredPatAgree.id
                    });
                }
            }
        }
    }
    $timeout(function() {
        $scope.$watch('insuredPatAgree.docSign', function(n, o) {
            $scope.hasSig = false;
            $scope.eSignatureAnesthetist = [];
            angular.forEach($scope.anesthetistList, function(item) {
                if (item.userName == n) {
                    $scope.hasSig = item.picPath ? true : false;
                    $scope.eSignatureAnesthetist.push({ hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime() });
                }
            })
        }, true)
    }, 1000);

    function initPage() {
        IHttp.post("document/searchInsuredPatAgreeByRegOptId", { regOptId: regOptId }).then(function(rr) {
            var rs = rr.data;
            if (rs.resultCode != 1)
                return;

            $scope.processState = rs.insuredPatAgree.processState;
            $scope.$emit('processState', $scope.processState);

            $scope.regOpt = rs.searchRegOptByIdFormBean;
            $scope.insuredPatAgree = rs.insuredPatAgree;
            $scope.insuredPatAgree.signTime = rs.insuredPatAgree.signTime ? dateFilter(new Date(rs.insuredPatAgree.signTime), 'yyyy-MM-dd') : '';
            $scope.insuredItemList = rs.insuredItemList;
            //把数据构建成要的格式
            setList($scope.insuredItemList);
        });
    }

    initPage();

    $scope.add = function(row) {
        var scope = $rootScope.$new();
        if (row) {
            scope.data = row;
        } else {
            scope.data = {
                type: 0,
                len: 10,
                tit: '',
                reason: '患者需要',
                regOptId: regOptId,
                wid: 0,
                insuredId: $scope.insuredPatAgree.id
            };
        }
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            template: require('./add_sybx.html'),
            controller: require('./add_sybx.controller'),
            controllerAs: 'vm',
            scope: scope
        }).result.then(function() {}, function() {
            initPage();
        });
    };

    $scope.del = function(row) {
        IHttp.post('document/deleteInsuredItem', { id: row.id }).then(function(res) {
            if (res.data.resultCode != 1)
                return;
            initPage();
        });
    }

    function save(type, state) {
        $scope.verify = type == 'END';
        if (type == 'END') {
            if (state == 'PRINT') {
                if ($scope.insuredPatAgree.processState == 'END')
                    $scope.$emit('doc-print');
                else
                    confirm.show('打印的文书将归档，且不可编辑，是否继续打印？').then(function(data) { fn_save(type, state) });
            } else
                confirm.show("提交的文书将归档，并且不可编辑。是否继续提交？").then(function(data) { fn_save(type, state) });
        } else
            fn_save(type, state);
    }

    function fn_save(type, state) {
        var param = angular.copy($scope.insuredPatAgree);
        param.processState = type;
        IHttp.post("document/updateInsuredPatAgree", param).then((res) => {
            if (res.data.resultCode != 1)
                return;
            toastr.success(res.data.resultMessage);
            $scope.insuredPatAgree.processState = type;
            $scope.processState = type;
            if (state == 'PRINT')
                $scope.$emit('end-print');
            else
                $scope.$emit('processState', $scope.processState);
        });
    }

    select.getAnaesthetists().then((rs) => {
        $scope.anesthetistList = rs.data.userItem;
    });

    $scope.$on('save', () => {
        save($scope.insuredPatAgree.processState);
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