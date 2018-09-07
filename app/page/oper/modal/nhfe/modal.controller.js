ModalCtrl.$inject = ['$rootScope', '$scope', 'toastr', '$uibModalInstance', 'IHttp'];

module.exports = ModalCtrl;

function ModalCtrl($rootScope, $scope, toastr, $uibModalInstance, IHttp) {

    $scope.ok = function() {
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
        var url = 'operation/cancelRegOpt';
        var params = {regOptId: $scope.regOptId, reasons: str};
        if ($scope.tit == '激活') {
            url = 'operation/activeRegOpt';
            params.resonse = $scope.resonse;
        }
        IHttp.post(url, params).then(function(rs) {
            if (rs.data.resultCode != 1)
                return;
            $uibModalInstance.close(rs);
        });
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };
}
