DocModalCtrl.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'IHttp'];

module.exports = DocModalCtrl;

function DocModalCtrl($rootScope, $scope, $uibModalInstance, IHttp) {
	var intl
    init();

    $scope.keepOn = function() {
    	if ($scope.times == 30)
    		init();
    }

    $scope.ok = function() {
    	clearInterval(intl);
        $uibModalInstance.close();
    };

    $scope.cancel = function() {
    	clearInterval(intl);
        $uibModalInstance.dismiss();
    };
    
    function init() {
        $scope.isFinish = false;
        $scope.times = 0;
        intl = setInterval(function() {
            IHttp.post('operCtl/getDeviceStatus', {}).then(function(result) {
                if (result.data.resultCode != 1 || result.data.devices.length <= 0) {
                    clearInterval(intl);
                    return;
                }
                $scope.times += 1;
                result.data.devices.forEach(function(item) {
                    if (item.status == 1) {
                        item.statusName = '【成功】';
                        clearInterval(intl);
                    } else if (item.status == 0) {
                        if ($scope.times % 3 == 1)
                            item.statusName = '检查中 .';
                        else if ($scope.times % 3 == 2)
                            item.statusName = '检查中 . .';
                        else if ($scope.times % 3 == 0)
                            item.statusName = '检查中 . . .';
                        if ($scope.times >= 30) {
                            item.statusName = '【失败：设备检查超时】';
                            $scope.isFinish = true;
                            clearInterval(intl);
                        }
                    } else if (item.status == -1) {
                        if ($scope.times % 3 == 1)
                            item.statusName = '检查中 .';
                        else if ($scope.times % 3 == 2)
                            item.statusName = '检查中 . .';
                        else if ($scope.times % 3 == 0)
                            item.statusName = '检查中 . . .';
                        if ($scope.times >= 30) {
                            item.statusName = '【失败：设备连接失败】';
                            $scope.isFinish = true;
                            clearInterval(intl);
                        }
                    }
                });
                $scope.devList = result.data.devices;
            });
        }, 1000);
    }
}
