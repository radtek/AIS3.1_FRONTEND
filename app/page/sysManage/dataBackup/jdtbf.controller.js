addBackDataDict.$inject = ['$scope', 'IHttp', '$uibModalInstance', 'confirm', 'toastr', '$interval', '$timeout'];

module.exports = addBackDataDict;

/* @ngInject */
function addBackDataDict($rootScope, $scope,docNav,$state,$mdDialog,sessionService, $http, i18nService, $modal, uiGridConstants, $mdToast,breadcrumbs, $interval,$timeout) {  
  // 正在加载页面控制
  var promise;

  $scope.cancel = function() {
    $mdDialog.cancel();
  };

  var vm = this;
  vm.activated = true;
  vm.determinateValue = 30;

  $interval(function() {
    $scope.end=true;
  }, 100);
  function close(){
    $mdDialog.cancel();
  }
  $timeout(close,2600);
}