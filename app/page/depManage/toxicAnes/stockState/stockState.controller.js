stockStateCtrl.$inject = ['$rootScope', '$scope', '$state'];

module.exports = stockStateCtrl;

function stockStateCtrl($rootScope, $scope, $state) {
    $scope.currentMenu = angular.copy($scope.tabsMenu);
    $scope.state = $state;
    $scope.TabsStyle = { 'marginTop': '0px' }

    setTabsStyle($state.current.name);

    $scope.curTab = function(obj) {
        setTabsStyle(obj);
    }

    function setTabsStyle(url) {
        $scope.currentMenu.forEach(function(item, key) {
            if (url == item.url) {
                if (key == 0)
                    $scope.TabsStyle = { 'marginTop': '0px' }
                else
                    $scope.TabsStyle = { 'marginTop': '40px' }
            }
        })
    }
}