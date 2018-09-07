DocModalCtrl.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'select', 'toastr', 'IHttp', '$filter'];

module.exports = DocModalCtrl;

function DocModalCtrl($rootScope, $scope, $uibModalInstance, select, toastr, IHttp, $filter) {

    select.getDeviceConfigList().then(function(result) {
        if (result.data.resultCode !== '1') return;
        $scope.dcl = result.data.resultList;
        $scope.dcl.forEach(function(item) {
            item.interfaceTypeName = item.interfaceType == 2 ? '串口' : '网口';
            item.enable = item.enable + '';
        });
    });

    $scope.edit = function(row) {
        if (row.enable == 0) row.serialPort = '';
        $scope.row = row;
        if (row.interfaceType != 1) {
            IHttp.post("basedata/getUseSerialPortList").then(function(rs) {
                $scope.row.serialPort = row.serialPort;
                if (row.enable == 1)
                    rs.data.resultList.push(row.serialPort);
                $scope.serialPortList = rs.data.resultList;
            });
        }
        select.getDeviceMonitorConfigList(row.deviceId).then(function(result) {
            $scope.morList = result.data.resultList;
            $scope.morList.forEach(function(item) {
                item.checked = item.optional === 'M' || item.optional === 'O';
            });
        });
    }

    $scope.ok = function() {
        var list = $filter('filter')($scope.morList, function(item) {
            return item.checked
        });
        IHttp.post('operCtl/updDeviceConfig', {
            deviceMonitorConfigList: list,
            deviceConfig: $scope.row
        }).then(function(result) {
            if (result.data.resultCode === '1') {
                // $uibModalInstance.close();
                toastr.info(result.data.resultMessage);
            }
        });
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };
}