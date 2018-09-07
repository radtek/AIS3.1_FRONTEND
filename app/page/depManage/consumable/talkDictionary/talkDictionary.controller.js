talkDictionaryCtrl.$inject = ['$rootScope','$scope','$state'];

module.exports = talkDictionaryCtrl;

function talkDictionaryCtrl($rootScope,$scope,$state) {
	$scope.currentMenu=angular.copy($scope.tabsMenu);  
    $scope.state = $state;
}