ShutTranLogCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$window', '$q', '$timeout', '$filter', 'toastr', 'select', 'confirm', 'dateFilter', 'auth'];

module.exports = ShutTranLogCtrl;

function ShutTranLogCtrl($rootScope, $scope, IHttp, $window, $q, $timeout, $filter, toastr, select, confirm, dateFilter, auth) {
    $scope.setting = $rootScope.$state.current.data;

    var promise;
    var vm = this;
    $scope.docInfo = auth.loginUser();
    $scope.docUrl = auth.loginUser().titlePath;
    $scope.saveActive = auth.getDocAuth();

    select.getAnaesMethodList().then((rs) => {
        vm.anaesMethodList = rs.data.resultList;
    })

    IHttp.post('document/searchDocAnaesPreDiscussRecord', { 'regOptId': $rootScope.$stateParams.regOptId }).then(function(res) {
        vm.regOptItem = res.data.searchRegOptByIdFormBean;
        vm.discussRecord = res.data.preDiscussRecord;

        //初始化时发送文书状态
        $scope.processState = vm.discussRecord.processState;
        $scope.$emit('processState', vm.discussRecord.processState);
        if (vm.discussRecord.discussTime) {
            vm.discussRecord.discussTime = dateFilter(new Date(vm.discussRecord.discussTime), 'yyyy-MM-dd');
        }
        if (vm.discussRecord.designedTime) {
            vm.discussRecord.designedTime = dateFilter(new Date(vm.discussRecord.designedTime), 'yyyy-MM-dd');
        }
        if (vm.discussRecord.recordTime) {
            vm.discussRecord.recordTime = dateFilter(new Date(vm.discussRecord.recordTime), 'yyyy-MM-dd');
        }
    });

    function save(processState, state) {
        var discussRecord = angular.copy(vm.discussRecord),
            designedAnaesMethodCode = '',
            designedAnaesMethodCodeArr = vm.discussRecord.designedAnaesMethodCodes;
        for(var i=0; i<designedAnaesMethodCodeArr.length; i++) {
            if (designedAnaesMethodCode === '')
                designedAnaesMethodCode = designedAnaesMethodCodeArr[i];
            else
                designedAnaesMethodCode += ',' + designedAnaesMethodCodeArr[i];
        }
        discussRecord.designedAnaesMethodCode = designedAnaesMethodCode;
        IHttp.post('document/savePreDiscussRecord', discussRecord).then(function(rs) {
            if (rs.data.resultCode === '1' && state !== 'print')
                toastr.success(rs.data.resultMessage);
            if (state == 'print')
                $scope.$emit('end-print');
        });
    }

    $scope.$on('save', () => {
        save('END');
    });

    $scope.$on('print', () => {
        save('END', 'print');
    });
}