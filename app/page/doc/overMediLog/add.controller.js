AddOverMedicareCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$timeout', 'dateFilter', 'auth', '$q', '$uibModal', '$uibModalInstance', 'toastr', 'select'];

module.exports = AddOverMedicareCtrl;

function AddOverMedicareCtrl($rootScope, $scope, IHttp, $timeout, dateFilter, auth, $q, $uibModal, $uibModalInstance, toastr, select) {

    var vm = this,
        promises,
        loginInfo = auth.loginUser();
    var parent = $scope.$parent;
    vm.title = '添加';
    console.log(parent);
    if (parent.data.operType == "edit") {
        vm.title = '修改';
        vm.overMedicare = {
            id: parent.data.id,
            regOptId: parent.data.regOptId,
            patOutRangeId: parent.data.patOutRangeId,
            prePostId: parent.data.patOutRangeId,
            type: parent.data.type + "",
            time: dateFilter(new Date(parent.data.time), 'yyyy-MM-dd HH:mm'),
            itemCode: null,
            itemName: { name: parent.data.itemName },
            reason: parent.data.reason,
            doctorId: null,
            doctorName: { name: parent.data.doctorName },
            nurseName: loginInfo.name,
        };
    } else if (parent.data.operType == "add") {
        vm.overMedicare = {
            id: null,
            regOptId: parent.data.regOptId,
            patOutRangeId: parent.data.patOutRangeId,
            prePostId: parent.data.patOutRangeId,
            type: '1',
            time: null,
            itemCode: null,
            itemName: null,
            reason: null,
            doctorId: null,
            doctorName: { userName: parent.data.doctorName },
            nurseName: loginInfo.name,
        };
    }

    $scope.chargeItems = [];
    $scope.getChargeItem = function(value) {
        var deferred = $q.defer();
        if (value == "") return;
        $IHttp.post('basedata/searchChargeItem', {
            pinyin: ""
        }).then(function(rs) {
            $scope.chargeItems = rs.data;
            return deferred.resolve($scope.chargeItems);
        });
        return deferred.promise;
    }

    //洗手护士
    $scope.getUser = function(searchText, userType) {
        if ($scope.data.from == 'beforeAfter') {
            userType = 'NURSE';
        }
        var deferred = $q.defer();
        if (searchText !== "") {
            IHttp.post('sys/getAllUser', {
                filters: [{
                    field: "userType",
                    value: userType
                }]
            }).then(function(rs) {
                return deferred.resolve(rs.data.userItem);
            });
            return deferred.promise;
        } else if ($scope.data.operType == "edit") {
            return [{ name: $scope.data.doctorName }];
        }
    }

    $scope.getItems = function(query) {
        var deferred = $q.defer();
        if (query !== '') {
            $scope.item = getChargeItem(query, function(optionList) {
                $timeout(function() {
                    deferred.resolve(optionList);
                }, 100);
            });
            return deferred.promise;
        } else if ($scope.data.operType == "edit") {
            return [{ name: $scope.data.itemName }];
        }
    };

    function getChargeItem(value, callback) {
        var url = 'basedata/getMedicineList';
        switch (vm.overMedicare.type) {
            case '1':
                break;
            case '2':
                url = 'basedata/searchInstrument';
                break;
            case '3':
                url = 'basedata/queryChargeItem';
                break;
        }

        var param = {};
        if (vm.overMedicare.type == '1') {
            param = {
                pinyin: value,
                beid: loginInfo.beid,
                pageNo: 1,
                pageSize: 200
            };
        }else if (vm.overMedicare.type == '3') {
            param = {
                filters: [{
                    field: "pinYin",
                    value: value
                }],
                beid: loginInfo.beid
            };
        } else {
            param = {
                pinYin: value,
                beid: loginInfo.beid,
                pageNo: 1,
                pageSize: 200
            };
        }

        IHttp.post(url, param).then(function(rs) {
            callback(rs.data.resultList);
        });
    }

    $scope.save = function(type) {
        var url = '';
        if ($scope.data.from == 'overMedicare') {
            url = 'document/updatePatOutRangeItem';
        } else if ($scope.data.from == 'beforeAfter') {
            url = 'document/updatePrePostVisitItem';
        }
        var doctorName = vm.overMedicare.doctorName;
        var param = {
            id: vm.overMedicare.id,
            doctorId: doctorName ? vm.overMedicare.doctorName.userName : undefined,
            doctorName: doctorName ? vm.overMedicare.doctorName.name : undefined,
            itemCode: vm.overMedicare.itemName.code,
            itemName: vm.overMedicare.itemName.name,
            nurseName: loginInfo.name,
            patOutRangeId: $scope.data.patOutRangeId,
            prePostId: $scope.data.patOutRangeId,
            reason: vm.overMedicare.reason,
            regOptId: $scope.data.regOptId,
            time: new Date(vm.overMedicare.time),
            type: vm.overMedicare.type
        };
        
        IHttp.post(url, param).then(function(rs) {
            if(rs.data.resultCode != 1)
                return;
            $uibModalInstance.close();
        });
    }

    $scope.clearItemName = function() {
        vm.overMedicare.itemName = '';
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    }
}
