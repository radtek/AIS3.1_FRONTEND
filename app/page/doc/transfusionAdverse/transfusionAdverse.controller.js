transfusionAdverseCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'auth'];

module.exports = transfusionAdverseCtrl;

function transfusionAdverseCtrl($rootScope, $scope, IHttp, auth) {
    $scope.docInfo = auth.loginUser();
    $scope.docUrl = auth.loginUser().titlePath;
    $scope.setting = $rootScope.$state.current.data;

    var vm = this,
        timer_rt,
        regOptId = $rootScope.$stateParams.regOptId;

    $scope.$on('print', () => {
        $scope.$emit('doc-print');
    });

    //基本信息
    IHttp.post('document/searchAccedeByRegOptId', { 'regOptId': regOptId }).then(function(res) {
        vm.regOptItem = res.data.regOptItem;
    });
}
