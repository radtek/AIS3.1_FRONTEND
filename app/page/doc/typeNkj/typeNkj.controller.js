TypeNkjCtrl.$inject = ['$rootScope', '$scope', '$window', 'select', 'auth'];

module.exports = TypeNkjCtrl;

function TypeNkjCtrl($rootScope, $scope, $window, select, auth) {
    var vm = this;
    vm.regOpt = {};
    var regOptId = $rootScope.$stateParams.regOptId;
    $scope.docInfo = auth.loginUser();

    select.getRegOptInfo(regOptId).then(function (rs){
        vm.regOpt = rs.data.resultRegOpt;
        var url = 'http://197.70.8.8:81/UisReport/list/reportlist.aspx?ConType=3&inhosptId=' + vm.regOpt.hid;
        $window.typeNkj.location.href = url;
    });

}
