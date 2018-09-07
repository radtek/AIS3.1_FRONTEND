userDefinedDoc.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModalInstance', '$timeout', '$uibModal'];

module.exports = userDefinedDoc;

function userDefinedDoc($rootScope, $scope, IHttp,$uibModalInstance, $timeout, $uibModal) {

	if($rootScope.$stateParams.docThemeId)
		$scope.docThemeId= $rootScope.$stateParams.docThemeId;

	if (!!$scope.item){
		$scope.doc = angular.copy($scope.item);    
		$scope.docThemeId = $scope.doc.docThemeId;
	}
	sessionStorage.setItem('docThemeId',$scope.docThemeId);

	$scope.cancel = function() {
		$uibModalInstance.close();
       //$uibModalInstance.dismiss();
    };

		   
	
}