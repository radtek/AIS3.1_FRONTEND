PreVisitLogCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$timeout', '$state', 'toastr', 'confirm', 'auth', 'select'];

module.exports = PreVisitLogCtrl;

function PreVisitLogCtrl($rootScope, $scope, IHttp, $timeout, $state, toastr, confirm, auth, select) {
    let vm = this;
    $scope.docInfo = auth.loginUser();

    $scope.setting = $rootScope.$state.current.data;
    $scope.$emit('readonly', $scope.setting);
    $scope.saveActive = auth.getDocAuth();

    var regOptId = $rootScope.$stateParams.regOptId;

    vm.transPumpTypes = [
        { codeValue: 1, codeName: 'Ⅰ' },
        { codeValue: 2, codeName: 'Ⅱ' },
        { codeValue: 3, codeName: 'Ⅲ' },
        { codeValue: 4, codeName: 'Ⅳ' }
    ];
    vm.boolTypes = [
        { codeValue: 1, codeName: 'A' },
        { codeValue: 2, codeName: 'B' },
        { codeValue: 3, codeName: 'AB' },
        { codeValue: 4, codeName: 'O' }
    ]

    function initData() {
        IHttp.post('document/searchPreVisitByRegOptId', { 'regOptId': regOptId }).then(function(rs) {
            if (rs.data.resultCode != 1)
                return;
            //初始化时发送文书状态
            $rootScope.btnActive = true;
            $scope.processState = rs.data.preVisitItem.processState;
            $scope.$emit('processState', $scope.processState);

            vm.regOptItem = rs.data.regOptItem;
            vm.preVisit = rs.data.preVisitItem;
            if(vm.preVisit.bonesPitch)
                vm.preVisit.bonesPitch -= 0;
            vm.previsitPhyexam = rs.data.previsitPhyexam;
            vm.accessexam = rs.data.accessexam;
        });
    }

    initData();

    function submit(processState, state) {
        $rootScope.btnActive = false;
        let params = {
            preVisit: vm.preVisit,
            previsitPhyexam: vm.previsitPhyexam,
            previsitAccessexam: vm.accessexam
        };
        params.preVisit.designedAnaesList = [];
        params.preVisit.anaesMethodList = [];
        params.preVisit.processState = processState;
        IHttp.post('document/savePreVisitByDocId', params).then((rs) => {
            $rootScope.btnActive = true;
            if (rs.data.resultCode != 1) return;
            toastr.success(rs.data.resultMessage);
            vm.preVisit.processState = processState;
            $scope.processState = processState;
            if (state == 'print')
                $scope.$emit('end-print');
            else
                $scope.$emit('processState', processState);
        });
    }

    //通用必填项验证方法，请先到系统管理的文书设置里填写验证必填项的值。
    function docRequired(){
        var result=true;
        console.log($rootScope.currentRequired);
        if(!!$rootScope.currentRequired){
            var requiredArray = $rootScope.currentRequired.split(',');            
            for (var i = 0; i < requiredArray.length; i++) {
                var requiredValue = eval(requiredArray[i]);
                if(requiredValue===undefined || requiredValue==='' || requiredValue===null){
                   var req = jQuery("[ng-model='"+requiredArray[i]+"']:first");
                   var reqPrev = req.prev(":not(em)");
                   req.parent().addClass("md-red");
                   if(!!reqPrev.text()){
                     toastr.warning(reqPrev.text()+'不能为空！');
                   }else{
                     toastr.warning('请输入标有红*的必填项信息！');
                   } 
                   result=false;                  
                }else{
                   jQuery("[ng-model='"+requiredArray[i]+"']:first").parent().removeClass("md-red");
                }                
            }
        } 
        return result;
    }

    //保存 提交文书
    function save(type, state) {
        $scope.verify = type == 'END';
        if (type == 'END') {
            //必填项通用方法调用
            if(!docRequired()){
               return; 
            }
            // if (!vm.preVisit.anaestheitistId || (!vm.preVisit.asa && !vm.preVisit.asaE) || !vm.preVisit.leaveTo) {
            //     toastr.warning('请输入必填项信息');
            //     return;
            // }
            if (state == 'print') {
                if (vm.preVisit.processState == 'END')
                    $scope.$emit('doc-print');
                else
                    confirm.show('打印的文书将归档，且不可编辑。是否继续打印？').then(function(data) { submit(type, state); });
            } else {
                if (vm.preVisit.processState == 'END')
                    submit(type);
                else
                    confirm.show('提交的文书将归档，并且不可编辑。是否继续提交？').then(function(data) { submit(type); });
            }
        } else
            submit(type);
    }

    select.getAnaesthetists().then((rs) => {
        $scope.anesthetistList = rs.data.userItem;
    });

    $timeout(function() {
        $scope.$watch('vm.preVisit.anaestheitistId', function(n, o) {
            $scope.eSignatureAnaestheitist = [];
            angular.forEach($scope.anesthetistList, function(item) {
                if (item.userName == n) {
                    $scope.eSignatureAnaestheitist.push(item.picPath + '?t=' + new Date().getTime());
                }
            })
        }, true)
    }, 1000);

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
    });
}