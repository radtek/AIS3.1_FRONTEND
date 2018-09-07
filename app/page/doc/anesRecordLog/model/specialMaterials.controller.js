specialMaterials.$inject = ['$scope', 'IHttp', '$uibModalInstance', 'items','select', '$filter', '$timeout', '$q', 'auth', 'toastr'];

module.exports = specialMaterials;

function specialMaterials($scope, IHttp, $uibModalInstance, items,select, $filter, $timeout, $q, auth, toastr) {
    
    var promise,
        user = auth.loginUser(),
        params = {
            sort: '',
            orderBy: '',
            filters: [],
            state: '',
            createUser: ''
        }

    initData();

    function initData() {        
        initParam();
        IHttp.post("operation/selectSpecialMaterialEvent", { docId: items.docId }).then(function(result) {
            $scope.list = result.data.resultList;
        });
    }

    select.sysCodeBy('specialMaterials').then((rs) => {
        $scope.specuaNateList = rs.data.resultList;        
    })
   
    $scope.save = function() {
        if (!$scope.evItem.codeName) {
            toastr.warning("请输入事件名称");
            return;
        }
        $scope.param.startTime = new Date($scope.param.startTime_);
        if (promise) {
            $timeout.cancel(promise);
        }
        promise = $timeout(function() {
            $scope.param.specialItemName = $scope.evItem.codeName;
            $scope.param.specialItemId = $scope.evItem.codeValue;
            IHttp.post("operation/saveSpecialMaterialEvent", $scope.param).then(function(result) {
                if (result.data.resultCode !== '1') return;
                initData();
                $scope.cancel = function() {
                    $uibModalInstance.close();
                };
            });
        }, 500);
    }

    $scope.edit = function(row) {
        row.startTime_ = $filter('date')(row.startTime, 'yyyy-MM-dd HH:mm');
        $scope.evItem = { codeValue: row.specialMaterialEventId, codeName: row.specialItemName };
        $scope.param = angular.copy(row);
    }

    $scope.add = initParam;

    $scope.delete = function(id) {
        IHttp.post("operation/deleteSpecialMaterialEvent", { specialMaterialEventId: id }).then(function(result) {
            if (result.data.resultCode !== '1') return;
            initData();
            $scope.cancel = function() {
                $uibModalInstance.close();
            };
        });
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };

    

    

    function initParam() {
        $scope.evItem = { codeValue: '', codeName: '' };
        $scope.param = {
            startTime_: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm'),
            startTime: new Date(),
            docId: items.docId,
            specialMaterialEventId: '',
            docType: 1,
            isTpl: 0
        };
    }
}