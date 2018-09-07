AddInstrsuitCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'toastr', '$uibModalInstance'];

module.exports = AddInstrsuitCtrl;

function AddInstrsuitCtrl($rootScope, $scope, IHttp, toastr, $uibModalInstance) {
    vm = this;
    vm.title="设置必填项";
    vm.content = '请设置必填项：';

    vm.close = function() {
        $uibModalInstance.close('cancel');
    }

    vm.save = function() {
    	IHttp.post('basedata/updateRequiredItem',$scope.requiredItemList)
		.then((rs) => {
			if (rs.status === 200 && rs.data.resultCode === '1') {
				$uibModalInstance.close('success');
			} else {
				$uibModalInstance.dismiss('faild');
			}
		},(err) => {
			$uibModalInstance.dismiss(err);
		})
    }

}
