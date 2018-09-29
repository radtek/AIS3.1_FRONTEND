ScheduleCtrl.$inject = ['$rootScope', '$scope', '$filter', 'auth', 'uiGridServe'];

module.exports = ScheduleCtrl;

function ScheduleCtrl($rootScope, $scope, $filter, auth, uiGridServe) {
	$scope.queryObj = uiGridServe.params({
		name:'',
		operDate: $filter('date')(new Date(), 'yyyy-MM-dd'),
		startTime: '',
		endTime: '',
		hid:'',
		searchType: 1,
        filters: [],
        state: '01,02,08'
	})
	$scope.beCode = auth.loginUser().beCode;
    $scope.$on('setSearchType', function(obj, searchType) {
	    $scope.searchType = searchType;
	});
	$scope.query = function(param) {
		let params = angular.copy($scope.queryObj);
		if (param === 'today') {
			params.operDate = $filter('date')(new Date(), 'yyyy-MM-dd');
			params.name = '';
			params.hid = '';
		}
		if (params.searchType && params.searchType == 1) {
			params.filters = [];
		}else if (params.searchType && params.searchType == 2) {
			params.operDate = '';
			params.filters = [
				{field: 'startTime', value: params.startTime},
				{field: 'endTime', value: params.endTime}
			]
		}
		$scope.$broadcast('query', params);
	}

	let tomorrow = new Date($filter('date')(new Date(), 'yyyy-MM-dd')).getTime() + 86400000;
	$scope.queryObj.operDate = $filter('date')(tomorrow, 'yyyy-MM-dd');
    $scope.query();

    $scope.updateDay = function(code) {
        var curDate = $scope.queryObj.operDate;
        var operDate = '';
        if (curDate) {
        	if (code === 'add')
        		operDate = new Date($filter('date')(new Date(curDate), 'yyyy-MM-dd')).getTime() + 86400000;
            else
            	operDate = new Date($filter('date')(new Date(curDate), 'yyyy-MM-dd')).getTime() - 86400000;
            $scope.queryObj.operDate = $filter('date')(operDate, 'yyyy-MM-dd');
            $scope.queryObj.searchType = 1;
        	$scope.query();
        }
    }

    $scope.pushInfo = function() {
        $scope.$broadcast('pushInfo');
    }

	$scope.save = function() {
		$scope.$broadcast('save');
	}

	$scope.print = function() {
		$scope.$broadcast('print');
	}

    $scope.export = function() {
        $scope.$broadcast('export');
    }

	$scope.$on('childInited',() => {
		$scope.query();
	})

	$scope.$on('childRefresh',() => {
		$scope.query();
	})

	$scope.$on('doc-print', () => {
		window.open($rootScope.$state.href('print'));
	})
}
