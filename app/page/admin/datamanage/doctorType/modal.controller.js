ModalInstanceCtrl.$inject = ['$uibModalInstance', '$scope', 'IHttp', 'toastr'];

module.exports = ModalInstanceCtrl;

function ModalInstanceCtrl($uibModalInstance, $scope, IHttp, toastr) {
    var opt = $scope.item.opt;
    var param = { "pageNo": 0, "pageSize": 0, "sort": "", "orderBy": "", "filters": [{ "field": "", "value": "" }], "beid": "" };
    $scope.obj = {
        "id": '',
        "doctorSuberType": 0,
        "hisDoctorType": "",
        "doctorTypeName": "",
        "state": 0,
        "beid": ""
    }

    IHttp.post('sys/selectBusForDropDown', {}).then(function(rs) {
        if (rs.data.resultCode != 1) return;
        $scope.hospital = rs.data.sysBusDropDown;
    });

    if (opt) {
        $scope.obj.id = opt.id;
        $scope.obj.doctorSuberType = opt.doctorSuberType + '';
        $scope.obj.hisDoctorType = opt.hisDoctorType;
        $scope.obj.doctorTypeName = opt.doctorTypeName;
        $scope.obj.state = opt.state;
        $scope.obj.beid = opt.beid;
    } else
        $scope.obj.state = 1;

    $scope.ok = function() {
        var url = 'bas/addDoctorRecordType';
        if ($scope.obj.id)
            url = 'bas/updateDoctorRecordType';
        IHttp.post(url, $scope.obj).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            $uibModalInstance.close();
        });
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };

    $scope.$watch('obj.beid', function(n) {
        if (!n)
            return;
        querySubType(n);
    }, true);

    function querySubType(n) {
        param.beid = n;
        param.filters[0].field = 'groupId';
        param.filters[0].value = 'doctorSuberType';
        IHttp.post('sys/getDictItemsByGroupId', param).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            $scope.subType = rs.data.resultList;
        });
    }
}
