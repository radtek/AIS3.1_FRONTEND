DocModalCtrl.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'auth', '$filter'];

module.exports = DocModalCtrl;

function DocModalCtrl($rootScope, $scope, $uibModalInstance, auth, $filter) {
    var regOptId = $scope.row.regOptId,
        menu = auth.userPermission();

    var showPlacentaAgree = $scope.row.sex === '女' ? true : false;
    var showRiskAsseLog = $scope.row.isLocalAnaes == '1' ? false : true;
    sessionStorage.setItem('hasAnaesPacuRec', $scope.row.pacuId === '' ? false : true);
    sessionStorage.setItem('showPlacentaAgree', $scope.row.sex === '男' ? false : true);

    $scope.dataList = $scope.row.documentStateList;

    var crumbs = $rootScope.crumbs[0];

    $scope.ok = function(item) {
        var curItem = $filter('filter')(menu, function(i) {
            return item.name == i.name && i.parentIds.indexOf(crumbs.id) > -1;
        })[0];
        if (curItem) {
            $uibModalInstance.close(curItem);
            $rootScope.$state.go(curItem.url, { regOptId: regOptId, showPlacentaAgree: showPlacentaAgree, showRiskAsseLog: showRiskAsseLog });
        }
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };
}
