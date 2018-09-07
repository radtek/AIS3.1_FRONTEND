ApplyBloodCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$q', 'toastr', 'auth', '$uibModalInstance', 'dateFilter', '$filter'];

module.exports = ApplyBloodCtrl;

function ApplyBloodCtrl($rootScope, $scope, IHttp, $q, toastr, auth, $uibModalInstance, dateFilter, $filter) {
    vm = this;
    let parent = $scope.$parent;
    let regOptId = $rootScope.$stateParams.regOptId;
    vm.title = parent.entity ? "修改输血" : "编辑输血";
    $scope.docInfo = auth.loginUser();

    if (parent.entity) {
        $scope.entity = parent.entity;
        $scope.entity.blood = $filter('filter')(parent.list, function(item) {
            return $scope.entity.bloodId == item.bloodId
        })[0];
        $scope.entity.date = dateFilter(new Date(parent.entity.date), 'yyyy-MM-dd HH:mm');
    }

    vm.save = function() {
        $scope.verify = verify();
        let applyBlood = angular.copy($scope.entity);
        if (!applyBlood || !verify())
            return;
        applyBlood.bloodTransId = parent.id;
        applyBlood.bloodId = $scope.entity.blood.bloodId;
        applyBlood.bloodUnit = $scope.entity.blood.dosageUnit;
        applyBlood.bloodName = $scope.entity.blood.name;
        applyBlood.date = new Date($filter('date')(new Date($scope.entity.date), 'yyyy-MM-dd HH:mm')).getTime();
        IHttp.post('document/saveBloodTransItem', applyBlood).then(function(rs) {
            if (rs.data.resultCode === '1') {
                toastr.success(rs.data.resultMessage);
                vm.close();
            }
        });
    }

    // 验证
    function verify() {
        return $scope.applyBloodForm.$valid;
    }

    vm.close = function() {
        $uibModalInstance.close();
    }

}
