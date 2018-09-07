easePainAgreeCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$timeout', '$state', '$q', 'toastr', 'confirm', 'auth', '$filter', 'select'];

module.exports = easePainAgreeCtrl;

function easePainAgreeCtrl($rootScope, $scope, IHttp, $timeout, $state, $q, toastr, confirm, auth, $filter, select) {
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
    $scope.processState ="NO_END";

    IHttp.post('document/searchAnalgesicInformedConsent', { 'regOptId': regOptId }).then(function(rs) {
        if (rs.data.resultCode != 1)
            return;
        vm.regOptItem = rs.data.basRegOpt;
        if(rs.data.analgesicInformedConsent){
            $scope.docAnalgesicInformedConsent = rs.data.analgesicInformedConsent;
            $scope.processState = $scope.docAnalgesicInformedConsent.processState;
            if ($scope.docAnalgesicInformedConsent.signTime)
            $scope.docAnalgesicInformedConsent.signTimestr = $filter('date')(new Date($scope.docAnalgesicInformedConsent.signTime), 'yyyy-MM-dd')
          
        }       
        
        $scope.$emit('processState', $scope.processState);
    });   

    //保存 提交文书
    function save(type, state) {
        $scope.verify = type == 'END';
        let content = '';
        if ($scope.processState === undefined) {
            toastr.error('操作失败，无效的数据！');
            return;
        }
        if (type === 'END') {
            if (!vm.preVisit.organNormal || !vm.preVisit.leaveTo || !vm.preVisit.preAnesEvaLevel || !vm.preVisit.situationLevel || !vm.preVisit.anaestheitistName || !vm.preVisit.signDate) {
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
        
        $scope.docAnalgesicInformedConsent.processState = processState;

        if($scope.docAnalgesicInformedConsent.signTimestr){
            $scope.docAnalgesicInformedConsent.signTime = new Date($scope.docAnalgesicInformedConsent.signTimestr);          
        }
        $scope.docAnalgesicInformedConsent.regOptId=regOptId;
        $scope.docAnalgesicInformedConsent.beid=$scope.docInfo.beid;
       
		
        

        IHttp.post('document/saveAnalgesicInformedConsent',$scope.docAnalgesicInformedConsent).then(function(rs) {
            if (rs.data.resultCode === "1") {
                toastr.success(rs.data.resultMessage);
                $scope.processState = $scope.docAnalgesicInformedConsent.processState;
                if ($scope.docAnalgesicInformedConsent.signTime)
                $scope.docAnalgesicInformedConsent.signTime = $filter('date')(new Date($scope.docAnalgesicInformedConsent.signTime), 'yyyy-MM-dd')
          
                if (type === 'print') {
                    $scope.$emit('end-print');
                } else {
                    $scope.$emit('processState',$scope.processState );
                }
            }
        });
    }

    function save(processState, type) {
        $scope.verify = processState == 'END';
        let content = '';
        if (processState === 'END') {            
            if (type === 'print') {
                if ($scope.docAnalgesicInformedConsent.processState === 'END') {
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
