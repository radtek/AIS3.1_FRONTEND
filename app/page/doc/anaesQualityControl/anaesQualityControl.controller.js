AnaesQualityControlCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'toastr', '$filter', 'dateFilter', 'auth'];

module.exports = AnaesQualityControlCtrl;

function AnaesQualityControlCtrl($rootScope, $scope, IHttp, toastr, $filter, dateFilter, auth) {
    let vm = this;
    $scope.docInfo = auth.loginUser();
    let beCode = $scope.docInfo.beCode;
    // 麻醉质控文书
    $scope.setting = $rootScope.$state.current.data;
    $scope.$emit('readonly', $scope.setting);
    $scope.saveActive = auth.getDocAuth();
    vm.anaesAllergicList = [{codeName: '痉挛'}, {codeName: '水肿'}, {codeName: '明显皮疹'}];
    vm.spinalAnaesComplicationList = [{codeName: '重度头痛'}, {codeName: '麻木'}, {codeName: '异感'}, {codeName: '肌无力'}, {codeName: '瘫痪'}];
    vm.venipuncComplicaList = [{codeName: '气胸'}, {codeName: '血胸'}, {codeName: '局部血肿'}, {codeName: '导管或导丝异常'}];
    function initData() {
        IHttp.post("document/selectAnaesQualityControlByRegOptId", { regOptId: $rootScope.$stateParams.regOptId }).then(function(result) {
            if (result.data.resultCode !== '1')
                return;
            vm.regOptItem = result.data.regOptItem;
            vm.anaesQualityControl = result.data.anaesQualityControl;
            if (vm.anaesQualityControl.complicationTime)
                vm.anaesQualityControl.complicationTime = dateFilter(new Date(vm.anaesQualityControl.complicationTime), 'yyyy-MM-dd HH:mm');
            if (vm.anaesQualityControl.deathTime)
                vm.anaesQualityControl.deathTime = dateFilter(new Date(vm.anaesQualityControl.deathTime), 'yyyy-MM-dd HH:mm');
            if (vm.anaesQualityControl.scaTime)
                vm.anaesQualityControl.scaTime = dateFilter(new Date(vm.anaesQualityControl.scaTime), 'yyyy-MM-dd HH:mm');
            if (vm.anaesQualityControl.allergicTime)
                vm.anaesQualityControl.allergicTime = dateFilter(new Date(vm.anaesQualityControl.allergicTime), 'yyyy-MM-dd HH:mm');
            if (vm.anaesQualityControl.venipuncComplicaTime)
                vm.anaesQualityControl.venipuncComplicaTime = dateFilter(new Date(vm.anaesQualityControl.venipuncComplicaTime), 'yyyy-MM-dd HH:mm');
        });
    }
    initData();

    $scope.$on('save', () => {
        let anaesQualityControl = angular.copy(vm.anaesQualityControl);
        if (anaesQualityControl.complicationTime)
            anaesQualityControl.complicationTime = new Date($filter('date')(new Date(anaesQualityControl.complicationTime), 'yyyy-MM-dd HH:mm')).getTime();
        if (anaesQualityControl.deathTime)
            anaesQualityControl.deathTime = new Date($filter('date')(new Date(anaesQualityControl.deathTime), 'yyyy-MM-dd HH:mm')).getTime();
        if (anaesQualityControl.scaTime)
            anaesQualityControl.scaTime = new Date($filter('date')(new Date(anaesQualityControl.scaTime), 'yyyy-MM-dd HH:mm')).getTime();
        if (anaesQualityControl.allergicTime)
            anaesQualityControl.allergicTime = new Date($filter('date')(new Date(anaesQualityControl.allergicTime), 'yyyy-MM-dd HH:mm')).getTime();
        if (anaesQualityControl.venipuncComplicaTime)
            anaesQualityControl.venipuncComplicaTime = new Date($filter('date')(new Date(anaesQualityControl.venipuncComplicaTime), 'yyyy-MM-dd HH:mm')).getTime();
        IHttp.post("document/updateAnaesQualityControl", anaesQualityControl).then(function(rs) {
            if (rs.data.resultCode === '1') {
                toastr.success(rs.data.resultMessage);
            }
        });
    });
}
