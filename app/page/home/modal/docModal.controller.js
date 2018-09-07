DocModalCtrl.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'auth', '$filter'];

module.exports = DocModalCtrl;

function DocModalCtrl($rootScope, $scope, $uibModalInstance, auth, $filter) {
    $scope.goto = function(name, item) {
        let menu = auth.userPermission();
        let state = item.state == '03' ? '术前访视' : '术后访视';
        var obj = $filter('filter')(menu, function(i) {
            return state == i.name;
        });
        var urls = $filter('filter')(menu, function(i) {
            return name == i.name;
        });
        var cur;
        for (var a = 0; a < urls.length; a++) {
            if (urls[a].parentIds.indexOf(obj[0].id) >= 0) {
                cur = urls[a];
                break;
            }
        }
        if (cur) {
            $uibModalInstance.close(cur);
            $rootScope.$state.go(cur.url, { regOptId: item.regOptId });
        }
    }

    $scope.ok = function() {
        $uibModalInstance.close();
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };
}
