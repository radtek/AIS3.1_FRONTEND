easePainAgreeCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$timeout', '$state', '$q', 'toastr', 'confirm', 'auth', '$filter', 'dateFilter', 'select'];

module.exports = easePainAgreeCtrl;

function easePainAgreeCtrl($rootScope, $scope, IHttp, $timeout, $state, $q, toastr, confirm, auth, $filter, dateFilter, select) {
    var vm = this,
        promise;
       
    $scope.setting = $rootScope.$state.current.data;
    let regOptId = $rootScope.$state.params.regOptId;
    $scope.docInfo = auth.loginUser();
    $scope.saveActive = auth.getDocAuth();
   
    vm.regOptItem = {};
    $scope.docAnalgesicInformedConsent={};
    select.getAnaesthetists().then((rs) => {
        $scope.anesthetistList = rs.data.userItem;
    });
    $scope.processState = "NO_END";

    // 规定0为出室，1为小时，2为第一天，3为第二天，4为第三天
    vm.postflup = [{ type: 0 }, { type: 1 }, { type: 2 }, { type: 3 }, { type: 4 }];
    vm.recipe = {};
    IHttp.post('document/getAnalgesicRecord', { 'regOptId': regOptId }).then(function(rs) {
        if (rs.data.resultCode != 1)
            return;
        vm.regOptItem = rs.data.regOpt;
        vm.analgesicMed = rs.analgesicMed;
        vm.analgesicMethod = rs.analgesicMethod;
        if (rs.data.analgesicRecord.analgesicRecord.pcaStart && rs.data.analgesicRecord.analgesicRecord.pcaStart != '')
            rs.data.analgesicRecord.analgesicRecord.pcaStart = dateFilter(new Date(rs.data.analgesicRecord.analgesicRecord.pcaStart), 'yyyy-MM-dd HH:mm');
        if (rs.data.analgesicRecord.analgesicRecord.pcaStop && rs.data.analgesicRecord.analgesicRecord.pcaStop != '')
            rs.data.analgesicRecord.analgesicRecord.pcaStop = dateFilter(new Date(rs.data.analgesicRecord.analgesicRecord.pcaStop), 'yyyy-MM-dd HH:mm');
        vm.record = rs.data.analgesicRecord.analgesicRecord;
        if (rs.data.analgesicRecord.analgesicPostFlup.constructor === Array) {
            for (var i = 0; i < vm.postflup.length; i++) {
                rs.data.analgesicRecord.analgesicPostFlup.forEach(function(val) {
                    if (val.type == vm.postflup[i].type) {
                        vm.postflup[i] = val;
                        vm.postflup[i].breath = parseInt(vm.postflup[i].breath);
                        vm.postflup[i].postTime = parseInt(vm.postflup[i].postTime);
                        vm.postflup[i].spo2 = parseInt(vm.postflup[i].spo2);
                        vm.postflup[i].cardiotach = parseInt(vm.postflup[i].cardiotach.toString());
                        vm.postflup[i].sportBlockScore = vm.postflup[i].sportBlockScore.toString();
                        vm.postflup[i].nauseaScore = vm.postflup[i].nauseaScore.toString();
                        vm.postflup[i].vomitScore = vm.postflup[i].vomitScore.toString();
                        vm.postflup[i].emictionRetentionScore = vm.postflup[i].emictionRetentionScore.toString();
                        vm.postflup[i].catheterScore = vm.postflup[i].catheterScore.toString();
                        vm.postflup[i].calmnessScore = vm.postflup[i].calmnessScore.toString();
                        vm.postflup[0].totalSatisf = vm.postflup[0].totalSatisf.toString();
                        vm.postflup[0].analgesicCatheter = vm.postflup[0].analgesicCatheter.toString();
                        return;
                    }
                });
            }
        }
        // 规定药名的拼音首字母为字段名，即vm.recipe对象的一个字段
        if (rs.data.analgesicRecord.analgesicRecipe.constructor === Array) {
            rs.data.analgesicRecord.analgesicRecipe.forEach(function(v) {
                vm.recipe[v.medName] = v.dosage
            });
        }
        
        vm.transPumpTypes = rs.data.transPumpTypes;
        $scope.processState = vm.record.processState;
        $scope.$emit('processState', $scope.processState);
    });   

    var param = {
        analgesicRecord: {},
        analgesicPostFlup: [],
        analgesicRecipe: []
    }
    function submit(processState, type) {
        param.analgesicRecord = angular.copy(vm.record);
        param.analgesicRecord.processState = processState;
        param.analgesicRecord.patId = regOptId;
        param.analgesicRecord.pcaStart = new Date($filter('date')(new Date(param.analgesicRecord.pcaStart), 'yyyy-MM-dd HH:mm')).getTime();
        param.analgesicRecord.pcaStop = new Date($filter('date')(new Date(param.analgesicRecord.pcaStop), 'yyyy-MM-dd HH:mm')).getTime();
        for (var key in vm.recipe) {
            param.analgesicRecipe.push({
                medName: key,
                dosage: vm.recipe[key],
                units: key == 'zrl' ? 'ml' : 'mg'
            });
        }

        param.analgesicPostFlup = vm.postflup;

        IHttp.post("/document/saveAnalgesicRecord", param).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            toastr.success(rs.data.resultMessage);
            vm.record.processState = processState;
            $scope.processState = processState;
            if (type == 'print') {
                $scope.$emit('end-print');
            } else {
                $scope.$emit('processState', processState);
            }
        });
    }

    function save(processState, type) {
        $scope.verify = processState == 'END';
        let content = '';
        if (processState === 'END') {
            if (type === 'print') {
                if (vm.record.processState === 'END') {
                    $scope.$emit('doc-print');
                } else {
                    content = '打印的文书将归档，且不可编辑。是否继续打印？';
                    confirm.show(content).then(function(data) {
                        submit(processState, type);
                    });
                }
            } else {
                content = '提交的文书将归档，并且不可编辑。是否继续提交？';
                if (vm.record.processState === 'END') {
                    submit(processState);
                }else {
                    confirm.show(content).then(function(data) {
                        submit(processState);
                    });
                }
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
