CancelOperCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModalInstance'];

module.exports = CancelOperCtrl;

function CancelOperCtrl($rootScope, $scope, IHttp, $uibModalInstance) {
    vm = this;
    vm.title="取消手术原因";
    vm.content = '请输入取消手术原因';

    vm.close = function() {
        $uibModalInstance.close('cancel');
    }

    vm.save = function() {
        var resonse = $scope.resonse,
            str = '';
        for(o in $scope.opt) {
            if($scope.opt[o])
                str += $scope.opt[o] + '、';
        }
        if(resonse)
            str += resonse;
        else
            str = str.substring(0, str.length - 1);
        
    	IHttp.post('operation/cancelRegOpt',{
    		regOptId: $scope.data.items.regOptId,
    		reasons: str
    	}).then((rs) => {
            if(rs.data.resultCode != 1)
                return;
            $uibModalInstance.close('success');
		})
    }
}
