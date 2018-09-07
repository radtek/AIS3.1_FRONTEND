ConsumptiveCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModal'];

module.exports = ConsumptiveCtrl;

function ConsumptiveCtrl($rootScope, $scope, IHttp, $uibModal) {
	// $scope.addMaterialInput = function() {
	//     var scope = $rootScope.$new();
	//     scope.data = {
	//         tag: '0'
	//     };

	//     $uibModal.open({
	//         animation: true,
	//         size: 'lg',
	//         template: require('./modal/materialInput/materialInput.html'),
	//         controller: require('./modal/materialInput/materialInput.controller'),
	//         controllerAs: 'vm',
	//            backdrop:'static',
	//         scope: scope
	//     })
	//     .result
	//     .then(() => {
	//     	console.log('add');
	//     	$scope.$broadcast('refresh');
	//     })
	// };

	$scope.addInput = function() {
		$scope.$broadcast('addInput');
	}

	// $scope.materialOutput = function() {
	//     var scope = $rootScope.$new();
	//     scope.data = {
	//         tag: '0'
	//     };

	//     $uibModal.open({
	//         animation: true,
	//         template: require('./modal/materialOutput/materialOutput.html'),
	//         controller: require('./modal/materialOutput/materialOutput.controller'),
	//         controllerAs: 'vm',
	//            backdrop:'static',
	//         scope: scope
	//     })
	//     .result
	//     .then(() => {

	//     })
	// };

	$scope.materialDetail = function() {
	    var scope = $rootScope.$new();
	    scope.data = {
	        tag: '0'
	    };

	    $uibModal.open({
	        animation: true,
	        size: 'lg',
	        template: require('./modal/materialDetail/materialDetail.html'),
	        controller: require('./modal/materialDetail/materialDetail.controller'),
	        controllerAs: 'vm',
	           backdrop:'static',
	        scope: scope
	    })
	    .result
	    .then(() => {

	    })
	    .then(() => {

	    })
	};
}