editChargeitemDictionary.$inject = ['$scope', 'IHttp', '$uibModalInstance', '$timeout', 'uiGridConstants', '$uibModal'];

module.exports = editChargeitemDictionary;

function editChargeitemDictionary($scope, IHttp, $uibModalInstance, $timeout, uiGridConstants, $uibModal) {
    var promise;
    $scope.params = {
        pageNo: 1,
        pageSize: 15,
        sort: '',
        orderBy: '',
        filters: []
    };
    //user group li
    
}
