ModalInstanceCtrl.$inject = ['$uibModalInstance', '$scope', 'IHttp', 'toastr', '$filter'];

module.exports = ModalInstanceCtrl;

function ModalInstanceCtrl($uibModalInstance, $scope, IHttp, toastr, $filter) {

    var opt = $scope.item.opt;
    var param = { "pageNo": 0, "pageSize": 0, "sort": "", "orderBy": "", "filters": [{ "field": "", "value": "" }], "beid": "" };

    $scope.obj = {
        "id": opt ? opt.id : '',
        "startTime": opt ? opt.startTime : '',
        "endTime": opt ? opt.endTime : '',
        "type": opt ? (opt.type + '') : '',
        "content": opt ? opt.content : '',
        "beid": opt ? opt.beid : '',
        "beName": opt ? opt.beName : ''
    }

    IHttp.post('sys/selectBusForDropDown', {}).then(function(rs) {
        if (rs.data.resultCode != 1) return;
        $scope.hospital = rs.data.sysBusDropDown;
    });


    $scope.ok = function() {
        var url = ''
        if($scope.item.tabIndex == 0)
            url = 'bas/saveBasDoctorShiftInfo';
        else if($scope.item.tabIndex == 1)
            url = 'bas/saveBasShiftInfo';
        else if($scope.item.tabIndex == 2)
            url = 'bas/saveBasNursplanTime';

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

    $scope.$watch('obj.type', function(n) {
        if (!n)
            return;
        var item = $filter('filter')($scope.subType, function(v) {
            return v.codeValue == n;
        });
        if(item)
            $scope.obj.content = item[0].codeName;
    });

    function querySubType(n) {
        param.beid = n;
        param.filters[0].field = 'groupId';
        param.filters[0].value = 'shift';
        IHttp.post('sys/getDictItemsByGroupId', param).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            $scope.subType = rs.data.resultList;
        });
    }
}
