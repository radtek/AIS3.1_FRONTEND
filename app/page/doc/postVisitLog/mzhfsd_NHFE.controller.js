mzhfsd_NHFE.$inject = ['$rootScope', '$scope', 'IHttp',  '$q', '$timeout','auth','select'];

module.exports = mzhfsd_NHFE;

function mzhfsd_NHFE($rootScope, $scope,IHttp, $q, $timeout,auth,select) {
    var promise,
        regOptId = $rootScope.$stateParams.regOptId,
        rows = 3, rows1 = 3;
    $scope.docInfo = auth.loginUser();
    $scope.docUrl = auth.loginUser().titlePath;
    $scope.setting = $rootScope.$state.current.data;
    $scope.$emit('readonly', $scope.setting);
    var vm = this;
    var originProcessState;
    IHttp.post('operation/searchApplication', { regOptId: regOptId }).then(function(rs) {
         vm.regbase=rs.data.resultRegOpt;
    });
    select.getAnaesthetists().then((rs) => {
        $scope.anesthetistList = rs.data.userItem;
    });
    function init() {
        IHttp.post('document/searchAnaesPostopByRegOptId', { 'regOptId': regOptId }).then(function(res) {
            if (res.data.result == 'true') {
                vm.anaesPotTop = res.data.anaesPostopItem;
                vm.searchRegOptByIdFormBean = res.data.searchRegOptByIdFormBean;
                originProcessState = vm.anaesPotTop.processState;
                 $scope.$emit('processState', vm.anaesPotTop.processState);
                if ($rootScope.isLeader) {
                    vm.anaesPotTop.processState = 'NO_END';
                }
                vm.anaesPotTop=angular.merge({},vm.anaesPotTop,vm.searchRegOptByIdFormBean)
            }
        });
    }
    $timeout(function() {
        $scope.$watch('vm.anaesPotTop.anesthetistId', function(n, o) {
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
    init();
     function save(type, isPrint) {
        $scope.verify = type == 'END';
        if (type == 'END') {
            if (isPrint && vm.anaesPotTop.processState == 'END')
                $scope.$emit('doc-print');
            else if (isPrint)
                confirm.show('打印的文书将归档，且不可编辑。是否继续打印？').then(function(data) { submit(type); });
            else
                confirm.show('提交的文书将归档，并且不可编辑。是否继续提交？').then(function(data) { submit(type); });
        } else
            submit(type, isPrint)
    }
    function submit(processState) {
        var def = $q.defer();
        var postData = angular.copy(vm.anaesPotTop);
        if (processState !== 'NO_END') {
            postData.processState = 'END';
        } else {
            postData.processState = originProcessState;
        }

        IHttp.post('/document/updateAnaesPostop', postData).then(function(res) {
            if (res.data.resultCode === '1') {
                if (processState !== 'NO_END') {
                    if (!$rootScope.isLeader) {
                        vm.anaesPotTop.processState = 'END';
                    } else {
                        originProcessState = 'END';
                    }
                }
                if (processState !== 'NO_END') {
                }
                init();
            }
            def.resolve(res);
        });

        return def.promise;
    }
    $scope.$on('save', () => {
        if ($scope.saveActive && $scope.processState == 'END')
            submit('END');
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