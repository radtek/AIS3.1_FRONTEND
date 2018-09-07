editInstrumentDictionary.$inject = ['$rootScope', '$scope', 'IHttp', 'auth', '$uibModalInstance', 'confirm', 'toastr', '$timeout'];

module.exports = editInstrumentDictionary;

function editInstrumentDictionary($rootScope, $scope, IHttp, auth, $uibModalInstance, confirm, toastr, $timeout) {
    var promise;
    let beCode = auth.loginUser().beCode;
    $scope.nhfe = beCode === 'nhfe';
    if ($scope.instrumentId === 0) {
        $scope.lable = '新增器械';
    } else {
        $scope.lable = '编辑器械';
        IHttp.post("basedata/queryInstrumentById", { 'instrumentId': $scope.instrumentId }).then(function(data) {
            $scope.Instrument = data.data.instrument;
            $scope.Instrument.enable = $scope.Instrument.enable + '';
        });
    }

    //点击科室的保存按钮
    $scope.saveInstrument = function() {
        $scope.verify = verify();
        if (!$scope.verify) {
            return;
        }
        $rootScope.btnActive = false;
        promise = $timeout(function() {
            IHttp.post("basedata/updateInstrument", $scope.Instrument).then(function(rs) {
                if (rs.data.resultCode === '1') {
                    $uibModalInstance.close();
                    toastr.success(rs.data.resultMessage);
                }
                $rootScope.btnActive = true;
            });
        }, 500);
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };

    // 验证
    function verify() {
        return $scope.instrument.$valid && !!($scope.Instrument.name || $scope.Instrument.code || $scope.Instrument.enable)
    }
}
