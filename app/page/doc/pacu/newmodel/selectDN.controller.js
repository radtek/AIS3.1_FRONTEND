selectDN.$inject = ['$scope', 'IHttp', '$uibModalInstance', 'select', 'items'];

module.exports = selectDN;

function selectDN($scope, IHttp, $uibModalInstance, select, items) {
    var self = this;

    select.getOperators().then(function(result) {
        if(result.length <= 0)
            return
        $scope.operatDocOption = result;
    });
    select.getAnaesthetists().then(function(result) {
        $scope.anesDocOption = result.data.userItem;
    });
    select.getNurses().then(function(result) {
        $scope.nurseOption = result.data.userItem;
    });

    $scope.$watch('anesDocList', function(list, old) {
        if (list === old || self.callback) { 
            self.callback = false;
            return;
        }
        save(list, old, 'A', '03', 'anesDocList');
    }, true);

    $scope.$watch('operatDocList', function(list, old) {
        if (list === old || self.callback) { 
            self.callback = false;
            return;
        }
        save(list, old, 'O', '07', 'operatDocList');
    }, true);

    $scope.$watch('nurseList', function(list, old) {
        if (list === old || self.callback) { 
            self.callback = false;
            return;
        }
        save(list, old, 'N', '05', 'nurseList');
    }, true);

    $scope.$watch('instruNurseList', function(list, old) {
        if (list === old || self.callback) { 
            self.callback = false;
            return;
        }
        save(list, old, 'N', '04', 'instruNurseList');
    }, true);

    function save(list, old, role, operatorType, name) {
        var param = [];
        if (list.length > 0) {
            list.forEach(function(item) {
                param.push({ docId: items.docId, role: role, name: item.name, operatorType: operatorType, userLoginName: item.id || item.userName || item.operatorId });
            });
        } else {
            param = { docId: items.docId, role: role, name: '', operatorType: operatorType, userLoginName: '' };
        }
        IHttp.post('operation/saveParticipant', param, '操作失败').then(function(rs) {
            if (rs.data.resultCode !== '1') {
                $scope[name] = old;
                self.callback = true;
            }
        });
    }

    $scope.cancel = function() {
        $uibModalInstance.close({
            anesDocList: $scope.anesDocList,
            operatDocList: $scope.operatDocList,
            nurseList: $scope.nurseList,
            instruNurseList: $scope.instruNurseList
        });
    }

}
