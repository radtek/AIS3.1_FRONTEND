ModalInstanceCtrl.$inject = ['$uibModalInstance', '$scope', 'IHttp', 'toastr'];

module.exports = ModalInstanceCtrl;

function ModalInstanceCtrl($uibModalInstance, $scope, IHttp, toastr) {
    var row = $scope.item.entity,
        url = '';

    $scope.obj = {
        "id": row == null ? '' : row.id,
        "groupId": row == null ? '' : row.groupId,
        "groupName": row == null ? '' : row.groupName,
        "codeValue": row == null ? '' : row.codeValue,
        "codeName": row == null ? '' : row.codeName,
        "order": row == null ? '' : row.order,
        "enable": row == null ? '' : row.enable,
        "beid": row == null ? '' : row.beid
    }

    IHttp.post('sys/selectBusForDropDown', {}).then(function(rs) {
        if (rs.data.resultCode != 1) return;
        $scope.hospital = rs.data.sysBusDropDown;
    });

    if ($scope.item.type == 'addGroup')
        url = 'sys/addDictItemGroup';
    else if ($scope.item.type == 'editGroup')
        url = 'sys/upDictItemGroup';
    else if ($scope.item.type == 'addItem') {
        url = 'sys/addDictItem';
        delete $scope.obj.id;
        delete $scope.obj.groupName;
        $scope.obj.enable = true;

    } else if ($scope.item.type == 'editItem')
        url = 'sys/upDictItem';

    if ($scope.item.len > 0) {
        var a = 0,
            orderArr = [];
        while (a < $scope.item.len) {
            a += 1;
            orderArr.push(a);
        }
        $scope.orderArr = orderArr;
    }

    $scope.ok = function() {
        IHttp.post(url, $scope.obj).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            $uibModalInstance.close();
        })
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
}
