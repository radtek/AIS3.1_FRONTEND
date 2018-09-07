InfoConsCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'toastr', 'auth', 'baseConfig', '$timeout', 'select', '$window', 'confirm'];

module.exports = InfoConsCtrl;

function InfoConsCtrl($rootScope, $scope, IHttp, toastr, auth, baseConfig, $timeout, select, $window, confirm) {
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
    
    $timeout(function (){
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
        IHttp.post('document/searchAccedeByRegOptId', { 'regOptId': regOptId }).then(function(rs) {
            if (rs.data.resultCode != 1)
                return;
            vm.regOptItem = rs.data.regOptItem;
            $scope.accedeItem = rs.data.accedeItem;
            $scope.processState = $scope.accedeItem.processState;
            $scope.$emit('processState', $scope.processState);
            var selectedCode = $scope.accedeItem.selected.split(",");
            for (var i=0; i<selectedCode.length; i++) {
                $scope.selectedList_[i] = selectedCode[i];
            }
        });
    }

    init();

    $scope.save = function(type, state) {       
        $scope.verify = type == 'END';
        if (type == 'END') {
            $scope.showBorder = true;
            if (!$scope.accedeItem.anaestheitistId && !$scope.accedeItem.anaestheitistSignTime) {
                toastr.warning('请输入必填项信息');
                return;
            }
            if (state == 'print') {
                if ($scope.accedeItem.processState == 'END')
                    $scope.$emit('doc-print');
                else
                    confirm.show('打印的文书将归档，且不可编辑，是否继续打印？').then(function(data) { fn_save(type, state); });
            } else {
                if ($scope.accedeItem.processState == 'END')
                    fn_save(type);
                else
                    confirm.show('提交的文书将归档，且不可编辑，是否继续提交？').then(function(data) { fn_save(type); });
            }
        } else {
            $scope.showBorder = false;
            fn_save(type);
        }
    }

    function fn_save(processState, state) {
        var params = {
            accedeInformedList: [],
            accede: angular.copy($scope.accedeItem)
        };
        params.accede.processState = processState;
        if(params.accede.anaesMethodList.length == 0)
            params.accede.anaesMethodList = [];
        if(params.accede.anaesAssistMeasureList.length == 0)
            params.accede.anaesAssistMeasureList = [];
        IHttp.post('document/updateAccede', params).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            toastr.success(rs.data.resultMessage);
            $scope.accedeItem.processState = processState;
            $scope.processState = processState;
            if (state == 'print') {
                $scope.$emit('end-print');
            } else {
                $scope.$emit('processState', processState);
            }
        });
    }

    $scope.selectedList_ = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var listWatch = $scope.$watch('selectedList_', function(n, o) {
        if (n == o || o == undefined) return;
        var selectedList = [];
        for (var item in $scope.selectedList_) {
            selectedList.push($scope.selectedList_[item] + '');
        }
        $scope.accedeItem.selectedList = selectedList;
    }, true);

    $scope.$on('$stateChangeStart', function() {
        listWatch();
    });

    $scope.$on('save', () => {
        if ($scope.saveActive && $scope.processState == 'END')
            $scope.save('END');
        else
            $scope.save('NO_END');
    });

    $scope.$on('print', () => {
        $scope.save('END', 'print');
    });

    $scope.$on('submit', () => {        
        $scope.save('END');
    });
}
