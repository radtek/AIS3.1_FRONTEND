AddInstrsuitCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$q', 'toastr', '$uibModalInstance'];

module.exports = AddInstrsuitCtrl;

function AddInstrsuitCtrl($rootScope, $scope, IHttp, $q, toastr, $uibModalInstance) {
    vm = this;
    vm.title="添加器械";
    vm.content = '搜索你需要的手术器械再点击添加放入手术清点记录单';
    $scope.saved = true;
    $scope.btnActive = false;
    let url = 'basedata/searchInstrument';
    if ($scope.type === 'instruments') {
    	vm.title = '添加器械包';
    	vm.content = '搜索你需要的手术器械包再点击添加放入手术清点记录单';
    	url = 'basedata/getInstrsuitList';
    }

    $scope.getInstrumentList = function(query) {
        var deferred = $q.defer(),
        param = {pinyin: query, enable: 1, pageNo: 1, pageSize: 500};
        IHttp.post(url, param).then((rs) => {
            if (rs.data.resultList.length > 0)
                deferred.resolve(rs.data.resultList);
            else
                deferred.resolve([{ name: query }]);
        })
        return deferred.promise;
    }

    vm.save = function() {
        var params = {
            regOptId: $rootScope.$stateParams.regOptId,
            optNurseId: $scope.optNurseId,
            instrumentId: vm.selectedItem.instrumentId,
            instrsuitId: vm.selectedItem.instrsuitId
        }
        $scope.saved = false;
        $scope.btnActive = true;
        if (!vm.selectedItem.instrumentId)
            params.instrumentName = vm.selectedItem.name;
    	IHttp.post('document/insertInstrubillItem', params).then((rs) => {
			if (rs.status === 200 && rs.data.resultCode === '1') {
				$uibModalInstance.close('success');
			} else {
                $scope.saved = true;
                $scope.btnActive = false;
				$uibModalInstance.dismiss('faild');
			}
		},(err) => {
			$uibModalInstance.dismiss(err);
            $scope.saved = true;
            $scope.btnActive = false;
		})
    }
    
    vm.close = function() {
        $uibModalInstance.close('cancel');
    }

}
