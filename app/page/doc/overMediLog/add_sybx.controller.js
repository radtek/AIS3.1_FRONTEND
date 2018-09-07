AddOverMedicareCtrl.$inject = ['$scope', 'IHttp', '$timeout', '$filter', 'auth', '$q', '$uibModal', '$uibModalInstance', 'toastr', 'select'];

module.exports = AddOverMedicareCtrl;

function AddOverMedicareCtrl($scope, IHttp, $timeout, $filter, auth, $q, $uibModal, $uibModalInstance, toastr, select) {
    var vm = this,
        promises,
        type,
        loginInfo = auth.loginUser(),
        id = $scope.data.id || $scope.data.wid;

    if (id == 0)
        $scope.tit = '新增特殊用药知情单数据';
    else
        $scope.tit = '编辑特殊用药知情单数据';

    $scope.data.type += '';

    $scope.clearItemName = function() {
        if (!$scope.data.time)
            $scope.data.time = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm');
        $scope.data.name = '';
        type = $scope.data.type;
        $scope.item = [];
        // queryList($scope.data.type);
    }

    var itemWatch = $scope.$watch('item', function(n) {
        if (n == undefined)
            return;
        var type = $scope.data.type;
        $scope.data.name = n.name;
        $scope.data.spec = n.spec;
        if(type == "1" || type == "2") {
            $scope.data.price = n.packageDosageAmount;
            $scope.data.code = n.medicineId;
            $scope.data.kind = '1';
        } else if (type == '3') {
            $scope.data.price = n.price;
            $scope.data.code = n.chargeItemId;
            $scope.data.kind = '2';
        } else {
            $scope.data.price = n.price;
            $scope.data.code = n.id;
        }
    })

    function queryList(type) {
        var url = "",
            param = {pageNo: 1, pageSize: 200};
        if (type == "1" || type == "2")
            url = 'basedata/getMedicineList';
        else if (type == "3")
            url = 'basedata/queryChargeItem';
        else
            url = 'document/searchMedAndInstru';
        IHttp.post(url, param).then(function(rs) {
            $scope.list = rs.data.resultList;
            if (rs.data.resultCode != 1)
                $scope.list = [];
        });
    }

    $scope.getDataList = function(query) {
        return getDataList_(query);
    }

    function getDataList_(query) {
        var deferred = $q.defer(),
            url = '',
            param = { pinyin: query, pageNo: 1, pageSize: 200 };
        if (type == "1" || type == "2")
            url = 'basedata/getMedicineList';
        else if (type == "3")
            url = 'basedata/queryChargeItem';
        else
            url = 'document/searchMedAndInstru';
        IHttp.post(url, param).then((rs) => {
            if (rs.data.resultList.length > 0)
                deferred.resolve(rs.data.resultList);
            else
                deferred.resolve(param);
        })
        return deferred.promise;
    }

    $scope.save = function(type) {
        var param = angular.copy($scope.data);
        if (!!param.listLen) {
            var lens = param.listLen.split(',');
            if (lens[parseInt(param.type)] == "10") {
                toastr.waring('此类型数据已经满了！');
                return false;
            }
            param.listLen = undefined;
        }
        param.time = new Date(param.time).getTime();
        param.wid = undefined;

        IHttp.post("document/updateInsuredItem", param).then(function(rs) {
            if (rs.data.resultCode != 1)
                return;
            toastr.info(rs.data.resultMessage);
            if(id > 0)
                $scope.cancel();
        });
    }

    $scope.cancel = function() {
        itemWatch();
        $uibModalInstance.dismiss();
    }
}
