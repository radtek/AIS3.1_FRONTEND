InOperCtrl.$inject = ['$rootScope', '$scope', 'IHttp'];

module.exports = InOperCtrl;

function InOperCtrl($rootScope, $scope, IHttp) {
	IHttp.post('operation/queryOperaPatrolRecordList', { state: '04' }).then(function(rs) {
		if(rs.data.resultCode != 1)
			return;
		$scope.dataList = rs.data.resultList;
	});

	// 刷新
	$scope.refresh = function() {
        $rootScope.$state.go('inOper', null, {
            reload: true
        });
    }

    // 进入手术间
	$scope.to = function(item, url) {
		$rootScope.$state.go(url, {
			regOptId: item.regOptId
		});
	}
}
