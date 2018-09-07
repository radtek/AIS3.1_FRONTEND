baseconfig.$inject = ['$rootScope', '$scope', 'IHttp', 'toastr', 'uiGridConstants', '$timeout', '$uibModal', 'baseConfig','auth'];

module.exports = baseconfig;

function baseconfig($rootScope, $scope, IHttp, toastr, uiGridConstants, $timeout, $uibModal, baseConfig,auth) {
    $scope.markPosition = baseConfig.position;
    $scope.field = '';
    $scope.loginInfo = auth.loginUser();
    // 初始化数据
    baseConfig.init().then(function(rs) {
        var rsList = rs.data.resultList;
        for (var a = 0; a < rsList.length; a++) {
            if (rsList[a].configureValue)
                rsList[a].configureValue = JSON.parse(rsList[a].configureValue);
            else
                rsList[a].configureValue = {};
            // 手术流程
            if (rsList[a].modularType == 1)
                $scope.surgProc = rsList[a];
            // 手术排程
            else if (rsList[a].modularType == 2)
                $scope.surgSchedule = rsList[a];
            // 数据同步
            else if (rsList[a].modularType == 3)
                $scope.DS = rsList[a];
            // 用药配置
            else if (rsList[a].modularType == 4)
                $scope.med = rsList[a];
            // 入量配置
            else if (rsList[a].modularType == 5)
                $scope.i = rsList[a];
            // 其它配置
            else if (rsList[a].modularType == 6)
                $scope.other = rsList[a];
        }
    });

    // 手术流程
    $scope.$watch('surgProc', function(n, o) {
        if (angular.equals(n, o) || o == undefined)
            return;
        baseConfig.save(angular.copy(n));
        $timeout(function() {
            baseConfig.init();
        }, 1000);
    }, true);

    // 手术排程
    $scope.$watch('surgSchedule', function(n, o) {
        if (angular.equals(n, o) || o == undefined)
            return;
        baseConfig.save(angular.copy(n)); 
        $timeout(function() {
            baseConfig.init();
        }, 1000);       
    }, true);

    // 数据同步
    $scope.$watch('DS', function(n, o) {
        if (angular.equals(n, o) || o == undefined)
            return;
        baseConfig.save(angular.copy(n));
        $timeout(function() {
            baseConfig.init();
        }, 1000);
    }, true);

    // 用药配置
    $scope.$watch('med', function(n, o) {
        if (angular.equals(n, o) || o == undefined)
            return;
        baseConfig.save(angular.copy(n));
    }, true);

    // 入量配置
    $scope.$watch('i', function(n, o) {
        if (angular.equals(n, o) || o == undefined)
            return;
        baseConfig.save(angular.copy(n));
    }, true);

    // 其它配置
    $scope.$watch('other', function(n, o) {
        if (angular.equals(n, o) || o == undefined)
            return;
        if ($scope.field === 'oRows' && n.configureValue.oRows == undefined)
            return;
        if ($scope.field === 'mongRows' && n.configureValue.mongRows == undefined)
            return;
        baseConfig.save(angular.copy(n));
    }, true);
}