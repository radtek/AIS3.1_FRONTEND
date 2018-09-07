toxicAnesCtrl.$inject = ['$rootScope', '$scope',  '$state','auth'];

module.exports = toxicAnesCtrl;

function toxicAnesCtrl($rootScope, $scope,  $state,auth) {
	if($scope.tabsMenu.length>3){
		$scope.currentMenu=angular.copy($scope.tabsMenu);	
	}else{
		$scope.currentMenu=getMenu();
	}
	

	$scope.state = $state;

	function getMenu(){
		var menuArr = auth.userPermission();
		var ppid=$scope.tabsMenu[0].parentIds.split(',')[2];
		// if(!ppid){
		// 	ppid=$scope.tabsMenu[0].parentId;
		// }
		var currArr=[];
		for (var i = 0; i < menuArr.length; i++) {
			if(menuArr[i].parentId===ppid){
				currArr.push(menuArr[i]);
			}
		}
		return currArr;
	}
}