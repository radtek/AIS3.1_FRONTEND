ModalInstanceCtrl.$inject = ['$uibModalInstance', '$scope', 'IHttp', 'toastr', 'auth'];

module.exports = ModalInstanceCtrl;

function ModalInstanceCtrl($uibModalInstance, $scope, IHttp, toastr, auth) {
    var loginInfo = auth.loginUser();
    $scope.obj = $scope.item.entity;
    init();

    function init() {
        IHttp.post('basedata/queryBusEntityListByDeviceIdAndEventId', $scope.obj.entity).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            $scope.resultList = rs.data.resultList;

        })
    }
    $scope.params = {};
    $scope.params.deviceId = $scope.obj.entity.deviceId;
    $scope.params.eventId = $scope.obj.entity.eventId;
    $scope.params.optional = $scope.obj.entity.optional;
    $scope.params.paraId = $scope.obj.entity.paraId;
    $scope.params.paraName = $scope.obj.entity.paraName;
    $scope.params.beidLs = "";
    $scope.changeChecked = function(item) {
        if (item.flag) {
            if ($scope.params.beidLs.indexOf(item.beid) == -1) {
                if ($scope.params.beidLs == '') {
                    $scope.params.beidLs = item.beid;
                } else {
                    $scope.params.beidLs = $scope.params.beidLs + "," + item.beid;
                }
            }
        } else {
            $scope.params.beidLs = $scope.params.beidLs.replace(item.beid + ',', '');
        }
    }
    $scope.allChecked = function(resultList,all) {
        if (all) {
            for (var i = 0; i < resultList.length; i++) {
                resultList[i].flag = true;
                $scope.changeChecked(resultList[i]);
            }
        } else {
            for (var i = 0; i < resultList.length; i++) {
                resultList[i].flag = false;
            }
        }

    }
    $scope.reverseChecked = function(resultList) {
        for (var i = 0; i < resultList.length; i++) {
            resultList[i].flag = !resultList[i].flag;
            $scope.changeChecked(resultList[i]);
        }
    }
    $scope.ok = function() {
        IHttp.post('basedata/applyMonitorByBeid', $scope.params).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            $uibModalInstance.close();
        })
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
}
