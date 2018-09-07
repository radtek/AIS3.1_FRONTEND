TypeBCtrl.$inject = ['$rootScope', '$scope', '$window', 'select', 'auth', 'toastr'];

module.exports = TypeBCtrl;

function TypeBCtrl($rootScope, $scope, $window, select, auth, toastr) {
    var vm = this;
    vm.regOpt = {};
    var regOptId = $rootScope.$stateParams.regOptId;
    $scope.docInfo = auth.loginUser();

    if ($scope.docInfo.beCode !== 'syzxyy' && $scope.docInfo.beCode != 'cshtyy') {
        select.getRegOptInfo(regOptId).then(function (rs){
            vm.regOpt = rs.data.resultRegOpt;
            var url = 'http://197.70.8.8:81/UisReport/list/reportlist.aspx?ConType=1&inhosptId=' + vm.regOpt.hid;
            $window.typeB.location.href = url;
        });
    }

}
