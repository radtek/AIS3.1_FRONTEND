TranCardLogCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'auth', 'toastr'];

module.exports = TranCardLogCtrl;

function TranCardLogCtrl($rootScope, $scope, IHttp, auth, toastr) {
    var vm = this;
    var regOptId = $rootScope.$stateParams.regOptId;

    $scope.docInfo = auth.loginUser();

    IHttp.post('document/searchSafeCheckByRegOptId', { regOptId: regOptId }).then(function(rs) {
        if (rs.data.resultCode != 1)
            return;
        vm.regOpt = rs.data.safeCheckFormBean;
    });

    $scope.$on('print', function() {
        $scope.$emit('doc-print');
    });
}
