AddInstrsuitCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$q', 'toastr', '$uibModalInstance'];

module.exports = AddInstrsuitCtrl;

function AddInstrsuitCtrl($rootScope, $scope, IHttp, $q, toastr, $uibModalInstance) {
    vm = this;
    vm.title="添加器械";
    vm.content = '搜索你需要的手术器械再点击添加放入手术清点记录单';
    $scope.saved = true;
    $scope.btnActive = false;
    let url = 'basedata/searchInstrument';
    let type = '1';
    if ($scope.type === 'instrumentf') {
    	vm.title = '添加敷料';
        type = '2';
    	// vm.content = '搜索你需要的敷料包再点击添加放入手术清点记录单';
    	// url = 'basedata/getInstrsuitList';
    }else if ($scope.type === 'instrumentopr') {
        type = '3';
        IHttp.post('basedata/getInstrsuitList',{ }).then((rs) => {
            if (rs.status === 200 && rs.data.resultCode === '1') {
                $scope.instrsuitList = rs.data.resultList;
            }
        },(err) => {
            $uibModalInstance.dismiss(err);
        })
    }

    $scope.getInstrumentList = function(query) {
        var deferred = $q.defer(),
        param = {pinyin: query, enable: 1, pageNo: 1, pageSize: 200};
        IHttp.post(url, param).then((rs) => {
            if (rs.data.resultList.length > 0)
                deferred.resolve(rs.data.resultList);
            else
                deferred.resolve([{ name: query }]);
        })
        return deferred.promise;
    }

    vm.save = function() {
        submit(vm.selectedItem.instrumentId, vm.selectedItem.instrsuitId, type);
    }
    
    vm.add = function() {
        // IHttp.post('basedata/queryInstrsuitById',{
        //     instrsuitId: vm.selectedItem.instrsuitId
        // }).then((rs) => {
        //     if (rs.status === 200 && rs.data.resultCode === '1') {
        //         var resultList = rs.data.resultList;
        //         for(var result of resultList) {
        //             submit(result.instrumentId, vm.selectedItem.instrsuitId, result.type);
        //         }
        //         $uibModalInstance.close('success');
        //     } else {
        //         $uibModalInstance.dismiss('faild');
        //     }
        // },(err) => {
        //     $uibModalInstance.dismiss(err);
        // })
        submit(vm.selectedItem.instrumentId, vm.selectedItem.instrsuitId);
    }

    function submit (instrumentId, instrsuitId) {
        var params = {
            regOptId: $rootScope.$stateParams.regOptId,
            optNurseId: $scope.optNurseId,
            instrumentId: instrumentId,
            instrumentName: vm.selectedItem.name ? vm.selectedItem.name : null,
            instrsuitId: instrsuitId,
            type: type
        };
        $scope.saved = false;
        $scope.btnActive = true;
        if (type == '3') {
            params.instrumentId = undefined;
            params.type = undefined;
        }
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
