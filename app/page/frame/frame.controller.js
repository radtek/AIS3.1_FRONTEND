FrameCtrl.$inject = ['$rootScope', '$scope', 'auth', 'menu', '$timeout', 'select'];

module.exports = FrameCtrl;

function FrameCtrl($rootScope, $scope, auth, menu, $timeout, select) {
    var pageState = $rootScope.$state.current,
        menus = auth.userPermission(),
        vm = this;
    $scope.curPage = pageState.name;
    $scope.user = auth.loginUser();
    let beCode = $scope.user.beCode;
    $scope.preUrl = $scope.user.module == 'oprm' ? 'operroom' : 'pacuroom';
    $scope.menu = menu.group(menus, $rootScope.crumbs);
    vm.operRoomId = auth.getRoomId() + '';

    if (pageState.name === 'operroom')
        vm.banSelectRoom = true;
    if ($scope.user.userType == 'ANAES_DOCTOR') {
        for (let group of $scope.menu) {
            if (group.name === 'features') {
                for (let item of group.arr) {
                    if (item.name === '手术排程') {
                        item.url = 'anaesthesiaSchedule';
                        break;
                    }
                }
                break;
            }
        }
    }

    select.operroom().then((rs) => {
        $scope.operRoomList = rs.data.resultList;
        $scope.operRoomList.unshift({
            operRoomId: '0',
            name: '请选择手术室'
        })
    });

    $scope.checkCrumbs = function(item) {
        var pageOption = JSON.parse(sessionStorage.getItem('pageOption'));
        pageOption.crumbs = '1';
        sessionStorage.setItem('pageOption', JSON.stringify(pageOption));
    }

    $scope.backCard = function() {
        clearTimeout($rootScope.timer_point);
        vm.banSelectRoom = true;
    }

    $scope.logout = function() {
        clearTimeout($rootScope.timer_point);
        if ($scope.user.module == 'ctrlcent')
            $rootScope.$state.go('login');
        else if ($scope.user.module == 'pacu')
            $rootScope.$state.go('pacu');
        else if ($scope.user.module == 'oprm')
            $rootScope.$state.go('login');
    }

    $scope.toggle = function(item) {
        $scope.menu = menu.target(item, $scope.menu);
        var pageOption = JSON.parse(sessionStorage.getItem('pageOption'));
        if (pageOption) pageOption.crumbs = '0';
        sessionStorage.setItem('pageOption', JSON.stringify(pageOption));
    }

    $scope.changeRoomId = function() {
        $scope.$broadcast('operRoomId', vm.operRoomId)
    }

    $scope.$on('banSelectRoom', function(ev, data) {
        vm.banSelectRoom = data;
    })

    $scope.eq = function(a, b) {
        return angular.equals(a, b);
    }
}