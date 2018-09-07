AnaesMethodChangeCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'toastr', 'auth', '$timeout', 'select', '$window', 'confirm'];

module.exports = AnaesMethodChangeCtrl;

function AnaesMethodChangeCtrl($rootScope, $scope, IHttp, toastr, auth, $timeout, select, $window, confirm) {
    var vm = this,
        promise;
    var regOptId = $rootScope.$state.params.regOptId;
    $scope.accede = {};
    $scope.setting = $rootScope.$state.current.data;
    $scope.$emit('readonly', $scope.setting);
    $scope.docInfo = auth.loginUser();
    $scope.saveActive = auth.getDocAuth();

    select.getAnaesthetists().then(function(rs) {
        if (rs.data.resultCode != 1)
            return;
        $scope.anesthetistList = rs.data.userItem;
    });
    
    select.getAnaesMethodList().then((rs) => {
        vm.anaesMethodList = rs.data.resultList;
    })
    $timeout(function (){
        $scope.$watch('vm.methodChangeRecord.anesthetistId', function(n, o) {
            $scope.hasSig1 = false;
            $scope.eSignatureAnaestheitist1 = [];
            angular.forEach($scope.anesthetistList, function(item) {
                if (item.userName == n) {
                    $scope.hasSig1 = item.picPath ? true : false;
                    $scope.eSignatureAnaestheitist1.push({hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime()});
                }
            })
        }, true)
        $scope.$watch('vm.methodChangeRecord.superiorPhysician', function(n, o) {
            $scope.hasSig2 = false;
            $scope.eSignatureAnaestheitist2 = [];
            angular.forEach($scope.anesthetistList, function(item) {
                if (item.userName == n) {
                    $scope.hasSig2 = item.picPath ? true : false;
                    $scope.eSignatureAnaestheitist2.push({hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime()});
                }
            })
        }, true)
    }, 1000);

    function initData() {
        IHttp.post('document/searchAnaesMethodChangeRecord', { 'regOptId': regOptId }).then(function(rs) {
            if (rs.data.resultCode != 1)
                return;
            vm.regOptItem = rs.data.searchRegOptByIdFormBean;
            vm.methodChangeRecord = rs.data.methodChangeRecord;
            vm.methodChangeRecord.regOptId = vm.regOptItem.regOptId;
            if (!vm.methodChangeRecord.id)
                vm.methodChangeRecord.anaesMethodCodes = [];
            $scope.processState = vm.methodChangeRecord.processState;
            $scope.$emit('processState', $scope.processState);
        });
    }

    initData();

    $scope.save = function(type, state) {       
        $scope.verify = state == 'print';
        if (type == 'END') {
            if (!vm.methodChangeRecord.anesthetistId && state == 'print') {
                toastr.warning('请输入必填项信息');
                return;
            }
            if (state == 'print') {
                fn_save(type, state);
            } else {
                fn_save(type);
            }
        }
    }

    function fn_save(processState, state) {
        vm.methodChangeRecord.processState = processState;
        IHttp.post('document/saveAnaesMethodChange', vm.methodChangeRecord).then(function(rs) {
            if (rs.data.resultCode === '1' && state !== 'print')
                toastr.success(rs.data.resultMessage);
            initData();
            $scope.processState = processState;
            if (state == 'print') {
                $scope.$emit('end-print');
            } else {
                $scope.$emit('processState', processState);
            }
        });
    }

    $scope.$on('save', () => {
        $scope.save('END');
    });

    $scope.$on('print', () => {
        $scope.save('END', 'print');
    });
}
