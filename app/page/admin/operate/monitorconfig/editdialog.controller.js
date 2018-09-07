hospitaldialogCtrl.$inject = ['$rootScope', '$scope', '$filter', '$uibModal', '$uibModalInstance', '$timeout', 'IHttp', 'toastr', 'auth'];

module.exports = hospitaldialogCtrl;

function hospitaldialogCtrl($rootScope, $scope, $filter, $uibModal, $uibModalInstance, $timeout, IHttp, toastr, auth) {
    var loginInfo = auth.loginUser();
    var url;
    if ($scope.item) {
        url = 'basedata/insertBasMonitorConfig';
        $scope.obj = $scope.item;
        $scope.title = "编辑采集项";
    } else {
        $scope.obj = { "eventName": "", "frequency": 0, "precision": 0, "max": 100, "min": 0, "iconId": "", "eventDesc": "", "mustShow": "", "units": "", "beid": "0", "roomId": "0", deviceType: 3 };
        $scope.title = "新增采集项";
        url = 'basedata/insertBasMonitorConfig'; //新增采集指标接口
    }
    $scope.deviceTypeList = [{
        value: "3",
        label: '心电监护仪'
    }, {
        value: "5",
        label: '麻醉机'
    }];
    $scope.positionList = [{
        value: 0,
        label: '描点'
    }, {
        value: 1,
        label: '数字'
    }, {
        value: -1,
        label: '实时'
    }, ];
    $scope.mustShowList = [{
        value: '1',
        label: '必须显示'
    }, {
        value: '',
        label: '非必须显示'
    }];
    $scope.ok = function() {
        $scope.obj.widthAndHeight=parseInt($scope.obj.widthAndHeight);
        IHttp.post(url, $scope.obj).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            $uibModalInstance.close();
        })
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.goods = ["app/img/ico9.png", "app/img/ico4.png", "app/img/ico3.png", "app/img/ico1.png", "app/img/ico6.png", "app/img/icon11.png", "app/img/ico5.png", "app/img/ico2.png"];

    // $scope.obj.iconId = $scope.goods[0];

    $scope.popSelect = function() {
        $scope.pop = !$scope.pop;
    };

    $scope.select = function(item) {
        $scope.pop = false;
        $scope.obj.iconId = item;
    };

    $scope.checkedNames = function() {
        return $scope.goods.filter(function(it) {
            return it.checked;
        }).reduce(function(a, b) {
            return a + b.name + " ";
        }, "");
    };
}
