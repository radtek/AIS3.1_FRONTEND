TypePatlyCtrl.$inject = ['$rootScope', '$scope', '$window', 'IHttp', 'select', 'auth', 'toastr'];

module.exports = TypePatlyCtrl;

function TypePatlyCtrl($rootScope, $scope, $window, IHttp, select, auth, toastr) {
    var vm = this;
    vm.regOpt = {};
    var regOptId = $rootScope.$stateParams.regOptId;
    $scope.docInfo = auth.loginUser();

    select.getRegOptInfo(regOptId).then(function (rs){
        vm.regOpt = rs.data.resultRegOpt;
        var url = 'http://197.70.8.16:81/pathwebrpt/index_z.asp?zyh=' + vm.regOpt.hid;
        $window.typePatly.location.href = url;
    });

}
