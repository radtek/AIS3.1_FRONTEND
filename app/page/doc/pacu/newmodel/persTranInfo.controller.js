persTranInfo.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModalInstance', 'items', '$timeout', 'auth', 'select', 'encrypt'];

module.exports = persTranInfo;

function persTranInfo($rootScope, $scope, IHttp, $uibModalInstance, items, $timeout, auth, select, encrypt) {
    var promise,
        module = "oprm";

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };
    initData();
    function initData() {
        auth.curModule(module);
        $scope.jiaoItem = auth.loginUser();
        $scope.jieItem = {};
        $scope.jiePass = '';
        $scope.notes = '';
        IHttp.post("operation/searchShiftChangeList", { docId: items.docId }).then(function(result) {
            if (result.data.resultCode !== '1') return;
            $scope.list = result.data.resultList;
        });
        select.getAnaesthetists().then(function(result) {
            $scope.jieArray = result.data.userItem;
            for (var i = 0; i < $scope.jieArray.length; i++) {
                if ($scope.jiaoItem.userName === $scope.jieArray[i].userName) {
                    $scope.jieArray.splice(i, 1);
                    break;
                }
            }
        });
    }

    $scope.save = function() {
        var baseParam = {
            docId: items.docId,
            regOptId: items.regOptId,
            shiftChangedPeople: $scope.jiaoItem.name,
            shiftChangedPeopleId: $scope.jiaoItem.userName,
            shiftChangePeople: $scope.jieItem.name,
            shiftChangePeopleId: $scope.jieItem.userName,
            notes: $scope.notes,
            shiftChangePeoplePwd: encrypt.md5($scope.jiePass)
        };
        if (promise) {
            $timeout.cancel(promise);
        }
        promise = $timeout(function() {
            IHttp.post("operation/saveShiftChange", baseParam).then(function(result) {
                if (result.data.resultCode !== '1') return;
                auth.login({logionBeid: '', module: module, username: $scope.jieItem.userName, password: $scope.jiePass}).then(function(user) {
                    if (user.data.resultCode !== '1') return;
                    initData();
                    $scope.cancel = function() {
                        $uibModalInstance.close();
                    }
                });
            });
        }, 500);
    }

}
