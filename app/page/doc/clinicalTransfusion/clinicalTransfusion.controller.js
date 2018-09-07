clinicalTransfusionCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'auth'];

module.exports = clinicalTransfusionCtrl;

function clinicalTransfusionCtrl($rootScope, $scope, IHttp, auth) {
	var vm = this,
        timer_rt,
        regOptId = $rootScope.$stateParams.regOptId;
	$scope.docInfo = auth.loginUser();
	$scope.docUrl = auth.loginUser().titlePath;

	$scope.$on('print', () => {
		$scope.$emit('doc-print');
	});
	
	//基本信息
	IHttp.post('document/searchAccedeByRegOptId', { 'regOptId': regOptId }).then(function(res) {
	    $scope.regOptItem = res.data.regOptItem;
	});
}
