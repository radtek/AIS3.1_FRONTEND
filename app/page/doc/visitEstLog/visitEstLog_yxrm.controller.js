VisitEstLog_yxrmCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$timeout', '$state', '$q', 'toastr', 'confirm', 'auth', '$filter', 'select'];

module.exports = VisitEstLog_yxrmCtrl;

function VisitEstLog_yxrmCtrl($rootScope, $scope, IHttp, $timeout, $state, $q, toastr, confirm, auth, $filter, select) {
    var vm = this,
        promise;
    $scope.setting = $rootScope.$state.current.data;
    let regOptId = $rootScope.$state.params.regOptId;
    $scope.docInfo = auth.loginUser();
    vm.anaesMonitor_ = [0, 0, 0, 0, 0, 0, 0, 0];
    vm.anaesStep_ = [0, 0, 0, 0, 0];
   
    vm.regOptItem = {};
    vm.preVisit={};    
    $scope.saveActive = auth.getDocAuth();

    select.getAnaesthetists().then((rs) => {
        $scope.anesthetistList = rs.data.userItem;
    });

    IHttp.post('document/searchPreVisitByRegOptId', { 'regOptId': regOptId }).then(function(rs) {
        if (rs.data.resultCode != 1)
            return;
        vm.regOptItem = rs.data.regOptItem;
        vm.preVisit = rs.data.preVisitItem;
        changeData(rs.data);
        $scope.processState = vm.preVisit.processState;
        $scope.$emit('processState', vm.preVisit.processState);
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
            if (!vm.preVisit.organNormal || !vm.preVisit.leaveTo || !vm.preVisit.preAnesEvaLevel || !vm.preVisit.asa || !vm.preVisit.anaestheitistName || !vm.preVisit.signDate) {
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

    function changeData(obj) {
        if (obj.preVisitItem && obj.preVisitItem.bloodPre !== "" && obj.preVisitItem.bloodPre.indexOf('-') > 0) {
            obj.preVisitItem._bloodPre = obj.preVisitItem.bloodPre.split('-')[0] - 0;
            obj.preVisitItem.bloodPre_ = obj.preVisitItem.bloodPre.split('-')[1] - 0;
        }
       
       
       
        vm.type = $state.params.type;

        
        if (vm.preVisit.anaesMonitor !== '') {
            vm.anaesMonitor_ = vm.preVisit.anaesMonitor.split(',');
        }
        if (vm.preVisit.anaesStep !== '') {
            vm.anaesStep_ = vm.preVisit.anaesStep.split(',');
        }
        

        vm.organStateChange = organStateChange;
        vm.submit = submit;
        vm.print = print;

        organStateChange(vm.preVisit.organNormal);
    }

     $timeout(function (){
        $scope.$watch('vm.preVisit.anaestheitistName', function(n, o) {
            $scope.hasSig = false;
            $scope.eSignatureAnesthetist = [];
            angular.forEach($scope.anesthetistList, function(item) {
                if (item.userName == vm.regOptItem.anesthetistId) {
                    $scope.hasSig = item.picPath ? true : false;
                    $scope.eSignatureAnesthetist.push({hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime()});
                }
            })
        }, true)
    }, 1000);

    // 器官功能状态切换
    function organStateChange(state) {
        switch (state) {
            case '轻':
                vm.organLight = true;
                vm.organNormal = vm.organMiddle = vm.organWeight = false;
                break;
            case '中':
                vm.organMiddle = true;
                vm.organNormal = vm.organLight = vm.organWeight = false;
                break;
            case '重':
                vm.organWeight = true;
                vm.organNormal = vm.organMiddle = vm.organLight = false;
                break;
            default:
                vm.organNormal = state;
                vm.organLight = vm.organMiddle = vm.organWeight = false;
        }
    }
      

    function submit(processState, type) {
        var def = $q.defer();
        vm.preVisit.processState = processState;
       
        if (vm.preVisit._bloodPre && vm.preVisit.bloodPre_) {
            vm.preVisit.bloodPre = vm.preVisit._bloodPre + '-' + vm.preVisit.bloodPre_;
        }
       
        vm.preVisit.anaesMonitor = vm.anaesMonitor_.join();
        vm.preVisit.anaesStep = vm.anaesStep_.join();  
		
		 var params = {
            preVisit: vm.preVisit
			};
        
        params.preVisit.anaesMethodList = [];
        IHttp.post('document/savePreVisitByDocId',params).then(function(rs) {
            if (rs.data.resultCode === "1") {
                toastr.success(rs.data.resultMessage);
                $scope.processState = vm.preVisit.processState;
                if (type === 'print') {
                    $scope.$emit('end-print');
                } else {
                    $scope.$emit('processState', vm.preVisit.processState);
                }
            }
        });
    }

    function save(processState, type) {
        $scope.verify = processState == 'END';
        let content = '';
        if (processState === 'END') {
            if (!vm.preVisit.organNormal || !vm.preVisit.leaveTo || !vm.preVisit.preAnesEvaLevel || !vm.preVisit.asa  || !vm.preVisit.signDate) {
                toastr.warning('请输入必填项信息');
                return;
            }
            if (type === 'print') {
                if (vm.preVisit.processState === 'END') {
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
