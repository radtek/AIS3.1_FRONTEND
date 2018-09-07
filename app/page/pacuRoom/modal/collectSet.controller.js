ManListCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'toastr', '$uibModalInstance', 'auth', '$filter'];

module.exports = ManListCtrl;

function ManListCtrl($rootScope, $scope, IHttp, toastr, $uibModalInstance, auth, $filter) {
    var isEdit = false;

    init();

    $scope.edit = function(row) {
        isEdit = true;
        $scope.param = angular.copy(row);
        $scope.param.bedEventConfigList.forEach((item) => {
            item.checked = item.optDisplay == 'M' || item.optDisplay == 'O';
        })
    }

    $scope.replay = function() {
        isEdit = false;
        if ($scope.param) {
            $scope.param.bedEventConfigList = [];
            $scope.param.deviceId = '';
            $scope.param.interfaceName = '';
            $scope.param.enable = '';
        }
    }

    $scope.close = function() {
        $uibModalInstance.close();
    }

    $scope.delete = function(row) {
        IHttp.post('document/deletePacuDeviceConfig', { deviceId: row.deviceId, bedId: row.bedId }).then((rs) => {
            if (rs.data.resultCode != 1)
                return;
            $scope.devList.forEach((item) => {
                if (item.deviceType == row.deviceType) {
                    item.disabled = false;
                }
            });
            $scope.list = rs.data.resultList;
            $scope.replay();
        });
    }
    
    $scope.save = function() {
        var devList = [],
            optDisplay;
        $scope.param.bedEventConfigList.forEach((item) => {
            if (isEdit) {
                if (item.checked) {
                    if(item.optDisplay != 'M')
                        optDisplay = 'O';
                    else
                        optDisplay = item.optDisplay;
                }
                else
                    optDisplay = '';
            } else
                optDisplay = item.mustShow == 1 ? 'M' : (item.checked ? 'O' : '');

            devList.push({
                deviceId: $scope.param.deviceId,
                eventId: item.eventId,
                bedId: $scope.opt.bedId,
                optDisplay: optDisplay,
                optCollect: isEdit ? item.optCollect : (item.mustCollect ? item.mustCollect : '')
            })
        });
        IHttp.post('document/savePacuDeviceConfig', {
            pacuDeviceConfig: { deviceId: $scope.param.deviceId, enable: $scope.param.enable, bedId: $scope.opt.bedId, roomId: $scope.opt.roomId },
            bedEventConfigList: devList
        }).then((rs) => {
            if (rs.data.resultCode != 1)
                return;
            $scope.devList.forEach((item) => {
                if (item.deviceType == $scope.param.deviceType)
                    item.disabled = true;
            });

            $scope.list = rs.data.resultList;
            $scope.replay();
        });
    }

    $scope.changeDev = function(id) {
        IHttp.post('document/getPacuMonitorConfigCheck', { deviceId: id }).then((rs) => {
            if (rs.data.resultCode != 1)
                return;
            isEdit = false;
            $scope.param.bedEventConfigList = rs.data.resultList;
            $scope.param.enable = 1;
            if (rs.data.resultList && rs.data.resultList.length > 0)
                $scope.param.deviceType = rs.data.resultList[0].deviceType;
            $scope.param.bedEventConfigList.forEach((item) => {
                item.checked = !!item.mustShow
            })
        });
    }

    function init() {
        IHttp.post('document/getPacuDeviceConfigList', { bedId: $scope.opt.bedId }).then((rs) => {
            if (rs.data.resultCode != 1)
                return;
            $scope.list = rs.data.resultList;

            IHttp.post('document/getPacuDeviceByType', {}).then((rs) => {
                if (rs.data.resultCode != 1)
                    return;
                $scope.devList = rs.data.resultList;
                $scope.list.forEach(function(item) {
                    for (var i = 0; i < $scope.devList.length; i++) {
                        if (item.deviceType == $scope.devList[i].deviceType) {
                            $scope.devList[i].disabled = true;
                        }
                    }
                });
            });
        });
    }
}
